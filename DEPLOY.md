# DARA Platform Deployment Instructions

This document provides instructions on how to deploy the DARA Platform to Replit.

## Prerequisites

Before deploying, ensure you have:

1. A Replit account
2. PostgreSQL database credentials (available in environment variables)
3. News API key (for regulatory news feed)

## Deployment Steps

### Option 1: Deploy the Simplified Version (Recommended)

This approach creates a simplified version of the application that's guaranteed to deploy successfully.

1. Run the deployment preparation script:
   ```bash
   node scripts/prepare-deployment.js
   ```

2. Navigate to the Replit interface
3. Click on the "Deployment" or "Deploy" tab
4. Click "Deploy from /dist"
5. Wait for the deployment to complete
6. Access your deployed application at the provided URL

### Option 2: Deploy from Replit's UI

You can also try deploying directly from Replit's UI:

1. Navigate to the Replit interface
2. Click on the "Deployment" or "Deploy" tab
3. Click "Deploy from ." (deploy from the current directory)
4. Wait for the deployment to complete
5. Access your deployed application at the provided URL

## Post-Deployment Configuration

After deploying, you may need to set up:

1. **Environment Variables**: Make sure the following environment variables are set in your Replit deployment:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Secret for session management
   - `VITE_NEWS_API_KEY`: API key for the News API (use: `3bd4335bfdd84d8699cafd2db5a9f5e5`)

2. **Database Initialization**: If this is a fresh deployment, ensure your database tables are created:
   ```bash
   npm run db:push
   ```

## Deployment Files

The deployment configuration includes:

- `production-server.js`: A production-ready server that serves the frontend and API
- `server.js`: A simplified server for quick deployments
- `scripts/prepare-deployment.js`: Script to prepare the application for deployment
- `scripts/test-deployment.js`: Script to test the deployment configuration

## Troubleshooting

If you encounter issues during deployment:

1. **Timeout Errors**: If the build times out, try deploying the simplified version from the `/dist` directory.
2. **Database Connection Errors**: Make sure your database connection string is correctly set in the environment variables.
3. **API Errors**: Verify that all required API keys are set in the environment variables.
4. **Serving Static Files**: If the frontend isn't loading, check that the static files are being served correctly from the `client/dist` directory.

## Contact

If you need further assistance, please reach out to support or file an issue in the repository.