import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").unique().notNull(),
  quantity: integer("quantity").default(0),
  price: integer("price"), // Store in cents to avoid floating-point issues
  supplier_id: integer("supplier_id").references(() => suppliers.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  contact_email: text("contact_email"),
});
