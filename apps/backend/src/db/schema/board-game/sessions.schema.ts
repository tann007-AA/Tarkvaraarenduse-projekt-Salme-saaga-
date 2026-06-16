import { mysqlTable, varchar, json, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { lobbies } from './lobbies.schema';
import { players } from './players.schema';

export const gameSessions = mysqlTable('game_sessions', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  lobbyId: varchar('lobby_id', { length: 36 })
    .notNull()
    .references(() => lobbies.id),
  attackerId: varchar('attacker_id', { length: 36 })
    .notNull()
    .references(() => players.id), // Vikings (dark)
  defenderId: varchar('defender_id', { length: 36 })
    .notNull()
    .references(() => players.id), // King's side (light)
  boardState: json('board_state').notNull(), // current board as 2D array
  currentTurn: mysqlEnum('current_turn', ['attacker', 'defender']).default('attacker').notNull(),
  status: mysqlEnum('status', ['active', 'finished', 'abandoned']).default('active').notNull(),
  winnerId: varchar('winner_id', { length: 36 }).references(() => players.id), // null until game ends
  winReason: mysqlEnum('win_reason', ['king_escaped', 'king_captured', 'forfeit', 'disconnect']),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});
