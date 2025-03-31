/**
 * DARA Platform - Specialized Replit Deployment Server
 * 
 * This is an optimized server file specifically for
 * Replit deployments.
 */

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { setupAuth } from './server/auth.js';
import { pool, db } from './server/db.js';

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
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  try {
    // Set up auth
    console.log('🔒 Setting up authentication...');
    setupAuth(app);
    
    // Register all API routes
    console.log('🔌 Registering API routes...');
    
    // Add JWT middleware and other security middleware
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

    // API routes
    // User and auth API routes are set up by setupAuth()
    
    // Jurisdictions
    app.get('/api/jurisdictions', async (req, res) => {
      try {
        const jurisdictions = await db.query.jurisdictions.findMany();
        res.json(jurisdictions);
      } catch (error) {
        console.error('Error fetching jurisdictions:', error);
        res.status(500).json({ error: 'Failed to fetch jurisdictions' });
      }
    });
    
    app.get('/api/jurisdictions/:id', async (req, res) => {
      try {
        const jurisdiction = await db.query.jurisdictions.findFirst({
          where: (jurisdictions, { eq }) => eq(jurisdictions.id, parseInt(req.params.id))
        });
        
        if (!jurisdiction) {
          return res.status(404).json({ error: 'Jurisdiction not found' });
        }
        
        res.json(jurisdiction);
      } catch (error) {
        console.error('Error fetching jurisdiction:', error);
        res.status(500).json({ error: 'Failed to fetch jurisdiction' });
      }
    });
    
    // Token registrations
    app.get('/api/token-registrations', async (req, res) => {
      try {
        const tokenRegistrations = await db.query.tokenRegistrations.findMany();
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations:', error);
        res.status(500).json({ error: 'Failed to fetch token registrations' });
      }
    });
    
    // News API proxy
    app.get('/api/news', async (req, res) => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=cryptocurrency+regulation&sortBy=publishedAt&apiKey=${process.env.VITE_NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`News API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const articles = data.articles.map((article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name
        }));
        
        res.json({ articles });
      } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
      }
    });
    
    // Reports
    app.get('/api/reports', async (req, res) => {
      try {
        const reports = await db.query.reports.findMany();
        res.json(reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
      }
    });
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error in request:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
    
    // Serve static files
    console.log('📄 Setting up static file serving...');
    app.use(express.static(path.join(__dirname, 'client/dist')));
    
    // Always return the main index.html for client-side routing
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
      }
    });
    
    // Start server
    const httpServer = createServer(app);
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log("✅ DARA Platform server running on port " + PORT + " in production mode");
    });
    
    return httpServer;
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();