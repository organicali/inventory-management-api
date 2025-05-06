const { drizzle } = require("drizzle-orm/neon-serverless");
const { Pool } = require("@neondatabase/serverless");
const schema = require("./schema");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

module.exports = {
  db,
};
