import { mysqlTable, varchar, boolean, int } from 'drizzle-orm/mysql-core';
import { saves } from './gamesave.schema';

export const progress = mysqlTable('progress', {
  saveId: varchar('save_id', { length: 36 })
    .primaryKey()
    .references(() => saves.id, { onDelete: 'cascade' }),

  currentChapter: int('current_chapter').notNull().default(1),
  completedQuestCount: int('completed_quest_count').notNull().default(0),

  completedEndingA: boolean('completed_ending_a').notNull().default(false),
  completedEndingB: boolean('completed_ending_b').notNull().default(false),
});
