import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const database: Pool = new Pool
({
    connectionString: process.env.POSTGRES_URL as string,
    ssl: { rejectUnauthorized: false }
});

export default database;