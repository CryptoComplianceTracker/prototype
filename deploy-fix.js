/**
 * DARA Platform - Production Deployment Fix
 * 
 * This script fixes the directory structure for production deployment.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fix() {
  console.log('🚀 Starting deployment fix for DARA Platform...');
  
  try {
    // Build the application with the existing build script
    console.log('📦 Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create distribution directory structure
    console.log('🔧 Fixing directory structure...');
    
    // Check if we have the expected directories
    const distDir = path.resolve(__dirname, 'dist');
    const publicDir = path.resolve(distDir, 'public');
    
    if (!fs.existsSync(distDir)) {
      console.error('❌ Error: dist directory does not exist after build');
      process.exit(1);
    }
    
    // Create necessary directories
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Move client assets to public directory if they're in the wrong place
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
    
    // Now create/update the production server file
    console.log('📝 Creating production server file...');
    
    const productionServerJs = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Load the routes - this will set up all API endpoints
import('./server/routes.js').then(({ registerRoutes }) => {
  const server = registerRoutes(app);
  
  // Serve static files from the public directory
  const publicDir = path.resolve(__dirname, 'dist/public');
  app.use(express.static(publicDir));
  
  // Always return the main index.html for any non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(publicDir, 'index.html'));
    }
  });
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running in production mode on port \${PORT}\`);
  });
}).catch(err => {
  console.error('Failed to load routes:', err);
  process.exit(1);
});
`;
    
    fs.writeFileSync(
      path.resolve(__dirname, 'production-server.js'), 
      productionServerJs
    );
    
    // Update package.json start script to use the production server
    console.log('📝 Updating start script in package.json...');
    const packageJsonPath = path.resolve(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.scripts.start = 'NODE_ENV=production node production-server.js';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Deployment fix complete!');
    console.log('\nTo start the production server, run:');
    console.log('  npm start');
    
  } catch (error) {
    console.error('❌ Deployment fix failed:', error);
    process.exit(1);
  }
}

fix();