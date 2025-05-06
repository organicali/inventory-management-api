import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").unique().notNull(),
  quantity: integer("quantity").default(0),
  price: integer("price"), // Store in cents to avoid floating-point issues
  created_at: timestamp("created_at").defaultNow(),
});

// export const supplier = pgTable("supplier", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull().unique(),
//   contact_email: text("contact_email"),
// });

// module.exports = {
//   productsTable,
// };
