/**
 * DARA Platform - Client Deployment Script
 * 
 * This script copies the client build to the deployment folder
 * and sets up a basic server to serve the application.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function deploy() {
  console.log('🚀 Starting client deployment for DARA Platform...');
  
  try {
    // Build the client
    console.log('📦 Building client...');
    const { stdout, stderr } = await execAsync('cd client && npm run build');
    console.log('Client build output:', stdout);
    if (stderr) console.error('Errors during build:', stderr);
    
    // Clean up previous deployment
    console.log('🧹 Cleaning up previous deployment...');
    if (fs.existsSync('./deploy')) {
      await execAsync('rm -rf ./deploy');
    }
    fs.mkdirSync('./deploy');
    
    // Copy client build
    console.log('📋 Copying client build to deployment folder...');
    await execAsync('cp -r ./client/dist/* ./deploy/');
    
    // Create server.js
    console.log('📝 Creating server.js...');
    const serverJs = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static('./'));

// Always return the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
    
    fs.writeFileSync('./deploy/server.js', serverJs);
    
    // Create package.json
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
        "express": "^4.18.2"
      }
    };
    
    fs.writeFileSync('./deploy/package.json', JSON.stringify(packageJson, null, 2));
    
    console.log('\n✅ Client deployment preparation complete!');
    console.log('The client application is ready to be deployed from the ./deploy folder.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();