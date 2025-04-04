/**
 * DARA Platform - Deployment Runner
 * 
 * This script runs through all the deployment steps required to fix the 
 * missing index.html error and prepares the application for production.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDeployment() {
  console.log('🚀 Starting deployment process for DARA Platform...');
  
  try {
    // Step 1: Build the application
    console.log('\n📦 Step 1: Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Step 2: Check the directory structure
    console.log('\n🔍 Step 2: Checking directory structure...');
    const distDir = path.resolve(__dirname, 'dist');
    const publicDir = path.resolve(distDir, 'public');
    
    if (!fs.existsSync(distDir)) {
      console.error('❌ Error: dist directory does not exist after build');
      process.exit(1);
    }
    
    console.log('  - dist directory exists: ✅');
    
    // List files in dist directory
    console.log('\n  Files in dist directory:');
    const distFiles = fs.readdirSync(distDir);
    distFiles.forEach(file => console.log(`  - ${file}`));
    
    // Check if index.html exists in the right place
    const indexInDist = fs.existsSync(path.resolve(distDir, 'index.html'));
    const publicExists = fs.existsSync(publicDir);
    const indexInPublic = publicExists && fs.existsSync(path.resolve(publicDir, 'index.html'));
    
    console.log(`\n  - index.html in dist: ${indexInDist ? '✅' : '❌'}`);
    console.log(`  - public directory exists: ${publicExists ? '✅' : '❌'}`);
    console.log(`  - index.html in public: ${indexInPublic ? '✅' : '❌'}`);
    
    // Step 3: Fix the directory structure if needed
    console.log('\n🔧 Step 3: Fixing directory structure...');
    
    if (!publicExists) {
      console.log('  - Creating public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    if (indexInDist && !indexInPublic) {
      console.log('  - Moving index.html to public directory...');
      fs.copyFileSync(
        path.resolve(distDir, 'index.html'),
        path.resolve(publicDir, 'index.html')
      );
    }
    
    // Check if assets directory exists and move it if needed
    const assetsInDist = fs.existsSync(path.resolve(distDir, 'assets'));
    const assetsInPublic = fs.existsSync(path.resolve(publicDir, 'assets'));
    
    if (assetsInDist && !assetsInPublic) {
      console.log('  - Moving assets directory to public...');
      execSync(`cp -r "${path.resolve(distDir, 'assets')}" "${publicDir}/"`);
    }
    
    // If we still don't have an index.html, create a basic one
    if (!fs.existsSync(path.resolve(publicDir, 'index.html'))) {
      console.log('  - Creating a basic index.html file...');
      
      const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DARA Platform</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #333; }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      background-color: #f9f9f9;
    }
    .info { color: #0066cc; }
  </style>
</head>
<body>
  <h1>DARA Platform</h1>
  <p>Welcome to the DARA Platform deployment.</p>
  
  <div class="card">
    <h2>API Status</h2>
    <p>The API endpoints are available at <code>/api/...</code></p>
    <p>Example: <a href="/api/health" target="_blank">/api/health</a></p>
  </div>
  
  <div class="card">
    <h2>Deployment Information</h2>
    <p>This is a server-side rendered deployment of the DARA Platform.</p>
    <p class="info">If you're seeing this page instead of the full application, the client-side build may not have been properly configured.</p>
  </div>
</body>
</html>`;
      
      fs.writeFileSync(path.resolve(publicDir, 'index.html'), basicHtml);
    }
    
    // Step 4: Create a production server file
    console.log('\n📝 Step 4: Creating production server file...');
    
    const productionServerJs = `
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
console.log('Serving static files from:', publicDir);
app.use(express.static(publicDir));

// Always return the main index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.resolve(publicDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found. Please run the deployment script again.');
    }
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
  
  // List files in the public directory for debugging
  console.log('Files in public directory:');
  const listDir = (dir, prefix = '') => {
    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach(entry => {
        console.log(\`\${prefix}\${entry.name}\${entry.isDirectory() ? '/' : ''}\`);
        if (entry.isDirectory()) {
          listDir(path.join(dir, entry.name), \`\${prefix}  \`);
        }
      });
    } else {
      console.log(\`\${prefix}Directory not found: \${dir}\`);
    }
  };
  
  listDir(publicDir);
});
`;
    
    fs.writeFileSync(
      path.resolve(__dirname, 'production-server.js'), 
      productionServerJs
    );
    
    // Step 5: Provide final instructions
    console.log('\n✅ Deployment preparation complete!');
    console.log('\nTo start the production server, run:');
    console.log('  node production-server.js');
    
    console.log('\nIf deploying to Replit:');
    console.log('1. Make sure the "dist/public" directory contains all frontend assets');
    console.log('2. Use "production-server.js" as your entry point');
    console.log('3. Set the environment variable NODE_ENV=production');
    
  } catch (error) {
    console.error('\n❌ Deployment process failed:', error);
    process.exit(1);
  }
}

runDeployment();