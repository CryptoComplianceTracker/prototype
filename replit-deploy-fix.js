/**
 * DARA Platform - Replit Deployment Fix
 * 
 * This script prepares the application for deployment on Replit.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  console.log('🚀 Starting Replit deployment preparation...');
  
  try {
    // Build the application
    console.log('📦 Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create simplified server file for Replit deployment
    console.log('📝 Creating simplified server file for deployment...');
    
    const replitServerJs = `
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
}

// Always return the main index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    // Check if index.html exists
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
  
  // List files in the public directory for debugging
  if (fs.existsSync(publicDir)) {
    console.log('Files in public directory:');
    const files = fs.readdirSync(publicDir);
    files.forEach(file => console.log(\` - \${file}\`));
  } else {
    console.error('Warning: Public directory not found at', publicDir);
    
    // List files in dist for debugging
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      console.log('Files in dist directory:');
      const distFiles = fs.readdirSync(distDir);
      distFiles.forEach(file => console.log(\` - \${file}\`));
    }
  }
});
`;
    
    fs.writeFileSync(
      path.resolve(__dirname, 'replit-server.js'), 
      replitServerJs
    );
    
    // Create a minimal package.json for the deployment
    console.log('📝 Creating minimal package.json for deployment...');
    
    const deployPackageJson = {
      "name": "dara-platform",
      "version": "1.0.0",
      "type": "module",
      "main": "replit-server.js",
      "scripts": {
        "start": "node replit-server.js"
      },
      "dependencies": {
        "express": "^4.21.2"
      }
    };
    
    // Save this to a temporary file for reference
    fs.writeFileSync(
      path.resolve(__dirname, 'deploy-package.json'), 
      JSON.stringify(deployPackageJson, null, 2)
    );
    
    // If dist/public directory doesn't exist, try to fix the structure
    const distDir = path.resolve(__dirname, 'dist');
    const publicDir = path.resolve(distDir, 'public');
    
    if (!fs.existsSync(publicDir)) {
      console.log('🔧 Public directory not found, attempting to fix structure...');
      
      // If there's an assets folder or index.html in dist, move everything to public
      if (fs.existsSync(path.resolve(distDir, 'assets')) || 
          fs.existsSync(path.resolve(distDir, 'index.html'))) {
        
        // Create public directory
        fs.mkdirSync(publicDir, { recursive: true });
        
        // Move client assets to public directory
        const distFiles = fs.readdirSync(distDir);
        const clientAssetFiles = distFiles.filter(file => 
          file !== 'index.js' && 
          file !== 'public' && 
          !file.endsWith('.js') && 
          !file.endsWith('.mjs') && 
          !file.endsWith('.cjs')
        );
        
        for (const file of clientAssetFiles) {
          const srcPath = path.resolve(distDir, file);
          const destPath = path.resolve(publicDir, file);
          
          if (fs.existsSync(srcPath)) {
            console.log(`Moving ${file} to public directory`);
            
            if (fs.lstatSync(srcPath).isDirectory()) {
              // For directories, we need to recursively copy
              execSync(`cp -r "${srcPath}" "${destPath}"`);
              execSync(`rm -rf "${srcPath}"`);
            } else {
              // For files, simple move
              fs.renameSync(srcPath, destPath);
            }
          }
        }
      }
    }
    
    console.log('✅ Replit deployment preparation complete!');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error);
    process.exit(1);
  }
}

deploy();