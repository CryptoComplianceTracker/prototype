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

async function deploy() {
  console.log('🚀 Starting Replit deployment for DARA Platform...');
  
  try {
    // Clean up the dist directory
    console.log('🧹 Cleaning dist directory...');
    if (fs.existsSync('./dist')) {
      execSync('rm -rf ./dist');
    }
    fs.mkdirSync('./dist');
    
    // Build the client
    console.log('🏗️ Building client...');
    try {
      execSync('cd client && npm run build', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Error building client:', error);
      process.exit(1);
    }
    
    // Create client/dist directory in the dist folder
    console.log('📁 Creating client/dist directory in the dist folder...');
    fs.mkdirSync('./dist/client', { recursive: true });
    fs.mkdirSync('./dist/client/dist', { recursive: true });
    
    // Copy the client build to dist/client/dist
    console.log('📋 Copying client build...');
    function copyDir(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyDir('./client/dist', './dist/client/dist');
    
    // Copy server files
    console.log('📋 Copying server files...');
    fs.mkdirSync('./dist/server', { recursive: true });
    copyDir('./server', './dist/server');
    
    // Copy shared files
    console.log('📋 Copying shared files...');
    fs.mkdirSync('./dist/shared', { recursive: true });
    copyDir('./shared', './dist/shared');
    
    // Copy necessary config files
    console.log('📋 Copying config files...');
    const configFiles = [
      'package.json',
      'package-lock.json',
      'drizzle.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'tsconfig.json',
      'vite.config.ts'
    ];
    
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `./dist/${file}`);
      }
    }
    
    // Copy the replit-deploy-fixed.js as index.js
    console.log('📋 Creating production server entry point...');
    fs.copyFileSync('./replit-deploy-fixed.js', './dist/index.js');
    
    // Create a .replit file
    console.log('📝 Creating .replit file...');
    const replitConfig = `
run = "node index.js"
hidden = [".config", "package-lock.json"]

[env]
PORT = "3000"

[nix]
channel = "stable-22_11"

[deployment]
run = ["node", "index.js"]
deploymentTarget = "cloudrun"
ignorePorts = false
`;
    
    fs.writeFileSync('./dist/.replit', replitConfig);
    
    // Create a replit.nix file
    console.log('📝 Creating replit.nix file...');
    const replitNix = `{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.postgresql
  ];
}`;
    
    fs.writeFileSync('./dist/replit.nix', replitNix);
    
    // Create a README.md file
    console.log('📝 Creating README.md file...');
    const readme = `# DARA Platform - Crypto Regulatory Compliance Platform

A comprehensive Web3 compliance platform that simplifies regulatory processes for crypto ecosystem participants through intelligent geospatial regulatory tracking and advanced blockchain attestation services.

## Deployment

This is a production build of the DARA Platform. To start the server, run:

\`\`\`
node index.js
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
    
    fs.writeFileSync('./dist/README.md', readme);
    
    console.log('\n✅ Replit deployment preparation complete!');
    console.log('Your application is ready to be deployed on Replit.');
    console.log('Navigate to the dist directory and deploy using Replit\'s deployment feature.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();