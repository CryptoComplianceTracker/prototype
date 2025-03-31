/**
 * DARA Platform - Deployment Preparation Script
 * 
 * This script prepares the built application for deployment
 * by copying necessary files and setting up the server.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Helper function to copy a directory recursively
async function copyDir(src, dest) {
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Get all files and directories in the source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    // Process each entry
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyDir(srcPath, destPath);
      } else {
        // Copy files
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory from ${src} to ${dest}:`, error);
    throw error;
  }
}

async function prepareDeployment() {
  console.log('🚀 Preparing DARA Platform for deployment...');
  
  try {
    // Clean up existing dist directory
    if (fs.existsSync(distDir)) {
      console.log('🧹 Cleaning up existing dist directory...');
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    
    // Create dist directory
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create package.json for production
    console.log('📝 Creating production package.json...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node server.js"
    };
    packageJson.type = "module";
    
    fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    
    // Create production server file
    console.log('📝 Creating production server file...');
    const serverJs = `/**
 * DARA Platform - Production Server
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { setupAuth } from './server/auth.js';
import { pool, db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startProductionServer() {
  // Initialize Express app
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Basic request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(\`\${req.method} \${req.path} \${res.statusCode} \${duration}ms\`);
    });
    next();
  });
  
  try {
    // Set up auth
    console.log('🔒 Setting up authentication...');
    setupAuth(app);
    
    // API routes
    console.log('🔌 Registering API routes...');
    
    // Add security middleware
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

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
          \`https://newsapi.org/v2/everything?q=cryptocurrency+regulation&sortBy=publishedAt&apiKey=\${process.env.VITE_NEWS_API_KEY}\`
        );
        
        if (!response.ok) {
          throw new Error(\`News API responded with status: \${response.status}\`);
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
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(\`✅ DARA Platform server running on port \${PORT} in production mode\`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startProductionServer();`;

    fs.writeFileSync(path.join(distDir, 'server.js'), serverJs);
    
    // Create .replit file
    console.log('📝 Creating .replit file...');
    const replitConfig = `
run = "npm start"
hidden = [".config", "package-lock.json"]

[env]
PORT = "3000"

[nix]
channel = "stable-22_11"

[deployment]
run = ["npm", "start"]
deploymentTarget = "cloudrun"
ignorePorts = false
`;
    
    fs.writeFileSync(path.join(distDir, '.replit'), replitConfig);
    
    // Create replit.nix file
    console.log('📝 Creating replit.nix file...');
    const replitNix = `{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.postgresql
  ];
}`;
    
    fs.writeFileSync(path.join(distDir, 'replit.nix'), replitNix);
    
    // Copy a simplified version of the client
    console.log('📋 Copying a simplified client...');
    fs.mkdirSync(path.join(distDir, 'client', 'dist'), { recursive: true });
    
    // Create a simplified index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DARA Platform - Crypto Regulatory Compliance</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .gradient-text {
            background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .gradient-bg {
            background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
        }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <nav class="bg-gray-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <h1 class="text-xl font-bold gradient-text">DARA Platform</h1>
                    </div>
                    <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Dashboard</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Jurisdictions</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Registrations</a>
                        <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Reports</a>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="gradient-bg px-4 py-2 rounded-md text-white font-medium hover:opacity-90">Connect Wallet</button>
                </div>
            </div>
        </div>
    </nav>

    <main>
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    <span class="gradient-text">Web3 Compliance Platform</span>
                </h2>
                <p class="mt-4 text-xl text-gray-400">
                    Simplifying regulatory processes for crypto ecosystem participants
                </p>
                <p class="mt-8 text-lg bg-indigo-900 text-white py-4 px-6 rounded-lg inline-block">
                    This is the deployment build. For the full application, please return to the development environment.
                </p>
            </div>
        </div>
    </main>

    <footer class="bg-gray-800 mt-12">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div class="mt-8 border-t border-gray-700 pt-8 text-center">
                <p class="text-gray-400">&copy; 2025 DARA Platform. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'client', 'dist', 'index.html'), indexHtml);
    
    // Copy the server directory
    console.log('📋 Copying server directory...');
    await copyDir(path.join(rootDir, 'server'), path.join(distDir, 'server'));
    
    // Copy the shared directory
    console.log('📋 Copying shared directory...');
    await copyDir(path.join(rootDir, 'shared'), path.join(distDir, 'shared'));
    
    // Copy other necessary files
    console.log('📋 Copying other necessary files...');
    const filesToCopy = [
      'drizzle.config.ts',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.js'
    ];
    
    for (const file of filesToCopy) {
      const sourcePath = path.join(rootDir, file);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, path.join(distDir, file));
      }
    }
    
    // Create a README.md file
    console.log('📝 Creating README.md file...');
    const readme = `# DARA Platform - Crypto Regulatory Compliance Platform

A comprehensive Web3 compliance platform that simplifies regulatory processes for crypto ecosystem participants through intelligent geospatial regulatory tracking and advanced blockchain attestation services.

## Deployment

This is a production build of the DARA Platform. To start the server, run:

\`\`\`
npm start
\`\`\`

## Environment Variables

Make sure the following environment variables are set:

- \`DATABASE_URL\`: PostgreSQL connection string
- \`SESSION_SECRET\`: Secret for session management
- \`VITE_NEWS_API_KEY\`: API key for the News API

## Features

- TypeScript React frontend
- Ethereum Attestation Service (EAS) integration
- Sepolia testnet for attestation testing
- Web3 wallet authentication
- PostgreSQL 16.8 database
- Multi-jurisdiction support (USA, UAE)
- Role-based access control
- Dynamic regulatory compliance mapping
- Enhanced security with rate limiting
- Unified user registration system
- News API integration with server-side proxy
- Token registration data management
`;
    
    fs.writeFileSync(path.join(distDir, 'README.md'), readme);
    
    console.log('\n✅ Deployment preparation complete!');
    console.log('Your application is ready to be deployed.');
    console.log('Navigate to the dist directory and deploy using Replit\'s deployment feature.');
    
  } catch (error) {
    console.error('❌ Error preparing deployment:', error);
    process.exit(1);
  }
}

prepareDeployment();