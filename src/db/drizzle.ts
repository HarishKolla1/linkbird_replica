import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import {schema } from "@/db/schema"

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL! , { schema });
