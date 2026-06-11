import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  index,
  unique,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const saves = mysqlTable(
  'saves',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    slotNumber: int('slot_number').notNull(),
    saveName: varchar('save_name', { length: 100 }),

    playTimeSeconds: int('play_time_seconds').notNull().default(0),

    lastPlayedAt: timestamp('last_played_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    uniqueUserSlot: unique('unique_user_slot').on(
      table.userId,
      table.slotNumber,
    ),
  }),
);
