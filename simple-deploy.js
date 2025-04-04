/**
 * DARA Platform - Simple Deployment Script
 * 
 * This creates a self-contained deployment folder with everything needed to run
 * a simplified version of the application on Replit.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  console.log('🚀 Starting simple deployment for DARA Platform...');
  
  try {
    // Clean deploy directory if it exists
    const deployDir = path.resolve(__dirname, 'deploy');
    if (fs.existsSync(deployDir)) {
      console.log('🧹 Cleaning up previous deployment...');
      execSync(`rm -rf ${deployDir}`);
    }
    
    // Create fresh deploy directory
    fs.mkdirSync(deployDir, { recursive: true });
    
    // Build the client
    console.log('📦 Building client application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Copy necessary files
    console.log('📋 Copying build files to deployment folder...');
    
    // Create necessary directories
    fs.mkdirSync(path.resolve(deployDir, 'dist'), { recursive: true });
    
    // Copy client build files
    const distDir = path.resolve(__dirname, 'dist');
    const publicDir = path.resolve(distDir, 'public');
    
    if (fs.existsSync(publicDir)) {
      // If public directory exists, copy it
      execSync(`cp -r ${publicDir} ${deployDir}/dist/`);
    } else {
      // If public doesn't exist, copy client assets directly (excluding server JS files)
      if (fs.existsSync(distDir)) {
        const distFiles = fs.readdirSync(distDir);
        
        // Create public directory in deploy
        fs.mkdirSync(path.resolve(deployDir, 'dist/public'), { recursive: true });
        
        // Copy client assets
        distFiles.forEach(file => {
          const srcPath = path.resolve(distDir, file);
          // Only copy client assets, not server JS files
          if (!file.endsWith('.js') && !file.endsWith('.mjs') && !file.endsWith('.cjs')) {
            const destPath = path.resolve(deployDir, 'dist/public', file);
            if (fs.lstatSync(srcPath).isDirectory()) {
              execSync(`cp -r "${srcPath}" "${destPath}"`);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        });
      }
    }
    
    // Create standalone server.js file
    console.log('📝 Creating standalone server.js...');
    
    const serverJs = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Basic API route to verify server is working
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the dist/public directory
const publicDir = path.resolve(__dirname, 'dist/public');

if (fs.existsSync(publicDir)) {
  console.log('Serving static files from:', publicDir);
  app.use(express.static(publicDir));
} else {
  console.error('Error: Public directory not found at', publicDir);
}

// Always return the main index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.resolve(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found. Please check your build configuration.');
    }
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
  
  // Log directory contents for debugging
  console.log('Directory structure:');
  
  const listDir = (dir, prefix = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      console.log(\`\${prefix}\${entry.name}\${entry.isDirectory() ? '/' : ''}\`);
      if (entry.isDirectory()) {
        listDir(path.join(dir, entry.name), \`\${prefix}  \`);
      }
    });
  };
  
  listDir(__dirname);
});
`;
    
    fs.writeFileSync(path.resolve(deployDir, 'server.js'), serverJs);
    
    // Create package.json for deployment
    console.log('📝 Creating package.json...');
    
    const packageJson = {
      "name": "dara-platform",
      "version": "1.0.0",
      "type": "module",
      "main": "server.js",
      "scripts": {
        "start": "node server.js"
      },
      "dependencies": {
        "express": "^4.21.2"
      }
    };
    
    fs.writeFileSync(
      path.resolve(deployDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create a deployment instruction file
    console.log('📝 Creating deployment instructions...');
    
    const readmeContent = `# DARA Platform - Deployment

This folder contains a simplified version of the DARA Platform for deployment.

## Deployment Instructions

1. Upload all files in this folder to your deployment environment
2. Install dependencies with \`npm install\`
3. Start the server with \`npm start\`

The server will run on port 5000 by default, but will use the PORT environment variable if set.

## Directory Structure

- \`server.js\` - The main server file
- \`package.json\` - Node.js package configuration
- \`dist/public/\` - Static files for the client application
`;
    
    fs.writeFileSync(
      path.resolve(deployDir, 'README.md'),
      readmeContent
    );
    
    console.log('\n✅ Simple deployment preparation complete!');
    console.log('The deployment is available in the ./deploy folder.');
    console.log('\nTo test the deployment locally:');
    console.log('  cd deploy');
    console.log('  npm install');
    console.log('  npm start');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();