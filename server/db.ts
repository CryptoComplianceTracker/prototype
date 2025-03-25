import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon with proper error handling
neonConfig.webSocketConstructor = ws;
// Only enable wsProxy if we're using Neon's serverless driver
neonConfig.wsProxy = process.env.DATABASE_URL?.includes('pooler.internal');
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Configure connection pool with improved settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // Increased timeout
  max: 10, // Reduced max connections
  idleTimeoutMillis: 30000,
  maxUses: 7500,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Handle pool errors with detailed logging
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

pool.on('connect', () => {
  console.log('New client connected to database');
});

pool.on('remove', () => {
  console.log('Client removed from pool');
});

// Initialize Drizzle with schema
export const db = drizzle(pool, { schema });

// Export a function to test the database connection with retries
export async function testDatabaseConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to database');
      client.release();
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return false;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}