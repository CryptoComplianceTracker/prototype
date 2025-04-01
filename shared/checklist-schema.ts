import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Import these directly to avoid circular imports
import { pgTable as definePgTable } from 'drizzle-orm/pg-core';
const users = definePgTable("users", {
  id: serial("id").primaryKey(),
});
const jurisdictions = definePgTable("jurisdictions", {
  id: serial("id").primaryKey(),
});

// Jurisdiction Checklist Tables
export const checklist_categories = pgTable("checklist_categories", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").notNull().references(() => jurisdictions.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  sequence: integer("sequence").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const checklist_items = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id").notNull().references(() => checklist_categories.id, { onDelete: 'cascade' }),
  task: text("task").notNull(),
  responsible: text("responsible"),
  notes: text("notes"),
  sequence: integer("sequence").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const user_checklist_progress = pgTable("user_checklist_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  checklist_item_id: integer("checklist_item_id").notNull().references(() => checklist_items.id, { onDelete: 'cascade' }),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  notes: text("notes"),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Relations
export const checklistCategoriesRelations = relations(checklist_categories, ({ one, many }) => ({
  jurisdiction: one(jurisdictions, {
    fields: [checklist_categories.jurisdiction_id],
    references: [jurisdictions.id]
  }),
  items: many(checklist_items)
}));

export const checklistItemsRelations = relations(checklist_items, ({ one, many }) => ({
  category: one(checklist_categories, {
    fields: [checklist_items.category_id],
    references: [checklist_categories.id]
  }),
  userProgress: many(user_checklist_progress)
}));

export const userChecklistProgressRelations = relations(user_checklist_progress, ({ one }) => ({
  user: one(users, {
    fields: [user_checklist_progress.user_id],
    references: [users.id]
  }),
  checklistItem: one(checklist_items, {
    fields: [user_checklist_progress.checklist_item_id],
    references: [checklist_items.id]
  })
}));

// Schemas for data insertion
export const checklistCategorySchema = createInsertSchema(checklist_categories)
  .omit({ id: true, created_at: true, updated_at: true });

export const checklistItemSchema = createInsertSchema(checklist_items)
  .omit({ id: true, created_at: true, updated_at: true });

export const userChecklistProgressSchema = createInsertSchema(user_checklist_progress)
  .omit({ id: true, created_at: true, updated_at: true, completed_at: true })
  .extend({
    status: z.enum(['not_started', 'in_progress', 'completed'], {
      required_error: "Status is required"
    })
  });

// Types
export type ChecklistCategory = typeof checklist_categories.$inferSelect;
export type ChecklistItem = typeof checklist_items.$inferSelect;
export type UserChecklistProgress = typeof user_checklist_progress.$inferSelect;

export type InsertChecklistCategory = z.infer<typeof checklistCategorySchema>;
export type InsertChecklistItem = z.infer<typeof checklistItemSchema>;
export type InsertUserChecklistProgress = z.infer<typeof userChecklistProgressSchema>;