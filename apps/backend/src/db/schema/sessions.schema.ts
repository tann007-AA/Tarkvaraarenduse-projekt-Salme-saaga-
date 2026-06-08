import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  text,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),

  accessTokenJti: varchar('access_token_jti', { length: 36 }).notNull(),

  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  rememberMe: boolean('remember_me').default(false),

  expiresAt: timestamp('expires_at').notNull(),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
