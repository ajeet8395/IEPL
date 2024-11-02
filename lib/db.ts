import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from 'mysql2';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
  enableKeepAlive: boolean;
  keepAliveInitialDelay: number;
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Aa@8395997994',
  database: process.env.DB_NAME || 'iepl',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);

export async function query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(
  sql: string,
  values: any[] = []
): Promise<T> {
  try {
    const [results] = await pool.execute<T>(sql, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// export async function testConnection(): Promise<boolean> {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Database connected successfully!');
//     connection.release();
//     return true;
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     throw new Error('Database connection failed');
//   }
// }

export const db = pool;