import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  done: boolean('done').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date())
});
