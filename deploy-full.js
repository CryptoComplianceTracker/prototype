/**
 * DARA Platform - Full Deployment Script
 * 
 * This script creates a production-ready build of the entire application.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  console.log('🚀 Starting full deployment for DARA Platform...');
  
  try {
    // Clean up previous build
    console.log('🧹 Cleaning up previous build...');
    if (fs.existsSync('./dist')) {
      await execAsync('rm -rf ./dist');
    }
    fs.mkdirSync('./dist');
    
    // Copy all source files to dist
    console.log('📋 Copying source files to dist...');
    
    // Copy client src directory
    await execAsync('cp -r ./client/src ./dist/client/');
    
    // Copy server directory
    await execAsync('cp -r ./server ./dist/');
    
    // Copy shared directory
    await execAsync('cp -r ./shared ./dist/');
    
    // Copy necessary configuration files
    await execAsync('cp package.json ./dist/');
    await execAsync('cp package-lock.json ./dist/');
    await execAsync('cp vite.config.ts ./dist/');
    await execAsync('cp tsconfig.json ./dist/');
    await execAsync('cp tailwind.config.ts ./dist/');
    await execAsync('cp postcss.config.js ./dist/');
    await execAsync('cp server.js ./dist/');
    
    // Create production-ready server file
    console.log('📝 Creating production-ready server file...');
    
    const serverJs = `/**
 * DARA Platform - Production Server
 * 
 * This is the production entry point for the DARA Platform.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import fs from 'fs';
import { registerRoutes } from './server/routes.js';

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
    // Register API routes
    console.log('🔌 Registering API routes...');
    const httpServer = await registerRoutes(app);
    
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
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(\`✅ DARA Platform server running on port \${PORT} in production mode\`);
    });
    
    return httpServer;
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startProductionServer();`;
    
    fs.writeFileSync('./dist/production.js', serverJs);
    
    // Create .npmrc to ensure we use the correct registry
    const npmrc = `registry=https://registry.npmjs.org/
legacy-peer-deps=true`;
    fs.writeFileSync('./dist/.npmrc', npmrc);
    
    // Update package.json for production
    console.log('📦 Updating package.json for production...');
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node production.js",
      "build": "vite build && cp -r client/dist ."
    };
    
    fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
    
    // Create build instructions
    const buildInstructions = `# DARA Platform - Build Instructions

To build and start the application:

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Build the client:
   \`\`\`
   npm run build
   \`\`\`

3. Start the server:
   \`\`\`
   npm start
   \`\`\`
`;
    
    fs.writeFileSync('./dist/BUILD.md', buildInstructions);
    
    console.log('\n✅ Full deployment preparation complete!');
    console.log('Your application is ready to be deployed.');
    console.log('Use Replit\'s deployment feature to deploy the application.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();