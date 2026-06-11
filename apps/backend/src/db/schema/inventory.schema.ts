import {
  mysqlTable,
  varchar,
  int,
  index,
  unique,
} from 'drizzle-orm/mysql-core';
import { saves } from './gamesave.schema';

export const inventoryItems = mysqlTable(
  'inventory_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    saveId: varchar('save_id', { length: 36 })
      .notNull()
      .references(() => saves.id, { onDelete: 'cascade' }),

    itemId: varchar('item_id', { length: 100 }).notNull(),
    quantity: int('quantity').notNull().default(1),
  },
  (table) => ({
    saveIdIdx: index('inventory_save_id_idx').on(table.saveId),
    uniqueItemPerSave: unique('unique_item_per_save').on(
      table.saveId,
      table.itemId,
    ),
  }),
);
