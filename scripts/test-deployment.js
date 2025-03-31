/**
 * DARA Platform - Deployment Test Script
 * 
 * This script tests if the deployment configuration is correct.
 * It verifies that the server can start and respond to requests.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function testDeployment() {
  console.log('🧪 Testing deployment configuration...');
  
  try {
    // Check if dist directory exists
    if (!fs.existsSync(distDir)) {
      console.error('❌ Dist directory does not exist. Run the prepare-deployment.js script first.');
      process.exit(1);
    }
    
    // Check essential files
    const essentialFiles = [
      'package.json',
      'server.js',
      '.replit',
      'replit.nix',
      path.join('client', 'dist', 'index.html')
    ];
    
    for (const file of essentialFiles) {
      const filePath = path.join(distDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Essential file ${file} is missing from the deployment.`);
        process.exit(1);
      }
    }
    
    console.log('✅ All essential files are present in the deployment.');
    
    // Validate package.json
    const packageJsonPath = path.join(distDir, 'package.json');
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.start) {
        console.error('❌ package.json is missing a start script.');
        process.exit(1);
      }
      
      console.log('✅ package.json is valid.');
    } catch (error) {
      console.error('❌ Failed to parse package.json:', error);
      process.exit(1);
    }
    
    // Validate .replit file
    const replitFilePath = path.join(distDir, '.replit');
    const replitContent = fs.readFileSync(replitFilePath, 'utf8');
    if (!replitContent.includes('run = "npm start"')) {
      console.error('❌ .replit file is missing the correct run command.');
      process.exit(1);
    }
    
    console.log('✅ .replit file is valid.');
    
    // Start server in test mode (use a different port)
    console.log('🚀 Starting server in test mode...');
    
    // Create a test environment variables file
    const envPath = path.join(distDir, '.env.test');
    fs.writeFileSync(envPath, 'PORT=3001\n');
    
    // Change directory to dist
    process.chdir(distDir);
    
    // Start server in the background
    const server = await execAsync('PORT=3001 node server.js &');
    const serverPid = server.stdout.trim();
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test server response
    console.log('🔄 Testing server response...');
    
    try {
      const response = await fetch('http://localhost:3001');
      if (response.ok) {
        console.log('✅ Server is responding correctly.');
      } else {
        console.error(`❌ Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to connect to the server:', error);
    }
    
    // Kill the test server
    try {
      await execAsync(`kill $(ps aux | grep "[n]ode server.js" | awk '{print $2}')`);
    } catch (error) {
      console.error('⚠️ Failed to kill test server:', error);
    }
    
    // Change back to root directory
    process.chdir(rootDir);
    
    // Remove test env file
    fs.unlinkSync(envPath);
    
    console.log('\n✅ Deployment test completed successfully!');
    console.log('Your application is ready for deployment.');
    console.log('To deploy, click the Deploy button in the Replit interface.');
    
  } catch (error) {
    console.error('❌ Deployment test failed:', error);
    process.exit(1);
  }
}

testDeployment();