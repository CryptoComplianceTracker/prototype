/**
 * Production server for Replit deployment
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { setupAuth } from './server/auth.js';
import { registerRoutes } from './server/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize Express app
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Basic request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  try {
    // Register API routes
    const httpServer = await registerRoutes(app);
    
    // Serve static files
    app.use(express.static(path.join(__dirname, 'client/dist')));
    
    // Always return the main index.html for client-side routing
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
      }
    });
    
    // Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`DARA Platform server running on port ${PORT} in production mode`);
    });
    
    return httpServer;
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();