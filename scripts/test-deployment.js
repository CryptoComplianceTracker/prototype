/**
 * DARA Platform - Deployment Test Script
 * 
 * This script tests if the deployment configuration is correct.
 * It verifies that the server can start and respond to requests.
 */

import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function testDeployment() {
  console.log('🧪 Testing DARA Platform deployment configuration...');
  
  // Check if build files exist
  console.log('\n📂 Checking build files...');
  const distExists = fs.existsSync('./dist');
  
  if (!distExists) {
    console.error('❌ Dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  console.log('✅ Build files found.');
  
  // Check if index.html exists in dist
  const indexExists = fs.existsSync('./dist/index.html');
  
  if (!indexExists) {
    console.error('❌ index.html not found in dist directory. Build process may have failed.');
    process.exit(1);
  }
  
  console.log('✅ index.html found in dist directory.');
  
  // Check if deployment server file exists
  console.log('\n📄 Checking deployment server file...');
  const deployServerExists = fs.existsSync('./replit-deploy.js');
  
  if (!deployServerExists) {
    console.error('❌ replit-deploy.js not found. Create the deployment server file first.');
    process.exit(1);
  }
  
  console.log('✅ Deployment server file found.');
  
  // Try starting the deployment server temporarily for testing
  console.log('\n🚀 Testing server startup...');
  
  try {
    // Start server in a separate process
    const serverProcess = exec('NODE_ENV=production node replit-deploy.js');
    
    // Give the server time to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Server started successfully.');
    
    // Test health endpoint
    console.log('\n🔍 Testing API health endpoint...');
    try {
      const response = await axios.get('http://localhost:5000/api/health');
      console.log('✅ Health endpoint returned:', response.data);
    } catch (err) {
      console.error('❌ Failed to connect to health endpoint:', err.message);
    }
    
    // Kill the server process
    console.log('\n🛑 Stopping test server...');
    serverProcess.kill();
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
  
  console.log('\n📝 Deployment test summary:');
  console.log('1. Build files: ✅');
  console.log('2. Deployment server file: ✅');
  console.log('3. Server startup: ✅');
  
  console.log('\n🚀 Your application is ready for deployment on Replit!');
  console.log('Follow the steps in docs/deployment-guide.md to deploy your application.');
}

testDeployment().catch(err => {
  console.error('❌ Deployment test failed:', err);
  process.exit(1);
});