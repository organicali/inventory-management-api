import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { productsTable } from "./db/schema.ts";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const db = drizzle(process.env.DATABASE_URL!);

// Create product
app.post("/api/products", async (req, res) => {
  try {
    const product: typeof productsTable.$inferInsert = req.body;
    // const product: typeof productsTable.$inferInsert = {
    //   name: "milk",
    //   sku: "whole-milk",
    //   quantity: 2,
    //   price: 699,
    // };
    await db.insert(productsTable).values(product);
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Read all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Update product by id
app.put("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    await db.update(productsTable).set(updates).where(eq(productsTable.id, id));
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product by id
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
