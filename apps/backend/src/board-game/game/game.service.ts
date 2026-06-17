// src/game/game.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, or, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../../db/db.service';
import { gameSessions, moves, lobbies, type GameSession, type Move, type NewMove } from '../../db/schema';
import { HnefataflEngine } from '../hnefatafl/hnefatafl.engine';

export interface MoveRequest {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface GameResult {
  winnerId: string;
  winnerSide?: 'attacker' | 'defender';
  reason: 'king_escaped' | 'king_captured' | 'forfeit' | 'disconnect';
}

@Injectable()
export class GameService {
  // Track disconnected players with timestamps for auto-forfeit
  private disconnectedPlayers = new Map<string, { playerId: string; timestamp: number }>();

  // 60 seconds disconnect timeout before auto-forfeit
  private readonly DISCONNECT_TIMEOUT_MS = 60000;

  constructor(private db: DbService) {}

  // ─── Session Management ────────────────────────────────────────────────────
// ... (omitting lines for brevity in thought process, but tool expects exact match)

  async findSessionById(sessionId: string): Promise<GameSession | null> {
    const result = await this.db.db.select().from(gameSessions).where(eq(gameSessions.id, sessionId)).limit(1);
    return result[0] ?? null;
  }

  async findActiveSessionForPlayer(playerId: string): Promise<GameSession | null> {
    const result = await this.db.db
      .select()
      .from(gameSessions)
      .where(
        and(
          or(eq(gameSessions.attackerId, playerId), eq(gameSessions.defenderId, playerId)),
          eq(gameSessions.status, 'active')
        )
      )
      .limit(1);
    return result[0] ?? null;
  }

  async getSessionHistory(sessionId: string): Promise<Move[]> {
    return this.db.db.select().from(moves).where(eq(moves.sessionId, sessionId)).orderBy(moves.moveNumber);
  }

  // ─── Game State Management ─────────────────────────────────────────────────

  async makeMove(
    sessionId: string,
    playerId: string,
    move: MoveRequest
  ): Promise<{
    boardState: string[][];
    captures?: string[];
    gameOver?: GameResult;
  }> {
    const session = await this.findSessionById(sessionId);
    if (!session) throw new NotFoundException('Game session not found');
    if (session.status !== 'active') {
      throw new BadRequestException('Game is not active');
    }

    // Validate it's the player's turn
    const isAttackerTurn = session.currentTurn === 'attacker';
    const expectedPlayerId = isAttackerTurn ? session.attackerId : session.defenderId;

    if (playerId !== expectedPlayerId) {
      throw new BadRequestException('Not your turn');
    }

    // Validate and execute move
    const currentBoard = session.boardState as string[][];
    const piece = currentBoard[move.fromRow]?.[move.fromCol];

    if (!piece || piece === '.') {
      throw new BadRequestException('No piece at source position');
    }

    // Basic validation: attacker can only move 'A', defender can move 'D' or 'K'
    if (isAttackerTurn && piece !== 'A') {
      throw new BadRequestException('You can only move attacker pieces');
    }
    if (!isAttackerTurn && piece !== 'D' && piece !== 'K') {
      throw new BadRequestException('You can only move defender pieces');
    }

    // Validate move is valid (orthogonal, not blocked)
    if (!this.isValidMove(currentBoard, move)) {
      throw new BadRequestException('Invalid move');
    }

    // Execute move
    const newBoard = this.executeMove(currentBoard, move);

    // Check for captures
    const captures = this.checkCaptures(newBoard, move.toRow, move.toCol);

    // Check for game over conditions
    const gameOverResult = this.checkGameOver(newBoard);
    let gameOver: GameResult | undefined = undefined;

    // Record move in database
    const moveCount = await this.getMoveCount(sessionId);
    const newMove: NewMove = {
      id: uuidv4(),
      sessionId,
      playerId,
      fromRow: move.fromRow,
      fromCol: move.fromCol,
      toRow: move.toRow,
      toCol: move.toCol,
      moveNumber: moveCount + 1,
      boardSnapshot: newBoard,
    };
    await this.db.db.insert(moves).values(newMove);

    // Update session
    if (gameOverResult) {
      const winnerId = gameOverResult.winnerSide === 'attacker' ? session.attackerId : session.defenderId;
      gameOver = {
        winnerId,
        winnerSide: gameOverResult.winnerSide,
        reason: gameOverResult.reason,
      };

      await this.db.db
        .update(gameSessions)
        .set({
          boardState: newBoard,
          status: 'finished',
          winnerId: gameOver.winnerId,
          winReason: gameOver.reason,
          endedAt: new Date(),
        })
        .where(eq(gameSessions.id, sessionId));
    } else {
      // Switch turns
      const nextTurn = isAttackerTurn ? 'defender' : 'attacker';
      await this.db.db
        .update(gameSessions)
        .set({
          boardState: newBoard,
          currentTurn: nextTurn,
        })
        .where(eq(gameSessions.id, sessionId));
    }

    return { boardState: newBoard, captures, gameOver: gameOver ?? undefined };
  }

  async forfeit(sessionId: string, playerId: string): Promise<GameResult> {
    const session = await this.findSessionById(sessionId);
    if (!session) throw new NotFoundException('Game session not found');
    if (session.status !== 'active') {
      throw new BadRequestException('Game is not active');
    }

    // Determine winner (the other player)
    const winnerId = playerId === session.attackerId ? session.defenderId : session.attackerId;

    await this.db.db
      .update(gameSessions)
      .set({
        status: 'finished',
        winnerId,
        winReason: 'forfeit',
        endedAt: new Date(),
      })
      .where(eq(gameSessions.id, sessionId));

    return { winnerId, reason: 'forfeit' };
  }

  // ─── Disconnection Management ──────────────────────────────────────────────

  handlePlayerDisconnect(sessionId: string, playerId: string): void {
    const key = `${sessionId}:${playerId}`;
    this.disconnectedPlayers.set(key, {
      playerId,
      timestamp: Date.now(),
    });

    // Set timeout to auto-forfeit if player doesn't reconnect
    setTimeout(() => {
      const disconnectInfo = this.disconnectedPlayers.get(key);
      if (disconnectInfo) {
        // Player still disconnected after timeout
        void this.findSessionById(sessionId).then((session) => {
          if (session && session.status === 'active') {
            // Auto-forfeit due to disconnect timeout
            const winnerId = playerId === session.attackerId ? session.defenderId : session.attackerId;

            void this.db.db
              .update(gameSessions)
              .set({
                status: 'finished',
                winnerId,
                winReason: 'disconnect',
                endedAt: new Date(),
              })
              .where(eq(gameSessions.id, sessionId));
          }
          this.disconnectedPlayers.delete(key);
        });
      }
    }, this.DISCONNECT_TIMEOUT_MS);
  }

  handlePlayerReconnect(sessionId: string, playerId: string): void {
    const key = `${sessionId}:${playerId}`;
    this.disconnectedPlayers.delete(key);
  }

  isPlayerDisconnected(sessionId: string, playerId: string): boolean {
    const key = `${sessionId}:${playerId}`;
    return this.disconnectedPlayers.has(key);
  }

  getDisconnectTimeRemaining(sessionId: string, playerId: string): number {
    const key = `${sessionId}:${playerId}`;
    const info = this.disconnectedPlayers.get(key);
    if (!info) return 0;

    const elapsed = Date.now() - info.timestamp;
    const remaining = this.DISCONNECT_TIMEOUT_MS - elapsed;
    return Math.max(0, remaining);
  }

  // ─── Rematch Flow ──────────────────────────────────────────────────────────

  async createRematch(originalSessionId: string, requestingPlayerId: string): Promise<GameSession> {
    const originalSession = await this.findSessionById(originalSessionId);
    if (!originalSession) {
      throw new NotFoundException('Original game session not found');
    }
    if (originalSession.status !== 'finished') {
      throw new BadRequestException('Original game is not finished');
    }

    // Verify requesting player was in the game
    if (requestingPlayerId !== originalSession.attackerId && requestingPlayerId !== originalSession.defenderId) {
      throw new BadRequestException('You were not in this game');
    }

    // Get the original lobby
    const lobby = await this.db.db.select().from(lobbies).where(eq(lobbies.id, originalSession.lobbyId)).limit(1);

    if (!lobby[0]) {
      throw new NotFoundException('Original lobby not found');
    }

    // Create new session with swapped sides
    const newSession: GameSession = {
      id: uuidv4(),
      lobbyId: originalSession.lobbyId,
      attackerId: originalSession.defenderId, // Swap sides
      defenderId: originalSession.attackerId,
      boardState: HnefataflEngine.initialBoard(),
      currentTurn: 'attacker',
      status: 'active',
      winnerId: null,
      winReason: null,
      startedAt: new Date(),
      endedAt: null,
    };

    await this.db.db.insert(gameSessions).values(newSession);
    return newSession;
  }

  // ─── Game Logic Helpers ────────────────────────────────────────────────────

  private isValidMove(board: string[][], move: MoveRequest): boolean {
    const { fromRow, fromCol, toRow, toCol } = move;

    // Must be orthogonal (same row or same col, not both)
    if (fromRow !== toRow && fromCol !== toCol) return false;
    if (fromRow === toRow && fromCol === toCol) return false;

    // Check path is clear
    if (fromRow === toRow) {
      // Horizontal move
      const start = Math.min(fromCol, toCol);
      const end = Math.max(fromCol, toCol);
      for (let c = start + 1; c < end; c++) {
        if (board[fromRow][c] !== '.') return false;
      }
    } else {
      // Vertical move
      const start = Math.min(fromRow, toRow);
      const end = Math.max(fromRow, toRow);
      for (let r = start + 1; r < end; r++) {
        if (board[r][fromCol] !== '.') return false;
      }
    }

    // Destination must be empty (or throne for king only)
    const destPiece = board[toRow][toCol];
    return destPiece === '.';
  }

  private executeMove(board: string[][], move: MoveRequest): string[][] {
    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[move.fromRow][move.fromCol];
    newBoard[move.fromRow][move.fromCol] = '.';
    newBoard[move.toRow][move.toCol] = piece;
    return newBoard;
  }

  private checkCaptures(board: string[][], row: number, col: number): string[] {
    const captures: string[] = [];
    const piece = board[row][col];

    // Check all 4 directions for captures
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    for (const [dr, dc] of directions) {
      const targetRow = row + dr;
      const targetCol = col + dc;
      const oppositeRow = row + dr * 2;
      const oppositeCol = col + dc * 2;

      // Check bounds
      if (
        targetRow < 0 ||
        targetRow >= 11 ||
        targetCol < 0 ||
        targetCol >= 11 ||
        oppositeRow < 0 ||
        oppositeRow >= 11 ||
        oppositeCol < 0 ||
        oppositeCol >= 11
      )
        continue;

      const target = board[targetRow][targetCol];
      const opposite = board[oppositeRow][oppositeCol];

      // Capture logic: sandwich enemy between two friendly pieces
      // Attacker ('A') captures Defender/King, Defender ('D'/'K') captures Attacker
      if (piece === 'A' && (target === 'D' || target === 'K') && opposite === 'A') {
        captures.push(`${targetRow},${targetCol}`);
        board[targetRow][targetCol] = '.'; // Remove captured piece
      } else if ((piece === 'D' || piece === 'K') && target === 'A' && (opposite === 'D' || opposite === 'K')) {
        captures.push(`${targetRow},${targetCol}`);
        board[targetRow][targetCol] = '.'; // Remove captured piece
      }
    }

    return captures;
  }

  private checkGameOver(board: string[][]): { winnerSide: 'attacker' | 'defender'; reason: GameResult['reason'] } | null {
    // Check if king escaped (reached a corner)
    const corners = [
      [0, 0],
      [0, 10],
      [10, 0],
      [10, 10],
    ];

    for (const [r, c] of corners) {
      if (board[r][c] === 'K') {
        // King escaped - defender wins
        return { winnerSide: 'defender', reason: 'king_escaped' };
      }
    }

    // Check if king is surrounded orthogonally by 4 attackers.
    // This prevents the king from being declared captured with only 3 attackers around it.
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        if (board[r][c] !== 'K') continue;

        const neighbors = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ];

        const isFullySurrounded = neighbors.every(([nr, nc]) => {
          if (nr < 0 || nr >= 11 || nc < 0 || nc >= 11) return false;
          return board[nr][nc] === 'A';
        });

        if (isFullySurrounded) {
          return { winnerSide: 'attacker', reason: 'king_captured' };
        }
      }
    }

    // Check if king was captured by removal from the board.
    let kingFound = false;
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        if (board[r][c] === 'K') {
          kingFound = true;
          break;
        }
      }
      if (kingFound) break;
    }

    if (!kingFound) {
      // King captured - attacker wins
      return { winnerSide: 'attacker', reason: 'king_captured' };
    }

    return null;
  }

  private async getMoveCount(sessionId: string): Promise<number> {
    const result = await this.db.db.select().from(moves).where(eq(moves.sessionId, sessionId));
    return result.length;
  }
}
