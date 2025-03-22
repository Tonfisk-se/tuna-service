import { Pool } from 'pg';

const config = {
    database: process.env.TUNA_DB_NAME,
    user: process.env.TUNA_DB_USER,
    password: process.env.TUNA_DB_PASS,
    port: 5432,
    max: 20,
}

export const dbConnectionPool = new Pool(config)