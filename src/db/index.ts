import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionUri =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DATABASE_USER || "root"}:${process.env.DATABASE_PASSWORD || ""}@${process.env.DATABASE_HOST || "localhost"}:${process.env.DATABASE_PORT || "3306"}/${process.env.DATABASE_NAME || "belajar_vibe_coding"}`;

// Create connection pool
export const poolConnection = mysql.createPool(connectionUri);

// Initialize Drizzle ORM instance with schema
export const db = drizzle(poolConnection, { schema, mode: "default" });

export { schema };
