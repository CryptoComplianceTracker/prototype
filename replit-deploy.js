/**
 * DARA Platform - Specialized Replit Deployment Server
 * 
 * This is an optimized server file specifically for
 * Replit deployments.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import fs from 'fs';
import axios from 'axios';
import { setupAuth } from './server/auth.js';
import { storage } from './server/storage.js';

// Initialize Express application
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic middleware setup
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

async function startServer() {
  console.log('🚀 Starting DARA Platform in production mode...');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server time: ${new Date().toISOString()}`);
  
  try {
    // Set up authentication
    console.log('🔐 Setting up authentication...');
    setupAuth(app);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
    });
    
    // API endpoints
    console.log('🔌 Registering API endpoints...');
    
    // Compliance news API endpoint
    app.get("/api/compliance/news", async (req, res) => {
      try {
        const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
        const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";
        
        console.log('Fetching news with API key:', NEWS_API_KEY ? 'Key provided' : 'No key');
        
        const response = await axios.get(NEWS_API_ENDPOINT, {
          params: {
            q: "(crypto OR cryptocurrency OR blockchain) AND (compliance OR regulation OR regulatory)",
            language: "en",
            sortBy: "publishedAt",
            pageSize: 15,
            apiKey: NEWS_API_KEY,
          },
          headers: {
            "X-Api-Key": NEWS_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "DARA-Compliance-Platform/1.0",
          },
        });
        
        // Transform the response data
        const articles = response.data.articles.map((article) => ({
          title: article.title || 'No title available',
          description: article.description || 'No description available',
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name,
        }));
        
        res.json(articles);
      } catch (error) {
        console.error('Error fetching compliance news:', error.message);
        
        res.status(500).json({ 
          message: 'Failed to fetch compliance news',
          error: error.message
        });
      }
    });
    
    // Jurisdictions endpoints
    app.get('/api/jurisdictions', async (req, res) => {
      try {
        console.log('Fetching all jurisdictions from database...');
        const jurisdictions = await storage.getAllJurisdictions();
        console.log(`Successfully retrieved ${jurisdictions.length} jurisdictions`);
        res.json(jurisdictions);
      } catch (error) {
        console.error('Error fetching jurisdictions:', error);
        res.status(500).json({ message: "Failed to fetch jurisdictions" });
      }
    });
    
    // User registrations data endpoints
    app.get('/api/user/registrations', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const registrations = await storage.getUserRegistrations(req.user.id);
        console.log(`Retrieved ${registrations.length} registrations for user ${req.user.id}`);
        res.json(registrations);
      } catch (error) {
        console.error('Error fetching user registrations:', error);
        res.status(500).json({ message: "Failed to fetch registrations" });
      }
    });
    
    // Token registrations endpoints
    app.get('/api/tokens', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        console.log(`Fetching token registrations for user ${req.user.id}...`);
        const tokenRegistrations = await storage.getUserTokenRegistrations(req.user.id);
        console.log(`Successfully retrieved ${tokenRegistrations.length} token registrations for user ${req.user.id}`);
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations:', error);
        res.status(500).json({ message: "Failed to fetch token registrations" });
      }
    });
    
    // Admin token routes
    app.get('/api/tokens/admin', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        console.log('Fetching all token registrations for admin...');
        const tokenRegistrations = await storage.getAllTokenRegistrations();
        console.log(`Successfully retrieved ${tokenRegistrations.length} token registrations`);
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations for admin:', error);
        res.status(500).json({ message: "Failed to fetch token registrations" });
      }
    });
    
    // Build path detection
    let staticPath = './dist';
    
    // Check if we're running from the dist folder
    if (fs.existsSync('./index.html')) {
      staticPath = '.';
      console.log('📂 Running from dist directory, serving static files from current directory');
    } else if (fs.existsSync('./dist/index.html')) {
      console.log('📂 Serving static files from ./dist directory');
    } else if (fs.existsSync('./server/public/index.html')) {
      staticPath = './server/public';
      console.log('📂 Serving static files from ./server/public directory');
    } else {
      console.warn('⚠️ Could not find static files to serve');
    }
    
    // Serve static files
    console.log(`📄 Serving static files from: ${path.resolve(staticPath)}`);
    app.use(express.static(staticPath));
    
    // Always return the main index.html for any non-API request
    // This is required for client-side routing to work
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
      console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    });
    
    return httpServer;
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
}

// Start the server
startServer();