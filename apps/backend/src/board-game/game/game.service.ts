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
  private disconnectedPlayers = new Map<string, { playerId: string; timestamp: number }>();
  private readonly DISCONNECT_TIMEOUT_MS = 60000;

  constructor(private db: DbService) {}

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

    const isAttackerTurn = session.currentTurn === 'attacker';
    const expectedPlayerId = isAttackerTurn ? session.attackerId : session.defenderId;

    if (playerId !== expectedPlayerId) {
      throw new BadRequestException('Not your turn');
    }

    const currentBoard = session.boardState as string[][];
    const piece = currentBoard[move.fromRow]?.[move.fromCol];

    if (!piece || piece === '.') {
      throw new BadRequestException('No piece at source position');
    }

    if (isAttackerTurn && piece !== 'A') {
      throw new BadRequestException('You can only move attacker pieces');
    }
    if (!isAttackerTurn && piece !== 'D' && piece !== 'K') {
      throw new BadRequestException('You can only move defender pieces');
    }

    if (!this.isValidMove(currentBoard, move)) {
      throw new BadRequestException('Invalid move');
    }

    let newBoard = this.executeMove(currentBoard, move);

    const captures = this.checkCaptures(newBoard, move.toRow, move.toCol);

    const gameOverResult = this.checkGameOver(newBoard, session.currentTurn);
    let gameOver: GameResult | undefined = undefined;

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

  handlePlayerDisconnect(sessionId: string, playerId: string): void {
    const key = `${sessionId}:${playerId}`;
    this.disconnectedPlayers.set(key, {
      playerId,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      const disconnectInfo = this.disconnectedPlayers.get(key);
      if (disconnectInfo) {
        void this.findSessionById(sessionId).then((session) => {
          if (session && session.status === 'active') {
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

  async createRematch(originalSessionId: string, requestingPlayerId: string): Promise<GameSession> {
    const originalSession = await this.findSessionById(originalSessionId);
    if (!originalSession) {
      throw new NotFoundException('Original game session not found');
    }
    if (originalSession.status !== 'finished') {
      throw new BadRequestException('Original game is not finished');
    }

    if (requestingPlayerId !== originalSession.attackerId && requestingPlayerId !== originalSession.defenderId) {
      throw new BadRequestException('You were not in this game');
    }

    const lobby = await this.db.db.select().from(lobbies).where(eq(lobbies.id, originalSession.lobbyId)).limit(1);

    if (!lobby[0]) {
      throw new NotFoundException('Original lobby not found');
    }

    const newSession: GameSession = {
      id: uuidv4(),
      lobbyId: originalSession.lobbyId,
      attackerId: originalSession.defenderId,
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

  private isValidMove(board: string[][], move: MoveRequest): boolean {
    const { fromRow, fromCol, toRow, toCol } = move;

    if (fromRow !== toRow && fromCol !== toCol) return false;
    if (fromRow === toRow && fromCol === toCol) return false;

    if (fromRow === toRow) {
      const start = Math.min(fromCol, toCol);
      const end = Math.max(fromCol, toCol);
      for (let c = start + 1; c < end; c++) {
        if (board[fromRow][c] !== '.') return false;
      }
    } else {
      const start = Math.min(fromRow, toRow);
      const end = Math.max(fromRow, toRow);
      for (let r = start + 1; r < end; r++) {
        if (board[r][fromCol] !== '.') return false;
      }
    }

    const piece = board[fromRow][fromCol];
    const isCorner = (r: number, c: number) => (r === 0 && c === 0) || (r === 0 && c === 10) || (r === 10 && c === 0) || (r === 10 && c === 10);
    const isThrone = (r: number, c: number) => r === 5 && c === 5;

    if (piece !== 'K' && (isCorner(toRow, toCol) || isThrone(toRow, toCol))) {
      return false;
    }

    return board[toRow][toCol] === '.';
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
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; 

    const isCorner = (r: number, c: number) => (r === 0 && c === 0) || (r === 0 && c === 10) || (r === 10 && c === 0) || (r === 10 && c === 10);
    const isThrone = (r: number, c: number) => r === 5 && c === 5;

    for (const [dr, dc] of directions) {
      const targetRow = row + dr;
      const targetCol = col + dc;
      const oppositeRow = row + dr * 2;
      const oppositeCol = col + dc * 2;

      if (targetRow < 0 || targetRow >= 11 || targetCol < 0 || targetCol >= 11) continue;

      const target = board[targetRow][targetCol];
      
      if (target === '.' || target === piece) continue; 

      if (target === 'K') continue;
      if (piece === 'D' && target === 'K') continue; 
      if (piece === 'K' && target === 'D') continue; 

      let isOppositeFriendly = false;
      const isOppositeOut = oppositeRow < 0 || oppositeRow >= 11 || oppositeCol < 0 || oppositeCol >= 11;

      if (!isOppositeOut) {
        const oppositePiece = board[oppositeRow][oppositeCol];
        const isHostileStructure = isCorner(oppositeRow, oppositeCol) || (isThrone(oppositeRow, oppositeCol) && oppositePiece === '.');

        if (piece === 'A') {
          isOppositeFriendly = oppositePiece === 'A' || isHostileStructure;
        } else if (piece === 'D' || piece === 'K') {
          isOppositeFriendly = oppositePiece === 'D' || oppositePiece === 'K' || isHostileStructure;
        }
      }

      const isOppositeEdgeHostile = isOppositeOut;

      if (isOppositeFriendly || isOppositeEdgeHostile) {
        captures.push(`${targetRow},${targetCol}`);
        board[targetRow][targetCol] = '.';
      }
    }

    return captures;
  }

  private checkGameOver(board: string[][], currentTurn: 'attacker' | 'defender'): { winnerSide: 'attacker' | 'defender'; reason: GameResult['reason'] } | null {
    const corners = [[0, 0], [0, 10], [10, 0], [10, 10]];
    for (const [r, c] of corners) {
      if (board[r][c] === 'K') {
        return { winnerSide: 'defender', reason: 'king_escaped' };
      }
    }

    if (currentTurn !== 'attacker') return null;

    let kingRow = -1;
    let kingCol = -1;
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        if (board[r][c] === 'K') {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    if (kingRow === -1) {
      return { winnerSide: 'attacker', reason: 'king_captured' };
    }

    const isThrone = (r: number, c: number) => r === 5 && c === 5;
    const isCorner = (r: number, c: number) => (r === 0 && c === 0) || (r === 0 && c === 10) || (r === 10 && c === 0) || (r === 10 && c === 10);
    const isNextToThrone = (r: number, c: number) => Math.abs(r - 5) + Math.abs(c - 5) === 1;
    const neighbors = [
      [kingRow - 1, kingCol],
      [kingRow + 1, kingCol],
      [kingRow, kingCol - 1],
      [kingRow, kingCol + 1],
    ];

    let hostileCount = 0;
    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= 11 || nc < 0 || nc >= 11) continue;

      const piece = board[nr][nc];
      if (piece === 'A' || (isThrone(nr, nc) && piece === '.')) {
        hostileCount++;
      }
    }

    if (isThrone(kingRow, kingCol)) {
      if (hostileCount === 4) return { winnerSide: 'attacker', reason: 'king_captured' };
    } else if (isNextToThrone(kingRow, kingCol)) {
      if (hostileCount === 4) return { winnerSide: 'attacker', reason: 'king_captured' };
    } else {
      const isHostileCell = (r: number, c: number) => {
        if (r < 0 || r >= 11 || c < 0 || c >= 11) return false;
        return board[r][c] === 'A' || isCorner(r, c) || (isThrone(r, c) && board[r][c] === '.');
      };

      const capturedHorizontally = isHostileCell(kingRow, kingCol - 1) && isHostileCell(kingRow, kingCol + 1);
      const capturedVertically = isHostileCell(kingRow - 1, kingCol) && isHostileCell(kingRow + 1, kingCol);

      if (capturedHorizontally || capturedVertically) {
        return { winnerSide: 'attacker', reason: 'king_captured' };
      }
    }

    return null;
  }

  private async getMoveCount(sessionId: string): Promise<number> {
    const result = await this.db.db.select().from(moves).where(eq(moves.sessionId, sessionId));
    return result.length;
  }
}
