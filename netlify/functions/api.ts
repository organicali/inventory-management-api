import express, { Router } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { productsTable } from "../../src/db/schema";
import cors from "cors";
import serverless from "serverless-http";

const router = Router();

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
router.post("/products", async (req, res) => {
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
router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Read one product
router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);
    res.json(product[0]);
  } catch (error) {
    console.error("Error fetching product: ", error);
    res.status(500).json({ error: "Failed to fetch requested product" });
  }
});

// Update product by id
router.put("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Updating product with id: ${id}`);
    const updates = req.body;
    console.log(`Update data:`, updates);

    // Remove id and created_at from updates to prevent updating these fields
    const { id: _, created_at: __, ...updateData } = updates;

    const result = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Product not found" });
    }

    console.log(`Successfully updated product:`, result[0]);
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "Failed to update product",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete product by id
router.delete("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.use("/api/", router);

export const handler = serverless(app);
