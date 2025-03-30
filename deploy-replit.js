#!/usr/bin/env node
/**
 * DARA Platform - Specialized Replit Deployment Script
 * 
 * This script prepares the application for deployment on Replit.
 * It builds the client application, compiles server files,
 * and creates a production-ready distribution.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_DIR = path.join(__dirname, 'dist');
const SERVER_DIR = path.join(__dirname, 'server');
const SHARED_DIR = path.join(__dirname, 'shared');
const CLIENT_DIR = path.join(__dirname, 'client');

console.log('🚀 DARA Platform - Preparing for Replit Deployment');

try {
  // Step 1: Clean up previous build if it exists
  if (fs.existsSync(DIST_DIR)) {
    console.log('🧹 Cleaning up previous build...');
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  
  // Step 2: Create dist directory
  console.log('📁 Creating distribution directory...');
  fs.mkdirSync(DIST_DIR, { recursive: true });
  
  // Step 3: Build client application
  console.log('📦 Building client application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Compile server TypeScript
  console.log('🔨 Compiling server files...');
  execSync('npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', 
    { stdio: 'inherit' });
  
  // Step 5: Create a tailored package.json for deployment
  console.log('📝 Creating production package.json...');
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  // Modify package.json for production
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: "module",
    main: "server.js",
    scripts: {
      start: "NODE_ENV=production node server.js"
    },
    dependencies: packageJson.dependencies
  };
  
  fs.writeFileSync(
    path.join(DIST_DIR, 'package.json'), 
    JSON.stringify(prodPackageJson, null, 2)
  );
  
  // Step 6: Copy necessary server files
  console.log('📋 Copying required server modules...');
  
  // Create server directory in dist
  fs.mkdirSync(path.join(DIST_DIR, 'server'), { recursive: true });
  
  // Copy compiled JS files
  const serverJsFiles = [
    'auth.js',
    'db.js',
    'storage.js',
    'templates.js'
  ];
  
  for (const file of serverJsFiles) {
    const srcPath = path.join(SERVER_DIR, file);
    const destPath = path.join(DIST_DIR, 'server', file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    } else {
      console.warn(`Warning: ${srcPath} not found, compiling from TypeScript...`);
      const tsFile = srcPath.replace('.js', '.ts');
      if (fs.existsSync(tsFile)) {
        execSync(`npx esbuild ${tsFile} --platform=node --packages=external --bundle --format=esm --outfile=${destPath}`, 
          { stdio: 'inherit' });
        console.log(`Compiled ${tsFile} to ${destPath}`);
      } else {
        console.error(`Error: Neither ${srcPath} nor ${tsFile} could be found`);
      }
    }
  }
  
  // Step 7: Copy shared directory and its contents
  console.log('📋 Copying shared directory...');
  fs.mkdirSync(path.join(DIST_DIR, 'shared'), { recursive: true });
  
  try {
    const sharedFiles = fs.readdirSync(SHARED_DIR);
    for (const file of sharedFiles) {
      const srcPath = path.join(SHARED_DIR, file);
      const destPath = path.join(DIST_DIR, 'shared', file);
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    }
  } catch (err) {
    console.error('Error copying shared directory:', err);
  }
  
  // Step 8: Copy public assets directory (compiled client)
  console.log('📋 Copying client assets...');
  const publicSrcDir = path.join(SERVER_DIR, 'public');
  
  if (fs.existsSync(publicSrcDir)) {
    // Recursively copy the contents
    function copyDir(src, dest) {
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyDir(publicSrcDir, path.join(DIST_DIR, 'public'));
    console.log(`Copied public assets from ${publicSrcDir} to ${path.join(DIST_DIR, 'public')}`);
  } else {
    console.warn(`Warning: Public assets directory ${publicSrcDir} not found`);
  }
  
  // Step 9: Create a specialized server entry point for production
  console.log('📝 Creating optimized production server entry point...');
  
  const serverEntry = `
// DARA Platform - Production Server Entry Point
// This file is auto-generated by deploy-replit.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupAuth } from './server/auth.js';
import { storage } from './server/storage.js';
import { registerTemplateRoutes } from './server/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create HTTP server
const httpServer = createServer(app);

// Security configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply security headers with appropriate CSP for production
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], 
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "https://newsapi.org", "https://sepolia.easscan.org"],
        fontSrc: ["'self'", "data:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.path} \${res.statusCode} \${duration}ms\`);
  });
  next();
});

// Authentication setup
setupAuth(app);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Register template routes
registerTemplateRoutes(app);

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
    
    console.log('Successfully fetched compliance news from API');
    
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

// User registration data endpoints
app.get('/api/user/registrations', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const registrations = await storage.getUserRegistrations(req.user.id);
    console.log(\`Retrieved \${registrations.length} registrations for user \${req.user.id}\`);
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// Jurisdictions endpoints
app.get('/api/jurisdictions', async (req, res) => {
  try {
    console.log('Fetching all jurisdictions from database...');
    const jurisdictions = await storage.getAllJurisdictions();
    console.log(\`Successfully retrieved \${jurisdictions.length} jurisdictions\`);
    res.json(jurisdictions);
  } catch (error) {
    console.error('Error fetching jurisdictions:', error);
    res.status(500).json({ message: "Failed to fetch jurisdictions" });
  }
});

// Token registrations endpoints
// Admin token routes
app.get('/api/tokens/admin', async (req, res) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  try {
    console.log('Fetching all token registrations for admin...');
    const tokenRegistrations = await storage.getAllTokenRegistrations();
    console.log(\`Successfully retrieved \${tokenRegistrations.length} token registrations\`);
    res.json(tokenRegistrations);
  } catch (error) {
    console.error('Error fetching token registrations for admin:', error);
    res.status(500).json({ message: "Failed to fetch token registrations" });
  }
});

// Serve static files from public directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Always return the main index.html for any path that doesn't match an API endpoint
// This is crucial for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    res.status(404).json({ message: "API endpoint not found" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(\`DARA Platform server running on port \${PORT} in \${process.env.NODE_ENV || 'development'} mode\`);
  console.log(\`Server started at: \${new Date().toISOString()}\`);
});
`;

  fs.writeFileSync(path.join(DIST_DIR, 'server.js'), serverEntry);

  console.log('✅ Deployment preparation complete!');
  console.log('Now you can deploy the application by clicking "Deploy" in the Replit interface.');
} catch (error) {
  console.error('❌ Error preparing deployment:', error);
  process.exit(1);
}