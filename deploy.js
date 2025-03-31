/**
 * Simplified Deployment Script for DARA Platform
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
  console.log('🚀 Starting deployment for DARA Platform...');
  
  try {
    // Clean up previous deployment
    console.log('🧹 Cleaning up previous deployment...');
    if (fs.existsSync('./dist')) {
      try {
        await execAsync('rm -rf ./dist');
      } catch (error) {
        console.error('Error removing dist directory:', error);
      }
    }
    
    // Create dist directory
    fs.mkdirSync('./dist', { recursive: true });
    fs.mkdirSync('./dist/client', { recursive: true });
    fs.mkdirSync('./dist/server', { recursive: true });
    fs.mkdirSync('./dist/shared', { recursive: true });
    
    // Build the client
    console.log('🏗️ Building client...');
    try {
      await execAsync('cd client && npm run build');
      console.log('✅ Client built successfully');
    } catch (error) {
      console.error('❌ Error building client:', error);
      process.exit(1);
    }
    
    // Copy client build files
    console.log('📋 Copying client build...');
    fs.mkdirSync('./dist/client/dist', { recursive: true });
    await execAsync('cp -r ./client/dist/* ./dist/client/dist/');
    
    // Copy server files
    console.log('📋 Copying server files...');
    await execAsync('cp -r ./server/* ./dist/server/');
    
    // Fix imports in server files (from .ts to .js)
    console.log('🔧 Fixing imports in server files...');
    const serverFiles = getAllFiles('./dist/server');
    for (const file of serverFiles) {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(file, 'utf8');
        const newContent = content.replace(/from ['"](.+)\.ts['"]/g, 'from \'$1.js\'');
        fs.writeFileSync(file.replace('.ts', '.js'), newContent);
      }
    }
    
    // Copy shared files
    console.log('📋 Copying shared files...');
    await execAsync('cp -r ./shared/* ./dist/shared/');
    
    // Fix imports in shared files (from .ts to .js)
    console.log('🔧 Fixing imports in shared files...');
    const sharedFiles = getAllFiles('./dist/shared');
    for (const file of sharedFiles) {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(file, 'utf8');
        const newContent = content.replace(/from ['"](.+)\.ts['"]/g, 'from \'$1.js\'');
        fs.writeFileSync(file.replace('.ts', '.js'), newContent);
      }
    }
    
    // Copy necessary config files
    console.log('📋 Copying config files...');
    const configFiles = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'drizzle.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'production-server.js'
    ];
    
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `./dist/${file}`);
      }
    }
    
    // Update package.json for production
    console.log('📦 Updating package.json for production...');
    const packageJson = JSON.parse(fs.readFileSync('./dist/package.json', 'utf8'));
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node production-server.js"
    };
    packageJson.type = "module";
    fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
    
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
    
    fs.writeFileSync('./dist/.replit', replitConfig);
    
    // Create replit.nix file
    console.log('📝 Creating replit.nix file...');
    const replitNix = `{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.postgresql
  ];
}`;
    
    fs.writeFileSync('./dist/replit.nix', replitNix);
    
    console.log('\n✅ Deployment preparation complete!');
    console.log('Your application is ready to be deployed from the ./dist folder.');
    console.log('Click the Deploy button in the Replit interface to deploy your application.');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
}

deploy();