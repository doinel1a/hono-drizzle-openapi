import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const tasksSchema = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  done: boolean('done').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date())
});

export const insertTasksSchema = createInsertSchema(tasksSchema, {
  name: (name) => name.min(1).max(255),
  done: (done) => done.default(false)
})
  .required({
    done: true
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const selectTasksSchema = createSelectSchema(tasksSchema);

export const patchTasksSchema = insertTasksSchema.partial();
