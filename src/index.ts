import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { products } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const product: typeof products.$inferInsert = {
    name: "Tomato",
    sku: "roma-tomato",
    quantity: 54,
    price: 199,
  };

  await db.insert(products).values(product);
  console.log("New product created!");

  const products_result = await db.select().from(products);
  console.log("Getting all products from the database: ", products_result);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  //   await db
  //     .update(products)
  //     .set({
  //       age: 31,
  //     })
  //     .where(eq(usersTable.email, user.email));
  //   console.log('User info updated!')

  //   await db.delete(usersTable).where(eq(usersTable.email, user.email));
  //   console.log('User deleted!')
}

main();
