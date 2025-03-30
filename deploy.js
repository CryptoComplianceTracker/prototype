// This script prepares the application for deployment

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Preparing application for deployment...');

try {
  // Step 1: Build the client application
  console.log('📦 Building client application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Create a production package.json that will run our server
  console.log('📝 Creating production package.json...');
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  // Update the start command to use our production server.js directly
  packageJson.main = 'server.js';
  packageJson.scripts.start = 'NODE_ENV=production node server.js';
  
  // Write the modified package.json to dist folder
  fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
  
  // Step 3: Copy our optimized production server to the dist folder
  console.log('📋 Copying production server to dist...');
  fs.copyFileSync('./production-server.js', './dist/server.js');
  
  // Copy server modules
  console.log('📋 Copying server modules...');
  // Create server directory if it doesn't exist
  if (!fs.existsSync('./dist/server')) {
    fs.mkdirSync('./dist/server', { recursive: true });
  }
  
  // Copy required server files
  const serverFiles = [
    './server/auth.js',
    './server/db.js', 
    './server/storage.js',
    './server/templates.js'
  ];
  
  // Copy shared directory
  console.log('📋 Copying shared directory...');
  if (!fs.existsSync('./dist/shared')) {
    fs.mkdirSync('./dist/shared', { recursive: true });
  }
  
  try {
    fs.readdirSync('./shared').forEach(file => {
      const srcPath = `./shared/${file}`;
      const destPath = `./dist/shared/${file}`;
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    });
  } catch (err) {
    console.error('Error copying shared directory:', err);
  }
  
  serverFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        const destPath = './dist/' + file;
        // Create directory if it doesn't exist
        const dirPath = path.dirname(destPath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.copyFileSync(file, destPath);
        console.log(`Copied ${file} to ${destPath}`);
      } else {
        console.warn(`Warning: ${file} not found`);
      }
    } catch (err) {
      console.error(`Error copying ${file}:`, err);
    }
  });
  
  console.log('✅ Deployment preparation complete!');
  console.log('Now you can deploy the application using Replit deployment.');
} catch (error) {
  console.error('❌ Error preparing deployment:', error);
  process.exit(1);
}