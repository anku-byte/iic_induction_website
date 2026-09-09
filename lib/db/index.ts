import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon pooled connection string to .env.local",
  );
}

// The Neon HTTP driver issues one stateless HTTPS request per query, so a burst
// of concurrent serverless invocations never exhausts a connection pool.
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export { schema };
