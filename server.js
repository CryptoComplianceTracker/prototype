// This file is a special entry point for Replit deployments
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupAuth } from './server/auth.js';
import { storage } from './server/storage.js';
import { db } from './server/db.js';
import { registerTemplateRoutes } from './server/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Security headers with development-friendly CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket connections
      },
    },
    crossOriginEmbedderPolicy: false, // Required for development
  })
);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

async function startServer() {
  try {
    // Set up authentication
    setupAuth(app);
    
    // All API routes go here
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    // Register template routes
    registerTemplateRoutes(app);
    
    // Compliance news API endpoint
    app.get("/api/compliance/news", async (_req, res) => {
      try {
        const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
        const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";
        
        console.log('Fetching news with API key:', NEWS_API_KEY ? 'Key provided' : 'No key');
        
        const response = await axios.get(NEWS_API_ENDPOINT, {
          params: {
            q: "(crypto OR cryptocurrency OR blockchain) AND (compliance OR regulation OR regulatory)",
            language: "en",
            sortBy: "publishedAt",
            pageSize: 15,
            apiKey: NEWS_API_KEY,
          },
          headers: {
            "X-Api-Key": NEWS_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });
        
        console.log('Successfully fetched compliance news from API');
        
        // Transform the response data
        const articles = response.data.articles.map((article) => ({
          title: article.title || 'No title available',
          description: article.description || 'No description available',
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name,
        }));
        
        res.json(articles);
      } catch (error) {
        console.error('Error fetching compliance news:', error);
        
        // Type guard for axios errors
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error;
          console.error('News API error details:', {
            status: axiosError.response?.status,
            data: axiosError.response?.data
          });
        }
        
        res.status(500).json({ 
          message: 'Failed to fetch compliance news',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
    
    // Add API endpoints
    
    // User registration data endpoints
    app.get('/api/user/registrations', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const registrations = await storage.getUserRegistrations(req.user.id);
        console.log(`Retrieved ${registrations.length} registrations for user ${req.user.id}`);
        res.json(registrations);
      } catch (error) {
        console.error('Error fetching user registrations:', error);
        res.status(500).json({ message: "Failed to fetch registrations" });
      }
    });
    
    // Jurisdictions endpoints
    app.get('/api/jurisdictions', async (req, res) => {
      try {
        console.log('Fetching all jurisdictions from database...');
        const jurisdictions = await storage.getAllJurisdictions();
        console.log(`Successfully retrieved ${jurisdictions.length} jurisdictions`);
        res.json(jurisdictions);
      } catch (error) {
        console.error('Error fetching jurisdictions:', error);
        res.status(500).json({ message: "Failed to fetch jurisdictions" });
      }
    });
    
    // Token registrations endpoints - enhanced for deployment
    
    // Admin token routes
    app.get('/api/tokens/admin', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        console.log('Fetching all token registrations for admin...');
        const tokenRegistrations = await storage.getAllTokenRegistrations();
        console.log(`Successfully retrieved ${tokenRegistrations.length} token registrations`);
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations for admin:', error);
        res.status(500).json({ message: "Failed to fetch token registrations" });
      }
    });
    
    app.get('/api/tokens/admin/category/:category', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        const category = req.params.category;
        console.log(`Fetching token registrations for category ${category}...`);
        const tokenRegistrations = await storage.getTokenRegistrationsByCategory(category);
        console.log(`Successfully retrieved ${tokenRegistrations.length} token registrations for category ${category}`);
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations by category:', error);
        res.status(500).json({ message: "Failed to fetch token registrations" });
      }
    });
    
    // User token routes
    app.get('/api/tokens', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        console.log(`Fetching token registrations for user ${req.user.id}...`);
        const tokenRegistrations = await storage.getUserTokenRegistrations(req.user.id);
        console.log(`Successfully retrieved ${tokenRegistrations.length} token registrations for user ${req.user.id}`);
        res.json(tokenRegistrations);
      } catch (error) {
        console.error('Error fetching token registrations:', error);
        res.status(500).json({ message: "Failed to fetch token registrations" });
      }
    });
    
    app.get('/api/tokens/:id', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Fetching token registration ${tokenId} for user ${req.user.id}...`);
        const tokenRegistration = await storage.getTokenRegistrationById(tokenId, req.user.id);
        
        if (!tokenRegistration) {
          return res.status(404).json({ message: "Token registration not found" });
        }
        
        console.log(`Successfully retrieved token registration ${tokenId}`);
        res.json(tokenRegistration);
      } catch (error) {
        console.error('Error fetching token registration:', error);
        res.status(500).json({ message: "Failed to fetch token registration" });
      }
    });
    
    app.post('/api/tokens', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        console.log('Creating new token registration...');
        const tokenData = req.body;
        const tokenRegistration = await storage.createTokenRegistration(req.user.id, tokenData);
        console.log(`Successfully created token registration with ID ${tokenRegistration.id}`);
        res.status(201).json(tokenRegistration);
      } catch (error) {
        console.error('Error creating token registration:', error);
        res.status(500).json({ message: "Failed to create token registration" });
      }
    });
    
    app.patch('/api/tokens/:id', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Updating token registration ${tokenId} for user ${req.user.id}...`);
        
        // Check ownership
        const existingToken = await storage.getTokenRegistrationById(tokenId, req.user.id);
        if (!existingToken) {
          return res.status(404).json({ message: "Token registration not found" });
        }
        
        const tokenData = req.body;
        const updatedToken = await storage.updateTokenRegistration(tokenId, tokenData);
        console.log(`Successfully updated token registration ${tokenId}`);
        res.json(updatedToken);
      } catch (error) {
        console.error('Error updating token registration:', error);
        res.status(500).json({ message: "Failed to update token registration" });
      }
    });
    
    // Document management routes
    app.post('/api/tokens/:id/documents', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Adding document to token ${tokenId}...`);
        
        // Check ownership
        const existingToken = await storage.getTokenRegistrationById(tokenId, req.user.id);
        if (!existingToken) {
          return res.status(404).json({ message: "Token registration not found" });
        }
        
        const documentData = req.body;
        const document = await storage.addTokenDocument(tokenId, documentData);
        console.log(`Successfully added document to token ${tokenId}`);
        res.status(201).json(document);
      } catch (error) {
        console.error('Error adding token document:', error);
        res.status(500).json({ message: "Failed to add token document" });
      }
    });
    
    app.get('/api/tokens/:id/documents', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Fetching documents for token ${tokenId}...`);
        
        // Check ownership
        const existingToken = await storage.getTokenRegistrationById(tokenId, req.user.id);
        if (!existingToken) {
          return res.status(404).json({ message: "Token registration not found" });
        }
        
        const documents = await storage.getTokenDocuments(tokenId);
        console.log(`Successfully retrieved ${documents.length} documents for token ${tokenId}`);
        res.json(documents);
      } catch (error) {
        console.error('Error fetching token documents:', error);
        res.status(500).json({ message: "Failed to fetch token documents" });
      }
    });
    
    // Admin verification routes
    app.post('/api/tokens/:id/verifications', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Adding verification to token ${tokenId}...`);
        const verificationData = req.body;
        const verification = await storage.addTokenVerification(tokenId, req.user.id, verificationData);
        console.log(`Successfully added verification to token ${tokenId}`);
        res.status(201).json(verification);
      } catch (error) {
        console.error('Error adding token verification:', error);
        res.status(500).json({ message: "Failed to add token verification" });
      }
    });
    
    app.get('/api/tokens/:id/verifications', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Fetching verifications for token ${tokenId}...`);
        const verifications = await storage.getTokenVerifications(tokenId);
        console.log(`Successfully retrieved ${verifications.length} verifications for token ${tokenId}`);
        res.json(verifications);
      } catch (error) {
        console.error('Error fetching token verifications:', error);
        res.status(500).json({ message: "Failed to fetch token verifications" });
      }
    });
    
    // Risk assessment routes
    app.post('/api/tokens/:id/risk-assessments', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Adding risk assessment to token ${tokenId}...`);
        const assessmentData = req.body;
        const assessment = await storage.addTokenRiskAssessment(tokenId, req.user.id, assessmentData);
        console.log(`Successfully added risk assessment to token ${tokenId}`);
        res.status(201).json(assessment);
      } catch (error) {
        console.error('Error adding token risk assessment:', error);
        res.status(500).json({ message: "Failed to add token risk assessment" });
      }
    });
    
    app.get('/api/tokens/:id/risk-assessments', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Fetching risk assessments for token ${tokenId}...`);
        const assessments = await storage.getTokenRiskAssessments(tokenId);
        console.log(`Successfully retrieved ${assessments.length} risk assessments for token ${tokenId}`);
        res.json(assessments);
      } catch (error) {
        console.error('Error fetching token risk assessments:', error);
        res.status(500).json({ message: "Failed to fetch token risk assessments" });
      }
    });
    
    // Jurisdiction approval routes
    app.post('/api/tokens/:id/jurisdiction-approvals', async (req, res) => {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Adding jurisdiction approval to token ${tokenId}...`);
        const approvalData = req.body;
        const approval = await storage.addTokenJurisdictionApproval(tokenId, req.user.id, approvalData);
        console.log(`Successfully added jurisdiction approval to token ${tokenId}`);
        res.status(201).json(approval);
      } catch (error) {
        console.error('Error adding token jurisdiction approval:', error);
        res.status(500).json({ message: "Failed to add token jurisdiction approval" });
      }
    });
    
    app.get('/api/tokens/:id/jurisdiction-approvals', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      try {
        const tokenId = parseInt(req.params.id);
        console.log(`Fetching jurisdiction approvals for token ${tokenId}...`);
        const approvals = await storage.getTokenJurisdictionApprovals(tokenId);
        console.log(`Successfully retrieved ${approvals.length} jurisdiction approvals for token ${tokenId}`);
        res.json(approvals);
      } catch (error) {
        console.error('Error fetching token jurisdiction approvals:', error);
        res.status(500).json({ message: "Failed to fetch token jurisdiction approvals" });
      }
    });
    
    // Already created HTTP server at the beginning
    // const httpServer = createServer(app); // Commented out to avoid duplication
    
    // Serve static files from dist folder in production
    const distPath = path.resolve(__dirname, './dist');
    app.use(express.static(distPath));
    
    // Always return the main index.html for any request that is not an API request
    // This is crucial for client-side routing with frameworks like React Router
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(distPath, 'index.html'));
      }
    });
    
    // Start server
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    httpServer.listen({
      port: port,
      host: '0.0.0.0'
    }, () => {
      console.log(`Server started on port ${port}`);
    });
    
    return httpServer;
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
}

startServer();