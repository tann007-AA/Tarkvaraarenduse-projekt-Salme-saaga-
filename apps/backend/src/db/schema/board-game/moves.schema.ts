import { mysqlTable, varchar, json, int, timestamp } from 'drizzle-orm/mysql-core';
import { gameSessions } from './sessions.schema';
import { players } from './players.schema';

export const moves = mysqlTable('moves', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  sessionId: varchar('session_id', { length: 36 })
    .notNull()
    .references(() => gameSessions.id),
  playerId: varchar('player_id', { length: 36 })
    .notNull()
    .references(() => players.id),
  moveNumber: int('move_number').notNull(), // 1-based sequence
  fromRow: int('from_row').notNull(), // 0–10
  fromCol: int('from_col').notNull(), // 0–10
  toRow: int('to_row').notNull(), // 0–10
  toCol: int('to_col').notNull(), // 0–10
  capturedPieces: json('captured_pieces'), // [{row, col}] of captures this move
  boardSnapshot: json('board_snapshot').notNull(), // full board after this move
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
