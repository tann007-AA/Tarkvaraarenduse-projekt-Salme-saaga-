import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/mysql-core';
import { saves } from './gamesave.schema';

export const scores = mysqlTable(
  'scores',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    saveId: varchar('save_id', { length: 36 })
      .notNull()
      .references(() => saves.id, { onDelete: 'cascade' }),

    scoreType: varchar('score_type', { length: 50 }).notNull(),
    scoreValue: int('score_value').notNull().default(0),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    saveIdIdx: index('save_id_idx').on(table.saveId),
    uniqueSaveScore: unique('unique_save_score').on(
      table.saveId,
      table.scoreType,
    ),
  }),
);
