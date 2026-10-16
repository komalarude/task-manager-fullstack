import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// A connection pool reuses database connections, which is faster than opening a new one per request
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // return DATE columns as 'YYYY-MM-DD' strings instead of JS Date objects
});
