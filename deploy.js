/**
 * Simplified Deployment Script for DARA Platform
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function deploy() {
  console.log('🚀 Starting simplified deployment for DARA Platform...');
  
  try {
    // 1. Build the client application
    console.log('📦 Building client application...');
    await execAsync('cd client && npm run build');
    console.log('✅ Client build complete!');
    
    // 2. Copy client build to dist folder
    console.log('📋 Copying client build to dist folder...');
    await execAsync('mkdir -p dist');
    await execAsync('cp -r client/dist/* dist/');
    console.log('✅ Client files copied to dist folder!');
    
    // 3. Create a simple production server
    console.log('🔧 Setting up production server...');
    await execAsync('cp production-server.js dist/server.js');
    console.log('✅ Production server setup complete!');
    
    // 4. Create package.json for production
    console.log('📝 Creating production package.json...');
    const packageJson = {
      "name": "dara-platform",
      "version": "1.0.0",
      "type": "module",
      "main": "server.js",
      "scripts": {
        "start": "node server.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "helmet": "^7.1.0"
      }
    };
    
    fs.writeFileSync(
      path.join('dist', 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    console.log('✅ Production package.json created!');
    
    console.log('\n🎉 Deployment preparation complete!');
    console.log('Your application is ready to be deployed.');
    console.log('You can now deploy using Replit\'s deployment feature.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();