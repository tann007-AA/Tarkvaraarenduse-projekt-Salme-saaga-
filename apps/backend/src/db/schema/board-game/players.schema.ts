import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const players = mysqlTable('players', {
  id: varchar('id', { length: 36 }).primaryKey(),
  token: varchar('token', { length: 36 }).notNull().unique(), // UUID used to auth WS
  name: varchar('name', { length: 32 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
