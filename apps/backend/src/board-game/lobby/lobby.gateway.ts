// src/lobby/lobby.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket as BaseSocket } from 'socket.io';
import { PlayerService } from '../player/player.service';
import { LobbyService } from './lobby.service';
import type { Player } from '../../db/schema';

type Socket = BaseSocket & {
  data: {
    player?: Player;
    lobbyCode?: string;
  };
};

// each socket joins a room named after the lobby code
// so we can emit to all players in that lobby easily
// e.g. this.server.to('lobby:5249').emit(...)

@WebSocketGateway({
  namespace: '/lobby',
  cors: { origin: '*' }, // tighten this to your frontend URL in production
})
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private playerService: PlayerService,
    private lobbyService: LobbyService
  ) { }

  // ─── Connection ────────────────────────────────────────────────────────────
  // Called automatically when a socket connects to /lobby
  // Frontend connects with: io('/lobby', { auth: { token: '...' } })

  async handleConnection(client: Socket) {
    // Accept token from either auth object or query parameter
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string | undefined;

    if (!token) {
      client.emit('error', { message: 'No session token provided' });
      client.disconnect();
      return;
    }

    try {
      const player = await this.playerService.findByToken(token);
      // attach player to socket so we don't re-query on every event
      client.data.player = player;
      client.emit('authenticated'); // ← add this
    } catch {
      client.emit('error', { message: 'Invalid session token' });
      client.disconnect();
    }
  }

  // ─── Disconnection ─────────────────────────────────────────────────────────
  // Called automatically when a socket drops (tab close, network loss, etc.)

  async handleDisconnect(client: Socket) {
    const player = client.data.player;
    if (!player) return;

    const code = client.data.lobbyCode;
    if (!code) return;

    try {
      const lobby = await this.lobbyService.findByCode(code);
      if (!lobby) return;

      // only emit if lobby is still in waiting state
      // (if game already started, game gateway takes over disconnect handling)
      if (lobby.status !== 'waiting') return;

      const isHost = lobby.hostId === player.id;
      const isGuest = lobby.guestId === player.id;

      if (isGuest) {
        // guest left the waiting room — clear them from lobby, notify host
        await this.lobbyService.removeGuest(code);
        this.server.to(`lobby:${code}`).emit('lobby:player_left', {
          playerId: player.id,
          name: player.name,
        });
      }

      if (isHost) {
        // host abandoned — close the lobby, kick the guest if present
        await this.lobbyService.abandon(code);
        this.server.to(`lobby:${code}`).emit('lobby:abandoned', {
          message: 'Host disconnected — lobby closed',
        });
      }
    } catch {
      // player or lobby already cleaned up — safe to ignore
    }
  }

  // ─── lobby:host ────────────────────────────────────────────────────────────
  // Host calls this after POST /lobbies gives them a code.
  // Joins the socket room so they receive events.
  //
  // Client emits:  socket.emit('lobby:host', { code: '5249' })
  // Server emits back to host: 'lobby:ready' with lobby details

  @SubscribeMessage('lobby:host')
  async onHost(@ConnectedSocket() client: Socket, @MessageBody() body: { code: string }) {
    const player = this.requirePlayer(client);
    const lobby = await this.lobbyService.findByCode(body.code);

    if (!lobby) throw new WsException('Lobby not found');
    if (lobby.hostId !== player.id) throw new WsException('You are not the host of this lobby');
    if (lobby.status !== 'waiting') throw new WsException('Lobby is no longer open');

    client.data.lobbyCode = body.code;
    await client.join(`lobby:${body.code}`);

    client.emit('lobby:ready', {
      code: lobby.code,
      hostId: lobby.hostId,
      status: lobby.status,
    });
  }

  // ─── lobby:join ────────────────────────────────────────────────────────────
  // Guest calls this after entering a 4-digit code in the UI.
  // Joins the socket room and notifies the host.
  //
  // Client emits:  socket.emit('lobby:join', { code: '5249' })
  // Server emits to guest: 'lobby:joined'
  // Server emits to host:  'lobby:player_joined'

  @SubscribeMessage('lobby:join')
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { code: string }) {
    const player = this.requirePlayer(client);
    const lobby = await this.lobbyService.findByCode(body.code);

    if (!lobby) throw new WsException('Lobby not found');
    if (lobby.status !== 'waiting') throw new WsException('Lobby is not open');
    if (lobby.hostId === player.id) throw new WsException('You cannot join your own lobby');
    if (lobby.guestId) throw new WsException('Lobby is already full');

    // persist guest in DB
    await this.lobbyService.addGuest(body.code, player.id);

    client.data.lobbyCode = body.code;
    await client.join(`lobby:${body.code}`);

    // confirm to the guest
    client.emit('lobby:joined', {
      code: lobby.code,
      hostId: lobby.hostId,
      guestId: player.id,
    });

    // notify the host — this is what makes the "Start Game" button activate
    client.to(`lobby:${body.code}`).emit('lobby:player_joined', {
      playerId: player.id,
      name: player.name,
    });
  }

  // ─── lobby:start ───────────────────────────────────────────────────────────
  // Host calls this when they click "Start Game".
  // Only works once a guest has joined.
  //
  // Client emits:  socket.emit('lobby:start')
  // Server emits to both: 'game:started' with sessionId to redirect to game

  @SubscribeMessage('lobby:start')
  async onStart(@ConnectedSocket() client: Socket) {
    const player = this.requirePlayer(client);
    const code = client.data.lobbyCode;

    if (!code) throw new WsException('You are not in a lobby');

    const lobby = await this.lobbyService.findByCode(code);

    if (!lobby) throw new WsException('Lobby not found');
    if (lobby.hostId !== player.id) throw new WsException('Only the host can start the game');
    if (!lobby.guestId) throw new WsException('Waiting for a second player');
    if (lobby.status !== 'waiting') throw new WsException('Game already started');

    // create the game session and mark lobby as active
    const session = await this.lobbyService.startGame(code);

    // emit to everyone in the room (host + guest)
    this.server.to(`lobby:${code}`).emit('game:started', {
      sessionId: session.id,
      attackerId: session.attackerId, // Vikings
      defenderId: session.defenderId, // King's side
      boardState: session.boardState,
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private requirePlayer(client: Socket): Player {
    const player = client.data.player;
    if (!player) throw new WsException('Not authenticated');
    return player;
  }
}
