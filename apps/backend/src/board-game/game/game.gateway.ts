// src/game/game.gateway.ts
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
import { GameService, type MoveRequest } from './game.service';
import type { Player } from '../../db/schema';

type Socket = BaseSocket & {
  data: {
    player?: Player;
    sessionId?: string;
  };
};

@WebSocketGateway({
  namespace: '/game',
  cors: { origin: '*' }, // tighten this in production
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track pending rematch requests: sessionId -> requestingPlayerId
  private rematchRequests = new Map<string, string>();

  constructor(
    private playerService: PlayerService,
    private gameService: GameService
  ) {}

  // ─── Connection ────────────────────────────────────────────────────────────
  // Called when a socket connects to /game
  // Frontend: io('/game', { auth: { token: '...' } })

  async handleConnection(client: Socket) {
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string | undefined;

    if (!token) {
      client.emit('error', { message: 'No session token provided' });
      client.disconnect();
      return;
    }

    try {
      const player = await this.playerService.findByToken(token);
      client.data.player = player;
    } catch {
      client.emit('error', { message: 'Invalid session token' });
      client.disconnect();
    }
  }

  // ─── Disconnection ─────────────────────────────────────────────────────────
  // Called when a socket drops during an active game

  async handleDisconnect(client: Socket) {
    const player = client.data.player;
    if (!player) return;

    const sessionId = client.data.sessionId;
    if (!sessionId) return;

    try {
      const session = await this.gameService.findSessionById(sessionId);
      if (!session || session.status !== 'active') return;

      // Mark player as disconnected with timeout
      this.gameService.handlePlayerDisconnect(sessionId, player.id);

      // Notify the other player
      this.server.to(`game:${sessionId}`).emit('game:player_disconnected', {
        playerId: player.id,
        timeoutMs: 60000, // 60 seconds before auto-forfeit
      });
    } catch {
      // Session may have already ended
    }
  }

  // ─── game:join ─────────────────────────────────────────────────────────────
  // Player joins a game session (called after lobby:start or on reconnect)
  // Client: socket.emit('game:join', { sessionId: '...' })
  // Response: 'game:joined' with full game state

  @SubscribeMessage('game:join')
  async onJoinGame(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId: string }) {
    const player = this.requirePlayer(client);
    const session = await this.gameService.findSessionById(body.sessionId);

    if (!session) throw new WsException('Game session not found');

    // Verify player is part of this game
    if (player.id !== session.attackerId && player.id !== session.defenderId) {
      throw new WsException('You are not in this game');
    }

    client.data.sessionId = body.sessionId;
    await client.join(`game:${body.sessionId}`);

    // Handle reconnection if player was marked as disconnected
    if (this.gameService.isPlayerDisconnected(body.sessionId, player.id)) {
      this.gameService.handlePlayerReconnect(body.sessionId, player.id);

      // Notify the other player about reconnection
      client.to(`game:${body.sessionId}`).emit('game:player_reconnected', {
        playerId: player.id,
      });
    }

    // Get move history for replay/sync
    const moveHistory = await this.gameService.getSessionHistory(body.sessionId);

    // Determine player's role
    const role = player.id === session.attackerId ? 'attacker' : 'defender';

    client.emit('game:joined', {
      sessionId: session.id,
      role,
      attackerId: session.attackerId,
      defenderId: session.defenderId,
      boardState: session.boardState,
      currentTurn: session.currentTurn,
      status: session.status,
      moveHistory,
      winnerId: session.winnerId,
      winReason: session.winReason,
    });
  }

  // ─── game:move ─────────────────────────────────────────────────────────────
  // Player makes a move
  // Client: socket.emit('game:move', { fromRow, fromCol, toRow, toCol })
  // Broadcasts: 'game:move_made' to both players

  @SubscribeMessage('game:move')
  async onMove(@ConnectedSocket() client: Socket, @MessageBody() body: MoveRequest) {
    const player = this.requirePlayer(client);
    const sessionId = client.data.sessionId;

    if (!sessionId) throw new WsException('You are not in a game');

    try {
      const result = await this.gameService.makeMove(sessionId, player.id, body);

      // Broadcast move to both players
      this.server.to(`game:${sessionId}`).emit('game:move_made', {
        playerId: player.id,
        move: body,
        boardState: result.boardState,
        captures: result.captures,
        gameOver: result.gameOver,
      });
    } catch (error) {
      // Send error only to the player who made the invalid move
      client.emit('game:error', {
        message: error instanceof Error ? error.message : 'Invalid move',
      });
    }
  }

  // ─── game:forfeit ──────────────────────────────────────────────────────────
  // Player forfeits the game
  // Client: socket.emit('game:forfeit')
  // Broadcasts: 'game:ended' to both players

  @SubscribeMessage('game:forfeit')
  async onForfeit(@ConnectedSocket() client: Socket) {
    const player = this.requirePlayer(client);
    const sessionId = client.data.sessionId;

    if (!sessionId) throw new WsException('You are not in a game');

    const result = await this.gameService.forfeit(sessionId, player.id);

    this.server.to(`game:${sessionId}`).emit('game:ended', {
      winnerId: result.winnerId,
      reason: result.reason,
      forfeitedBy: player.id,
    });
  }

  // ─── game:request_rematch ──────────────────────────────────────────────────
  // Player requests a rematch after game ends
  // Client: socket.emit('game:request_rematch', { sessionId: '...' })
  // If both accept: broadcasts 'game:rematch_started' with new sessionId

  @SubscribeMessage('game:request_rematch')
  async onRequestRematch(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId: string }) {
    const player = this.requirePlayer(client);
    const session = await this.gameService.findSessionById(body.sessionId);

    if (!session) throw new WsException('Game session not found');
    if (session.status !== 'finished') {
      throw new WsException('Game is not finished yet');
    }

    // Verify player was in the game
    if (player.id !== session.attackerId && player.id !== session.defenderId) {
      throw new WsException('You were not in this game');
    }

    // Check if there's already a pending request
    const pendingRequest = this.rematchRequests.get(body.sessionId);

    if (pendingRequest && pendingRequest !== player.id) {
      // Other player already requested - both accepted, create rematch!
      const newSession = await this.gameService.createRematch(body.sessionId, player.id);

      // Clear the pending request
      this.rematchRequests.delete(body.sessionId);

      // Notify both players about the new game
      this.server.to(`game:${body.sessionId}`).emit('game:rematch_started', {
        sessionId: newSession.id,
        attackerId: newSession.attackerId,
        defenderId: newSession.defenderId,
        boardState: newSession.boardState,
      });
    } else {
      // First request - store it and notify the other player
      this.rematchRequests.set(body.sessionId, player.id);

      client.to(`game:${body.sessionId}`).emit('game:rematch_requested', {
        requestedBy: player.id,
      });

      client.emit('game:rematch_pending', {
        message: 'Waiting for opponent to accept',
      });
    }
  }

  // ─── game:cancel_rematch ───────────────────────────────────────────────────
  // Player cancels/declines a rematch request
  // Client: socket.emit('game:cancel_rematch', { sessionId: '...' })

  @SubscribeMessage('game:cancel_rematch')
  onCancelRematch(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId: string }) {
    this.requirePlayer(client);

    // Remove pending request if exists
    const pendingRequest = this.rematchRequests.get(body.sessionId);
    if (pendingRequest) {
      this.rematchRequests.delete(body.sessionId);

      // Notify the other player
      client.to(`game:${body.sessionId}`).emit('game:rematch_cancelled', {
        cancelledBy: this.requirePlayer(client).id,
      });
    }
  }

  // ─── game:get_state ────────────────────────────────────────────────────────
  // Get current game state (useful for refreshing after reconnect)
  // Client: socket.emit('game:get_state', { sessionId: '...' })
  // Response: 'game:state' with full game data

  @SubscribeMessage('game:get_state')
  async onGetState(@ConnectedSocket() client: Socket, @MessageBody() body: { sessionId: string }) {
    const player = this.requirePlayer(client);
    const session = await this.gameService.findSessionById(body.sessionId);

    if (!session) throw new WsException('Game session not found');

    // Verify player is part of this game
    if (player.id !== session.attackerId && player.id !== session.defenderId) {
      throw new WsException('You are not in this game');
    }

    const moveHistory = await this.gameService.getSessionHistory(body.sessionId);
    const role = player.id === session.attackerId ? 'attacker' : 'defender';

    // Check if opponent is disconnected
    const opponentId = player.id === session.attackerId ? session.defenderId : session.attackerId;
    const opponentDisconnected = this.gameService.isPlayerDisconnected(body.sessionId, opponentId);
    const disconnectTimeRemaining = opponentDisconnected
      ? this.gameService.getDisconnectTimeRemaining(body.sessionId, opponentId)
      : null;

    client.emit('game:state', {
      sessionId: session.id,
      role,
      attackerId: session.attackerId,
      defenderId: session.defenderId,
      boardState: session.boardState,
      currentTurn: session.currentTurn,
      status: session.status,
      moveHistory,
      winnerId: session.winnerId,
      winReason: session.winReason,
      opponentDisconnected,
      disconnectTimeRemaining,
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private requirePlayer(client: Socket): Player {
    const player = client.data.player;
    if (!player) throw new WsException('Not authenticated');
    return player;
  }
}
