import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with retry logic
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  maxUses: 7500, // Close clients after 7500 queries
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process, just log the error
  // process.exit(-1);
});

// Handle pool connection events
pool.on('connect', (client) => {
  console.log('New client connected to database');
});

pool.on('remove', (client) => {
  console.log('Client removed from pool');
});

export const db = drizzle({ client: pool, schema });