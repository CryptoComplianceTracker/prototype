# DARA Platform - Deployment Guide

This document provides instructions for deploying the DARA Platform in different environments.

## Deployment Issues

If you're seeing the following error:
```
Error: ENOENT: no such file or directory, stat '/home/runner/workspace/dist/index.html'
```

This means the production server can't find the frontend build files. This guide provides several solutions.

## Solution 1: Using the Deploy Fix Script

This script fixes the directory structure to ensure the server can find the frontend files:

```bash
# Build and fix the deployment
node deploy-fix.js

# Start the production server
NODE_ENV=production node production-server.js
```

## Solution 2: Using the Replit Deploy Fix Script

Specifically optimized for Replit deployment:

```bash
# Build and fix for Replit deployment
node replit-deploy-fix.js

# Start the server
node replit-server.js
```

## Solution 3: Simple Deployment

Creates a completely self-contained deployment folder:

```bash
# Create simple deployment
node simple-deploy.js

# Navigate to the deployment folder
cd deploy

# Install dependencies
npm install

# Start the server
npm start
```

## Manual Deployment Steps

If you prefer to manually deploy, follow these steps:

1. Build the application:
   ```bash
   npm run build
   ```

2. Ensure the frontend files are correctly structured:
   - Check if `dist/public/index.html` exists
   - If not, create the public directory and move client files there:
   ```bash
   mkdir -p dist/public
   cp -r dist/assets dist/public/
   cp dist/index.html dist/public/
   # Move any other client files as needed
   ```

3. Start the production server:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

## Troubleshooting

If you're still having issues:

1. Check the directory structure:
   ```bash
   find dist -type f | sort
   ```

2. Modify the server code to look for `index.html` in different locations:
   ```javascript
   // Try multiple possible locations for index.html
   const possiblePaths = [
     path.resolve(distDir, 'index.html'),
     path.resolve(distDir, 'public', 'index.html')
   ];
   
   for (const indexPath of possiblePaths) {
     if (fs.existsSync(indexPath)) {
       return res.sendFile(indexPath);
     }
   }
   
   // If we get here, no index.html was found
   res.status(404).send('index.html not found in any expected location');
   ```

3. If all else fails, you can create a simple static `index.html` file in the correct location:
   ```bash
   echo '<html><body><h1>DARA Platform</h1><p>Please use the API endpoints directly.</p></body></html>' > dist/index.html
   ```

## Environment Variables

Make sure the following environment variables are set:

- `NODE_ENV=production` - Sets the application to run in production mode
- `PORT=5000` (optional) - Default is 5000, change if needed

## Further Assistance

If you continue to experience deployment issues, please reach out to the development team for additional support.