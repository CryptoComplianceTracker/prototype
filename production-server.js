/**
 * Production server for Replit deployment
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import fs from 'fs';
import { createServer } from 'http';
import { setupAuth } from './server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false
  }));
  
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Basic request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  try {
    // Set up authentication
    console.log('🔐 Setting up authentication...');
    setupAuth(app);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString()
      });
    });
    
    // API endpoints
    console.log('🔌 Registering API endpoints...');
    
    // Determine client files location
    let staticPath = './client/dist';
    if (fs.existsSync('./dist')) {
      staticPath = './dist';
    }
    
    // Serve static files
    app.use(express.static(staticPath));
    
    // Always return the main index.html for any non-API request (client-side routing)
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(staticPath, 'index.html'));
      } else {
        res.status(404).json({ message: "API endpoint not found" });
      }
    });
    
    // Start server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ DARA Platform server running on port ${PORT}`);
    });
    
    return httpServer;
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

// Start the server
startServer();