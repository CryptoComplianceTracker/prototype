# DARA Platform - Replit Deployment Guide

This document provides a step-by-step guide to deploying the DARA Platform on Replit.

## Prerequisites

- A Replit account
- Your project running correctly in development mode
- All environment variables configured (especially `DATABASE_URL` and `VITE_NEWS_API_KEY`)

## Deployment Steps

### Step 1: Build the Application

Before deploying, you need to build the client-side application:

```bash
npm run build
```

This command:
- Builds the React frontend with Vite
- Compiles the server-side code with esbuild
- Outputs everything to the `dist` directory

### Step 2: Prepare for Deployment

Run the specialized deployment script:

```bash
node replit-deploy.js
```

This script:
- Creates an optimized server file for production
- Sets up necessary middleware and routes
- Configures static file serving
- Ensures client-side routing works properly

### Step 3: Deploy on Replit

1. Click the "Deploy" button in the Replit UI (top right of the editor)
2. Select "Deploy from current state"
3. Wait for the deployment to complete

### Step 4: Verify Deployment

Once deployed, your application will be available at a `.replit.app` domain.

Visit the deployed application to ensure everything is working correctly:
- Check that you can register and login
- Verify that API endpoints are responding
- Test all core functionality

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure your `DATABASE_URL` environment variable is correctly set
   - Check that your database is accessible from the Replit environment

2. **API Keys Not Found**
   - Make sure all required API keys are set as environment variables
   - For the News API, ensure `VITE_NEWS_API_KEY` is set

3. **Static Files Not Found**
   - If you see a blank page, check the browser console for 404 errors
   - Ensure the build process completed successfully
   - Verify that static files are being served from the correct directory

4. **Authentication Problems**
   - Check that session configuration is correct
   - Ensure your database tables for sessions exist

### Getting Help

If you encounter issues not covered in this guide, please:
- Check the Replit deployment logs
- Review the server logs for error messages
- Inspect browser console for frontend errors

## Maintaining Your Deployment

After successful deployment, remember to:
- Keep your dependencies updated
- Regularly backup your database
- Monitor your application's performance and logs
- Update API keys if they expire

---

*Last updated: March 30, 2025*