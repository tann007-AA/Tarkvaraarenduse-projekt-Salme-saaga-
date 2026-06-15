import { mysqlTable, varchar, char, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { players } from './players.schema';

export const lobbies = mysqlTable('lobbies', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  code: char('code', { length: 4 }).notNull().unique(), // e.g. "5249"
  hostId: varchar('host_id', { length: 36 })
    .notNull()
    .references(() => players.id),
  guestId: varchar('guest_id', { length: 36 }).references(() => players.id), // null until guest joins
  status: mysqlEnum('status', ['waiting', 'starting', 'active', 'abandoned']).default('waiting').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
