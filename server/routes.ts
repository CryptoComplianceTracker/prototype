import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { db } from "./db";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import axios from "axios";
import { registerTemplateRoutes } from "./templates";
import {
  exchangeInfoSchema,
  stablecoinInfoSchema,
  defiProtocolInfoSchema,
  nftMarketplaceInfoSchema,
  cryptoFundInfoSchema,
  policyTemplateSchema,
  policySchema,
  policyVersionSchema,
  policyObligationMappingSchema,
  policyTagSchema,
  policyApprovalSchema,
  complianceReportTypeSchema,
  complianceReportSchema,
  reportScheduleSchema,
  tokenRegistrationSchema,
  tokenRegistrationDocumentSchema,
  compliance_report_types,
  compliance_reports,
  report_schedules,
  token_registrations,
  token_registration_documents,
  token_registration_verifications,
  token_risk_assessments,
  token_jurisdiction_approvals
} from "@shared/schema";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createRegistrationAttestation } from "@/lib/attestation-service";

// Rate limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Apply rate limiting to all routes
  app.use('/api/', apiLimiter);

  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Set up authentication routes
  setupAuth(app);
  
  // Set up template routes
  registerTemplateRoutes(app);

  // Stablecoin registration route
  app.post("/api/stablecoin/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/stablecoin/register');
      return res.sendStatus(401);
    }
    try {
      const data = stablecoinInfoSchema.parse(req.body);
      const registration = await storage.createStablecoinInfo(req.user.id, data);
      if (req.user.walletAddress) {
        const attestation = await createRegistrationAttestation(
          'stablecoin',
          registration.id.toString(),
          req.user.walletAddress
        );
        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        }
      }
      console.log('Stablecoin registration successful');
      res.sendStatus(201);
    } catch (error) {
      console.error('Error registering stablecoin:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // DeFi Protocol registration route
  app.post("/api/defi/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/defi/register');
      return res.sendStatus(401);
    }
    try {
      const data = defiProtocolInfoSchema.parse(req.body);
      const registration = await storage.createDefiProtocolInfo(req.user.id, data);
      if (req.user.walletAddress) {
        const attestation = await createRegistrationAttestation(
          'defi',
          registration.id.toString(),
          req.user.walletAddress
        );
        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        }
      }
      console.log('DeFi protocol registration successful');
      res.sendStatus(201);
    } catch (error) {
      console.error('Error registering DeFi protocol:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // NFT Marketplace registration route
  app.post("/api/nft/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/nft/register');
      return res.sendStatus(401);
    }
    try {
      const data = nftMarketplaceInfoSchema.parse(req.body);
      const registration = await storage.createNftMarketplaceInfo(req.user.id, data);
      if (req.user.walletAddress) {
        const attestation = await createRegistrationAttestation(
          'nft',
          registration.id.toString(),
          req.user.walletAddress
        );
        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        }
      }
      console.log('NFT marketplace registration successful');
      res.sendStatus(201);
    } catch (error) {
      console.error('Error registering NFT marketplace:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Crypto Fund registration route
  app.post("/api/fund/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/fund/register');
      return res.sendStatus(401);
    }
    try {
      const data = cryptoFundInfoSchema.parse(req.body);
      const registration = await storage.createCryptoFundInfo(req.user.id, data);
      if (req.user.walletAddress) {
        const attestation = await createRegistrationAttestation(
          'fund',
          registration.id.toString(),
          req.user.walletAddress
        );
        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        }
      }
      console.log('Crypto fund registration successful');
      res.sendStatus(201);
    } catch (error) {
      console.error('Error registering crypto fund:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Admin routes with enhanced logging
  const checkAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to admin endpoint');
      return res.sendStatus(401);
    }
    if (!req.user.isAdmin) {
      console.log(`Non-admin user ${req.user.id} attempted to access admin endpoint`);
      return res.sendStatus(403);
    }
    next();
  };

  // Admin exchange registrations
  app.get("/api/admin/exchanges", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all exchange info from database...');
      const exchanges = await storage.getAllExchangeInfo();
      console.log(`Successfully retrieved ${exchanges.length} exchanges`);
      res.json(exchanges);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
      res.status(500).json({
        message: "Failed to fetch exchanges",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin stablecoin registrations
  app.get("/api/admin/stablecoins", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all stablecoin info from database...');
      const stablecoins = await storage.getAllStablecoinInfo();
      console.log(`Successfully retrieved ${stablecoins.length} stablecoins`);
      res.json(stablecoins);
    } catch (error) {
      console.error("Error fetching stablecoins:", error);
      res.status(500).json({
        message: "Failed to fetch stablecoins",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin DeFi protocol registrations
  app.get("/api/admin/defi", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all DeFi protocol info from database...');
      const defiProtocols = await storage.getAllDefiProtocolInfo();
      console.log(`Successfully retrieved ${defiProtocols.length} DeFi protocols`);
      res.json(defiProtocols);
    } catch (error) {
      console.error("Error fetching DeFi protocols:", error);
      res.status(500).json({
        message: "Failed to fetch DeFi protocols",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin NFT marketplace registrations
  app.get("/api/admin/nft", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all NFT marketplace info from database...');
      const nftMarketplaces = await storage.getAllNftMarketplaceInfo();
      console.log(`Successfully retrieved ${nftMarketplaces.length} NFT marketplaces`);
      res.json(nftMarketplaces);
    } catch (error) {
      console.error("Error fetching NFT marketplaces:", error);
      res.status(500).json({
        message: "Failed to fetch NFT marketplaces",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin crypto fund registrations
  app.get("/api/admin/funds", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all crypto fund info from database...');
      const cryptoFunds = await storage.getAllCryptoFundInfo();
      console.log(`Successfully retrieved ${cryptoFunds.length} crypto funds`);
      res.json(cryptoFunds);
    } catch (error) {
      console.error("Error fetching crypto funds:", error);
      res.status(500).json({
        message: "Failed to fetch crypto funds",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Compliance News API route
  app.get("/api/compliance/news", async (_req, res) => {
    try {
      const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
      const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";
      
      // Make a server-side request to the News API
      // Using axios imported at the top of the file
      
      interface NewsSource {
        name: string;
      }
      
      interface NewsArticle {
        title: string;
        description: string;
        url: string;
        publishedAt: string;
        source: NewsSource;
      }
      
      interface NewsAPIResponse {
        articles: NewsArticle[];
      }
      
      console.log('Fetching news with API key:', NEWS_API_KEY ? 'Key provided' : 'No key');
      
      const response = await axios.get<NewsAPIResponse>(NEWS_API_ENDPOINT, {
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
      const articles = response.data.articles.map((article: NewsArticle) => ({
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));
      
      res.json(articles);
    } catch (error: unknown) {
      console.error('Error fetching compliance news:', error);
      
      // Type guard for axios errors
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number, data: any } };
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
  
  // Compliance reporting routes
  app.get("/api/compliance/report-types", async (_req, res) => {
    try {
      console.log('Fetching compliance report types...');
      const reportTypes = await db.select().from(compliance_report_types);
      console.log(`Successfully retrieved ${reportTypes.length} report types`);
      res.json(reportTypes);
    } catch (error) {
      console.error("Error fetching compliance report types:", error);
      res.status(500).json({ 
        message: "Failed to fetch compliance report types",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.get("/api/compliance/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/compliance/reports');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      console.log(`Fetching compliance reports for user ${req.user.id}...`);
      const reports = await db.select().from(compliance_reports)
        .where(eq(compliance_reports.user_id, req.user.id));
      console.log(`Successfully retrieved ${reports.length} reports`);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      res.status(500).json({ 
        message: "Failed to fetch compliance reports",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.get("/api/compliance/reports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/compliance/reports/:id');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const reportId = parseInt(req.params.id);
      console.log(`Fetching compliance report ${reportId} for user ${req.user.id}...`);
      
      const [report] = await db.select().from(compliance_reports)
        .where(and(
          eq(compliance_reports.id, reportId),
          eq(compliance_reports.user_id, req.user.id)
        ));
      
      if (!report) {
        console.log(`Report ${reportId} not found for user ${req.user.id}`);
        return res.status(404).json({ error: "Report not found" });
      }
      
      console.log(`Successfully retrieved report ${reportId}`);
      res.json(report);
    } catch (error) {
      console.error("Error fetching compliance report:", error);
      res.status(500).json({ 
        message: "Failed to fetch compliance report",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.post("/api/compliance/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/compliance/reports');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const reportData = complianceReportSchema.parse(req.body);
      console.log(`Creating new compliance report for user ${req.user.id}...`);
      
      const [report] = await db.insert(compliance_reports).values({
        ...reportData,
        user_id: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      }).returning();
      
      console.log(`Successfully created report ${report.id}`);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating compliance report:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Failed to create compliance report",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.put("/api/compliance/reports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to PUT /api/compliance/reports/:id');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const reportId = parseInt(req.params.id);
      const reportData = complianceReportSchema.parse(req.body);
      console.log(`Updating compliance report ${reportId} for user ${req.user.id}...`);
      
      const [existingReport] = await db.select().from(compliance_reports)
        .where(and(
          eq(compliance_reports.id, reportId),
          eq(compliance_reports.user_id, req.user.id)
        ));
      
      if (!existingReport) {
        console.log(`Report ${reportId} not found for user ${req.user.id}`);
        return res.status(404).json({ error: "Report not found" });
      }
      
      const [updatedReport] = await db.update(compliance_reports)
        .set({
          ...reportData,
          version: (existingReport.version || 1) + 1,
          updated_at: new Date()
        })
        .where(eq(compliance_reports.id, reportId))
        .returning();
      
      console.log(`Successfully updated report ${reportId}`);
      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating compliance report:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Failed to update compliance report",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.get("/api/compliance/report-schedules", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/compliance/report-schedules');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      console.log(`Fetching report schedules for user ${req.user.id}...`);
      const schedules = await db.select().from(report_schedules)
        .where(eq(report_schedules.user_id, req.user.id));
      console.log(`Successfully retrieved ${schedules.length} schedules`);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching report schedules:", error);
      res.status(500).json({ 
        message: "Failed to fetch report schedules",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.post("/api/compliance/report-schedules", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/compliance/report-schedules');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const scheduleData = reportScheduleSchema.parse(req.body);
      console.log(`Creating new report schedule for user ${req.user.id}...`);
      
      const [schedule] = await db.insert(report_schedules).values({
        ...scheduleData,
        user_id: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      }).returning();
      
      console.log(`Successfully created schedule ${schedule.id}`);
      res.status(201).json(schedule);
    } catch (error) {
      console.error("Error creating report schedule:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Failed to create report schedule",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.put("/api/compliance/report-schedules/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to PUT /api/compliance/report-schedules/:id');
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const scheduleId = parseInt(req.params.id);
      const scheduleData = reportScheduleSchema.parse(req.body);
      console.log(`Updating report schedule ${scheduleId} for user ${req.user.id}...`);
      
      const [existingSchedule] = await db.select().from(report_schedules)
        .where(and(
          eq(report_schedules.id, scheduleId),
          eq(report_schedules.user_id, req.user.id)
        ));
      
      if (!existingSchedule) {
        console.log(`Schedule ${scheduleId} not found for user ${req.user.id}`);
        return res.status(404).json({ error: "Schedule not found" });
      }
      
      const [updatedSchedule] = await db.update(report_schedules)
        .set({
          ...scheduleData,
          updated_at: new Date()
        })
        .where(eq(report_schedules.id, scheduleId))
        .returning();
      
      console.log(`Successfully updated schedule ${scheduleId}`);
      res.json(updatedSchedule);
    } catch (error) {
      console.error("Error updating report schedule:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Failed to update report schedule",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/transactions');
      return res.sendStatus(401);
    }
    try {
      const transactions = await storage.getTransactionsByUserId(req.user.id);
      console.log('Transactions retrieved successfully');
      res.json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Exchange registration route (updated)
  app.post("/api/exchange/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/exchange/register');
      return res.sendStatus(401);
    }
    try {
      const data = exchangeInfoSchema.parse(req.body);
      const registration = await storage.createExchangeInfo(req.user.id, data);

      // Create attestation if wallet address is provided
      if (req.user.walletAddress) {
        const attestation = await createRegistrationAttestation(
          'exchange',
          registration.id.toString(),
          req.user.walletAddress
        );

        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        }
      }

      console.log('Exchange registration successful');
      res.sendStatus(201);
    } catch (error) {
      console.error('Error registering exchange:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // User profile and KYC routes
  app.post("/api/user/kyc", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/user/kyc');
      return res.sendStatus(401);
    }
    const kycSchema = z.object({
      walletAddress: z.string(),
      complianceData: z.record(z.unknown())
    });

    try {
      const data = kycSchema.parse(req.body);
      await storage.updateUserKYC(req.user.id, {
        walletAddress: data.walletAddress,
        kycVerified: true,
        complianceData: data.complianceData
      });
      console.log('KYC update successful');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating KYC:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Add the new endpoint after the existing /api/user/kyc endpoint
  app.get("/api/user/registrations", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/user/registrations');
      return res.sendStatus(401);
    }

    try {
      // Fetch all types of registrations for the user
      const [exchanges, stablecoins, defiProtocols, nftMarketplaces, cryptoFunds] = await Promise.all([
        storage.getExchangeInfoByUserId(req.user.id),
        storage.getStablecoinInfoByUserId(req.user.id),
        storage.getDefiProtocolInfoByUserId(req.user.id),
        storage.getNftMarketplaceInfoByUserId(req.user.id),
        storage.getCryptoFundInfoByUserId(req.user.id)
      ]);

      // Transform into a unified format
      const registrations = [
        ...exchanges.map(reg => ({ ...reg, type: 'exchange' })),
        ...stablecoins.map(reg => ({ ...reg, type: 'stablecoin' })),
        ...defiProtocols.map(reg => ({ ...reg, type: 'defi' })),
        ...nftMarketplaces.map(reg => ({ ...reg, type: 'nft' })),
        ...cryptoFunds.map(reg => ({ ...reg, type: 'fund' }))
      ];

      console.log(`Retrieved ${registrations.length} registrations for user ${req.user.id}`);
      res.json(registrations);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Risk assessment route
  app.get("/api/risk-assessment/:walletAddress", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/risk-assessment');
      return res.sendStatus(401);
    }
    try {
      const riskScore = Math.floor(Math.random() * 100); // Mock risk score
      console.log('Risk assessment calculated');
      res.json({ riskScore });
    } catch (error) {
      console.error('Error performing risk assessment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Policy Framework API Routes

  // Policy Templates
  app.get("/api/policy-templates", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/policy-templates');
      return res.sendStatus(401);
    }
    try {
      const templates = await storage.getAllPolicyTemplates();
      console.log(`Retrieved ${templates.length} policy templates`);
      res.json(templates);
    } catch (error) {
      console.error('Error fetching policy templates:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/policy-templates/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/policy-templates/:id');
      return res.sendStatus(401);
    }
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const template = await storage.getPolicyTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Policy template not found" });
      }
      
      console.log(`Retrieved policy template: ${template.name}`);
      res.json(template);
    } catch (error) {
      console.error('Error fetching policy template:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/policy-templates/category/:category", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/policy-templates/category/:category');
      return res.sendStatus(401);
    }
    try {
      const { category } = req.params;
      const templates = await storage.getPolicyTemplatesByCategory(category);
      console.log(`Retrieved ${templates.length} policy templates for category: ${category}`);
      res.json(templates);
    } catch (error) {
      console.error('Error fetching policy templates by category:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/policy-templates", checkAdminAuth, async (req, res) => {
    try {
      const data = policyTemplateSchema.parse(req.body);
      const template = await storage.createPolicyTemplate(data);
      console.log(`Created new policy template: ${template.name}`);
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating policy template:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Policies
  app.post("/api/policies", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/policies');
      return res.sendStatus(401);
    }
    try {
      // Force recreate policy tables
      try {
        // First check if we need to drop the policies table and recreate it
        try {
          // Try to get the table schema to check if version column exists
          const result = await db.execute(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'policies' AND column_name = 'version'
          `);
          
          // If no version column is found, drop and recreate all policy tables
          if (result.rows.length === 0) {
            console.log('Version column not found in policies table, recreating tables...');
            
            // Drop dependent tables first due to foreign key constraints
            await db.execute(`DROP TABLE IF EXISTS "policy_obligation_mappings" CASCADE`);
            await db.execute(`DROP TABLE IF EXISTS "policy_tags" CASCADE`);
            await db.execute(`DROP TABLE IF EXISTS "policy_approvals" CASCADE`);
            await db.execute(`DROP TABLE IF EXISTS "policy_versions" CASCADE`);
            await db.execute(`DROP TABLE IF EXISTS "policies" CASCADE`);
            await db.execute(`DROP TABLE IF EXISTS "policy_templates" CASCADE`);
            
            console.log('Policy tables dropped successfully');
          }
        } catch (error) {
          console.log('Error checking for version column, will recreate tables:', error);
        }
        
        // Now create all tables
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policies" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "type" VARCHAR(100) NOT NULL,
            "jurisdiction_id" INTEGER,
            "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
            "version" VARCHAR(50) NOT NULL DEFAULT '1.0',
            "content" JSONB NOT NULL,
            "metadata" JSONB,
            "created_by" INTEGER NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE
          )
        `);
        
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policy_versions" (
            "id" SERIAL PRIMARY KEY,
            "policy_id" INTEGER NOT NULL,
            "version" VARCHAR(50) NOT NULL,
            "content" JSONB NOT NULL,
            "change_notes" TEXT,
            "created_by" INTEGER NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
          )
        `);
        
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policy_templates" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "description" TEXT,
            "category" VARCHAR(100) NOT NULL,
            "content" JSONB NOT NULL,
            "metadata" JSONB,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE
          )
        `);
        
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policy_tags" (
            "id" SERIAL PRIMARY KEY,
            "policy_id" INTEGER NOT NULL,
            "tag" VARCHAR(100) NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
          )
        `);
        
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policy_approvals" (
            "id" SERIAL PRIMARY KEY,
            "policy_id" INTEGER NOT NULL,
            "approver_id" INTEGER NOT NULL,
            "status" VARCHAR(50) NOT NULL,
            "comments" TEXT,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
          )
        `);
        
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "policy_obligation_mappings" (
            "id" SERIAL PRIMARY KEY,
            "policy_id" INTEGER NOT NULL,
            "obligation_id" INTEGER NOT NULL,
            "coverage_level" INTEGER NOT NULL,
            "notes" TEXT,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE
          )
        `);
        
        console.log('Created policy-related tables');
      } catch (dbError) {
        console.error('Error creating policy tables:', dbError);
      }
      
      // Handle string content vs object content
      let parsedData;
      if (typeof req.body.content === 'string') {
        // If content is a string, create the expected object structure
        parsedData = {
          ...req.body,
          content: { text: req.body.content }
        };
      } else if (typeof req.body.content === 'object' && req.body.content.text) {
        // If content is already the correct object structure, use it as is
        parsedData = req.body;
      } else {
        throw new Error('Invalid content format');
      }
      
      // Parse the data
      const data = policySchema.parse(parsedData);
      
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      
      const policy = await storage.createPolicy(req.user.id, data);
      console.log(`Created new policy: ${policy.name}`);
      res.status(201).json(policy);
    } catch (error) {
      console.error('Error creating policy:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }
  });

  app.get("/api/policies", checkAdminAuth, async (req, res) => {
    try {
      const policies = await storage.getAllPolicies();
      console.log(`Retrieved ${policies.length} policies`);
      res.json(policies);
    } catch (error) {
      console.error('Error fetching policies:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/policies/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/policies/:id');
      return res.sendStatus(401);
    }
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const policy = await storage.getPolicy(id);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to access policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to access this policy" });
      }
      
      console.log(`Retrieved policy: ${policy.name}`);
      res.json(policy);
    } catch (error) {
      console.error('Error fetching policy:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/:userId/policies", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/user/:userId/policies');
      return res.sendStatus(401);
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    // Check if user is requesting their own policies or is an admin
    if (userId !== req.user.id && !req.user.isAdmin) {
      console.log(`User ${req.user.id} attempted to access policies for user ${userId}`);
      return res.status(403).json({ message: "Not authorized to access other user's policies" });
    }
    
    try {
      const policies = await storage.getPoliciesByUserId(userId);
      console.log(`Retrieved ${policies.length} policies for user ${userId}`);
      res.json(policies);
    } catch (error) {
      console.error('Error fetching user policies:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/policies/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to PUT /api/policies/:id');
      return res.sendStatus(401);
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    try {
      // First check if policy exists and user is authorized
      const existingPolicy = await storage.getPolicy(id);
      if (!existingPolicy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && existingPolicy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to update policy owned by user ${existingPolicy.created_by}`);
        return res.status(403).json({ message: "Not authorized to update this policy" });
      }
      
      // Validate update data
      const updateData = req.body;
      const updatedPolicy = await storage.updatePolicy(id, updateData);
      
      console.log(`Updated policy: ${updatedPolicy.name}`);
      res.json(updatedPolicy);
    } catch (error) {
      console.error('Error updating policy:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Policy Versions
  app.post("/api/policies/:policyId/versions", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/policies/:policyId/versions');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // First check if we need to recreate the policy version tables
      try {
        // Check if change_summary column exists
        const result = await db.execute(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'policy_versions' AND column_name = 'change_summary'
        `);
        
        // If no change_summary column is found, recreate policy_versions table
        if (result.rows.length === 0) {
          console.log('change_summary column not found in policy_versions table, recreating table...');
          
          await db.execute(`DROP TABLE IF EXISTS "policy_versions" CASCADE`);
          
          await db.execute(`
            CREATE TABLE IF NOT EXISTS "policy_versions" (
              "id" SERIAL PRIMARY KEY,
              "policy_id" INTEGER NOT NULL,
              "version" VARCHAR(50) NOT NULL,
              "content" JSONB NOT NULL,
              "change_summary" TEXT NOT NULL,
              "created_by" INTEGER NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
            )
          `);
          
          console.log('policy_versions table recreated successfully');
        }
      } catch (dbError) {
        console.error('Error checking/recreating policy_versions table:', dbError);
      }
      
      // Check if policy exists and user is authorized
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to add version to policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to update this policy" });
      }
      
      // Ensure the request body includes the required fields
      const formattedData = {
        ...req.body,
        policy_id: policyId
      };
      
      const data = policyVersionSchema.parse(formattedData);
      const version = await storage.createPolicyVersion(policyId, req.user.id, data);
      
      console.log(`Created new version ${version.version} for policy: ${policy.name}`);
      res.status(201).json(version);
    } catch (error) {
      console.error('Error creating policy version:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/policies/:policyId/versions", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/policies/:policyId/versions');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // First check if we need to recreate the policy version tables
      try {
        // Check if change_summary column exists
        const result = await db.execute(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'policy_versions' AND column_name = 'change_summary'
        `);
        
        // If no change_summary column is found, recreate policy_versions table
        if (result.rows.length === 0) {
          console.log('change_summary column not found in policy_versions table, recreating table...');
          
          await db.execute(`DROP TABLE IF EXISTS "policy_versions" CASCADE`);
          
          await db.execute(`
            CREATE TABLE IF NOT EXISTS "policy_versions" (
              "id" SERIAL PRIMARY KEY,
              "policy_id" INTEGER NOT NULL,
              "version" VARCHAR(50) NOT NULL,
              "content" JSONB NOT NULL,
              "change_summary" TEXT NOT NULL,
              "created_by" INTEGER NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
            )
          `);
          
          console.log('policy_versions table recreated successfully');
        }
      } catch (dbError) {
        console.error('Error checking/recreating policy_versions table:', dbError);
      }
      
      // Check if policy exists
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view versions of policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to view this policy's versions" });
      }
      
      const versions = await storage.getPolicyVersions(policyId);
      console.log(`Retrieved ${versions.length} versions for policy: ${policy.name}`);
      res.json(versions);
    } catch (error) {
      console.error('Error fetching policy versions:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Policy Tags
  app.post("/api/policies/:policyId/tags", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/policies/:policyId/tags');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // Check if policy exists and user is authorized
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to add tag to policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to update this policy" });
      }
      
      const tagSchema = policyTagSchema.extend({
        policy_id: z.number().optional()
      });
      
      const data = tagSchema.parse(req.body);
      const tag = await storage.createPolicyTag({
        ...data,
        policy_id: policyId
      });
      
      console.log(`Added tag "${tag.tag}" to policy: ${policy.name}`);
      res.status(201).json(tag);
    } catch (error) {
      console.error('Error adding policy tag:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/policies/:policyId/tags", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/policies/:policyId/tags');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      const tags = await storage.getPolicyTagsByPolicyId(policyId);
      console.log(`Retrieved ${tags.length} tags for policy ID: ${policyId}`);
      res.json(tags);
    } catch (error) {
      console.error('Error fetching policy tags:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Policy Obligation Mappings
  app.post("/api/policies/:policyId/obligations", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/policies/:policyId/obligations');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // Check if policy exists and user is authorized
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to add obligation mapping to policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to update this policy" });
      }
      
      const mappingSchema = policyObligationMappingSchema.extend({
        policy_id: z.number().optional()
      });
      
      const data = mappingSchema.parse(req.body);
      const mapping = await storage.createPolicyObligationMapping({
        ...data,
        policy_id: policyId
      });
      
      console.log(`Added obligation mapping for obligation ID ${mapping.obligation_id} to policy: ${policy.name}`);
      res.status(201).json(mapping);
    } catch (error) {
      console.error('Error adding policy obligation mapping:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/policies/:policyId/obligations", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/policies/:policyId/obligations');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // First check if we need to recreate the policy_obligation_mappings table
      try {
        // Check if coverage_level column exists
        const result = await db.execute(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'policy_obligation_mappings' AND column_name = 'coverage_level'
        `);
        
        // If no coverage_level column is found, recreate policy_obligation_mappings table
        if (result.rows.length === 0) {
          console.log('coverage_level column not found in policy_obligation_mappings table, recreating table...');
          
          await db.execute(`DROP TABLE IF EXISTS "policy_obligation_mappings" CASCADE`);
          
          await db.execute(`
            CREATE TABLE IF NOT EXISTS "policy_obligation_mappings" (
              "id" SERIAL PRIMARY KEY,
              "policy_id" INTEGER NOT NULL,
              "obligation_id" INTEGER NOT NULL,
              "coverage_level" INTEGER NOT NULL,
              "notes" TEXT,
              "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
              "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
            )
          `);
          
          console.log('policy_obligation_mappings table recreated successfully');
        }
      } catch (dbError) {
        console.error('Error checking/recreating policy_obligation_mappings table:', dbError);
      }
      
      const mappings = await storage.getPolicyObligationMappingsByPolicyId(policyId);
      console.log(`Retrieved ${mappings.length} obligation mappings for policy ID: ${policyId}`);
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching policy obligation mappings:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Policy Approvals
  app.post("/api/policies/:policyId/approvals", checkAdminAuth, async (req, res) => {
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // Check if policy exists
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      const approvalSchema = policyApprovalSchema.extend({
        policy_id: z.number().optional(),
        approver_id: z.number().optional(),
      });
      
      const data = approvalSchema.parse(req.body);
      const approval = await storage.createPolicyApproval({
        ...data,
        policy_id: policyId,
        approver_id: req.user.id
      });
      
      // Update policy status if approval is granted or rejected
      if (data.status === 'approved' || data.status === 'rejected') {
        const newStatus = data.status === 'approved' ? 'active' : 'review_needed';
        await storage.updatePolicy(policyId, { status: newStatus });
      }
      
      console.log(`Added ${data.status} approval for policy: ${policy.name}`);
      res.status(201).json(approval);
    } catch (error) {
      console.error('Error adding policy approval:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/policies/:policyId/approvals", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/policies/:policyId/approvals');
      return res.sendStatus(401);
    }
    
    const policyId = parseInt(req.params.policyId);
    if (isNaN(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID format" });
    }
    
    try {
      // Check if policy exists
      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      // Check if user is admin or policy creator
      if (!req.user.isAdmin && policy.created_by !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view approvals of policy owned by user ${policy.created_by}`);
        return res.status(403).json({ message: "Not authorized to view this policy's approvals" });
      }
      
      const approvals = await storage.getPolicyApprovalsByPolicyId(policyId);
      console.log(`Retrieved ${approvals.length} approvals for policy: ${policy.name}`);
      res.json(approvals);
    } catch (error) {
      console.error('Error fetching policy approvals:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Jurisdiction Obligation lookup for Policy Framework integration
  app.get("/api/jurisdictions/obligations", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/jurisdictions/obligations');
      return res.sendStatus(401);
    }
    
    try {
      // This would be more complex in a real system, combining 
      // multiple tables and data sources to provide a unified view
      // of all obligations across jurisdictions
      
      // For now, we'll provide a simplified response structure
      const jurisdictions = await storage.getAllJurisdictions();
      
      // Map jurisdictions to a list of obligations
      const obligationsByJurisdiction = await Promise.all(
        jurisdictions.map(async (jurisdiction) => {
          // In a real system, we'd query specific obligation tables
          // For now, simulate with reporting obligations which should exist
          const obligations = await storage.getReportingObligationsByJurisdictionId(jurisdiction.id);
          
          return {
            jurisdiction_id: jurisdiction.id,
            jurisdiction_name: jurisdiction.name,
            obligations: obligations.map(o => ({
              id: o.id,
              title: o.title,
              description: o.description,
              frequency: o.frequency,
              // Use appropriate fields for deadline and authority
              deadline: o.due_by_day ? `Day ${o.due_by_day} of ${o.due_months || 'the month'}` : null,
              authority: o.delivery_method || null
            }))
          };
        })
      );
      
      console.log(`Retrieved obligations data for ${jurisdictions.length} jurisdictions`);
      res.json(obligationsByJurisdiction);
    } catch (error) {
      console.error('Error fetching jurisdiction obligations:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compliance Dashboard API endpoints
  app.get("/api/user/compliance", (req, res) => {
    // This endpoint would normally fetch actual compliance data from the database
    // For now, we'll return mock data for the UI development
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
      policies: { totalCount: 12, completedCount: 8 },
      kyc: { totalCount: 28, completedCount: 22 },
      transactions: { totalCount: 45, completedCount: 39 },
      sars: { totalCount: 6, completedCount: 4 },
      obligations: { totalCount: 18, completedCount: 15 },
      reviews: { totalCount: 9, completedCount: 7 },
      intelligence: { totalCount: 14, completedCount: 10 },
      reporting: { totalCount: 5, completedCount: 3 }
    });
  });

  // Policy Framework API endpoints
  app.get("/api/policy-templates", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // In a production environment, these would be fetched from the database
    res.json([
      {
        id: "pt-1",
        name: "FATF Travel Rule Implementation",
        description: "Policy template for implementing the FATF Travel Rule for VASPs",
        category: "AML",
        jurisdiction: "Global",
        lastUpdated: "2025-01-15"
      },
      {
        id: "pt-2",
        name: "KYC Onboarding Procedure",
        description: "Standardized customer onboarding process aligned with global best practices",
        category: "KYC",
        jurisdiction: "Global",
        lastUpdated: "2025-02-20"
      },
      {
        id: "pt-3",
        name: "EU 6th AML Directive Compliance",
        description: "Comprehensive policy template for EU 6AMLD compliance",
        category: "AML",
        jurisdiction: "European Union",
        lastUpdated: "2025-03-10"
      }
    ]);
  });

  app.get("/api/user/:userId/policies", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // In a production environment, we would filter policies by user ID
    // For now, we'll return example policies
    res.json([
      {
        id: "pol-1",
        name: "KYC Onboarding Policy",
        type: "Customer Due Diligence",
        jurisdiction: "Switzerland",
        lastUpdated: "2025-03-15",
        status: "active",
        version: "1.2"
      },
      {
        id: "pol-2",
        name: "Transaction Monitoring Procedure",
        type: "AML",
        jurisdiction: "Global",
        lastUpdated: "2025-02-28",
        status: "review_needed",
        version: "2.0"
      },
      {
        id: "pol-3",
        name: "Travel Rule Implementation",
        type: "FATF Compliance",
        jurisdiction: "Global",
        lastUpdated: "2025-01-10",
        status: "draft",
        version: "0.8"
      }
    ]);
  });

  app.get("/api/jurisdictions/obligations", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json([
      {
        id: "obl-1",
        title: "Customer Identification Program",
        description: "Requires verification of the identity of individuals and entities before establishing business relationships",
        category: "KYC",
        source: "FINMA AML Ordinance Art. 3-5",
        jurisdiction: "Switzerland",
        coverage: 100
      },
      {
        id: "obl-2",
        title: "Transaction Monitoring",
        description: "Systems and controls to monitor customer transactions and identify suspicious activities",
        category: "AML",
        source: "AMLA Art. 6(1)",
        jurisdiction: "Switzerland",
        coverage: 75
      },
      {
        id: "obl-3",
        title: "Suspicious Activity Reporting",
        description: "Report suspicious transactions to the Money Laundering Reporting Office Switzerland (MROS)",
        category: "Reporting",
        source: "AMLA Art. 9",
        jurisdiction: "Switzerland",
        coverage: 50
      }
    ]);
  });

  // KYC Engine API endpoints
  app.get("/api/kyc/verifications", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json([
      {
        id: "VRF-001289",
        customerName: "John Smith",
        type: "Individual",
        dateSubmitted: "2025-03-28",
        status: "pending",
        riskLevel: "low",
        country: "United Kingdom"
      },
      {
        id: "VRF-001288",
        customerName: "Acme Corporation",
        type: "Corporate",
        dateSubmitted: "2025-03-28",
        status: "additional_info",
        riskLevel: "medium",
        country: "Singapore"
      },
      {
        id: "VRF-001287",
        customerName: "Elena Rodriguez",
        type: "Individual",
        dateSubmitted: "2025-03-27",
        status: "approved",
        riskLevel: "low",
        country: "Spain"
      },
      {
        id: "VRF-001286",
        customerName: "Blockchain Ventures Ltd",
        type: "Corporate",
        dateSubmitted: "2025-03-27",
        status: "pending",
        riskLevel: "high",
        country: "Cayman Islands"
      },
      {
        id: "VRF-001285",
        customerName: "Wei Zhang",
        type: "Individual",
        dateSubmitted: "2025-03-26",
        status: "rejected",
        riskLevel: "high",
        country: "China"
      }
    ]);
  });

  app.get("/api/kyc/providers", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json([
      { id: "jumio", name: "Jumio", status: "active", docTypes: 12, countries: 195 },
      { id: "sumsub", name: "SumSub", status: "active", docTypes: 10, countries: 220 },
      { id: "veriff", name: "Veriff", status: "inactive", docTypes: 8, countries: 190 },
      { id: "worldcheck", name: "World-Check", status: "active", docTypes: 6, countries: 210 }
    ]);
  });

  // Jurisdictions API endpoints
  app.get("/api/jurisdictions", async (_req, res) => {
    try {
      const jurisdictions = await storage.getAllJurisdictions();
      console.log(`Retrieved ${jurisdictions.length} jurisdictions`);
      res.json(jurisdictions);
    } catch (error) {
      console.error("Error fetching jurisdictions:", error);
      res.status(500).json({
        message: "Failed to fetch jurisdictions",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/jurisdictions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      console.log('API request for jurisdiction with ID:', req.params.id);
      const id = parseInt(req.params.id);
      const jurisdiction = await storage.getJurisdiction(id);
      
      if (!jurisdiction) {
        return res.status(404).json({ message: "Jurisdiction not found" });
      }
      
      // Fetch all related data for this jurisdiction
      const [
        regulatoryBodies,
        regulations,
        complianceRequirements,
        taxationRule,
        reportingObligations,
        regulatoryUpdates,
        tags,
        keywords
      ] = await Promise.all([
        storage.getRegulatoryBodiesByJurisdictionId(id),
        storage.getRegulationsByJurisdictionId(id),
        storage.getComplianceRequirementsByJurisdictionId(id),
        storage.getTaxationRuleByJurisdictionId(id),
        storage.getReportingObligationsByJurisdictionId(id),
        storage.getRegulatoryUpdatesByJurisdictionId(id),
        storage.getJurisdictionTagsByJurisdictionId(id),
        storage.getJurisdictionQueryKeywordsByJurisdictionId(id)
      ]);
      
      // Return complete jurisdiction data
      res.json({
        jurisdiction,
        regulatoryBodies,
        regulations,
        complianceRequirements,
        taxationRule,
        reportingObligations,
        regulatoryUpdates,
        tags: tags.map(t => t.tag),
        keywords: keywords.map(k => k.keyword)
      });
    } catch (error) {
      console.error(`Error fetching jurisdiction with ID ${req.params.id}:`, error);
      res.status(500).json({
        message: "Failed to fetch jurisdiction details",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/jurisdictions", checkAdminAuth, async (req, res) => {
    try {
      const jurisdiction = await storage.createJurisdiction(req.body);
      console.log(`Created new jurisdiction: ${jurisdiction.name}`);
      res.status(201).json(jurisdiction);
    } catch (error) {
      console.error("Error creating jurisdiction:", error);
      res.status(500).json({
        message: "Failed to create jurisdiction",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/jurisdictions/:id", checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const jurisdiction = await storage.updateJurisdiction(id, req.body);
      console.log(`Updated jurisdiction: ${jurisdiction.name}`);
      res.json(jurisdiction);
    } catch (error) {
      console.error(`Error updating jurisdiction with ID ${req.params.id}:`, error);
      res.status(500).json({
        message: "Failed to update jurisdiction",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Jurisdiction components endpoints
  
  // Regulatory bodies
  app.post("/api/regulatory-bodies", checkAdminAuth, async (req, res) => {
    try {
      const body = await storage.createRegulatoryBody(req.body);
      console.log(`Created new regulatory body: ${body.name}`);
      res.status(201).json(body);
    } catch (error) {
      console.error("Error creating regulatory body:", error);
      res.status(500).json({
        message: "Failed to create regulatory body",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Regulations
  app.post("/api/regulations", checkAdminAuth, async (req, res) => {
    try {
      const regulation = await storage.createRegulation(req.body);
      console.log(`Created new regulation: ${regulation.title}`);
      res.status(201).json(regulation);
    } catch (error) {
      console.error("Error creating regulation:", error);
      res.status(500).json({
        message: "Failed to create regulation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Compliance requirements
  app.post("/api/compliance-requirements", checkAdminAuth, async (req, res) => {
    try {
      const requirement = await storage.createComplianceRequirement(req.body);
      console.log(`Created new compliance requirement: ${requirement.requirement_type}`);
      res.status(201).json(requirement);
    } catch (error) {
      console.error("Error creating compliance requirement:", error);
      res.status(500).json({
        message: "Failed to create compliance requirement",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Taxation rules
  app.post("/api/taxation-rules", checkAdminAuth, async (req, res) => {
    try {
      const rule = await storage.createTaxationRule(req.body);
      console.log(`Created new taxation rule for jurisdiction ID ${rule.jurisdiction_id}`);
      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating taxation rule:", error);
      res.status(500).json({
        message: "Failed to create taxation rule",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reporting obligations
  app.post("/api/reporting-obligations", checkAdminAuth, async (req, res) => {
    try {
      const obligation = await storage.createReportingObligation(req.body);
      console.log(`Created new reporting obligation: ${obligation.type}`);
      res.status(201).json(obligation);
    } catch (error) {
      console.error("Error creating reporting obligation:", error);
      res.status(500).json({
        message: "Failed to create reporting obligation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Regulatory updates
  app.post("/api/regulatory-updates", checkAdminAuth, async (req, res) => {
    try {
      const update = await storage.createRegulatoryUpdate(req.body);
      console.log(`Created new regulatory update: ${update.update_title}`);
      res.status(201).json(update);
    } catch (error) {
      console.error("Error creating regulatory update:", error);
      res.status(500).json({
        message: "Failed to create regulatory update",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Jurisdiction tags
  app.post("/api/jurisdiction-tags", checkAdminAuth, async (req, res) => {
    try {
      const tag = await storage.createJurisdictionTag(req.body);
      console.log(`Created new jurisdiction tag: ${tag.tag}`);
      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating jurisdiction tag:", error);
      res.status(500).json({
        message: "Failed to create jurisdiction tag",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Jurisdiction query keywords
  app.post("/api/jurisdiction-keywords", checkAdminAuth, async (req, res) => {
    try {
      const keyword = await storage.createJurisdictionQueryKeyword(req.body);
      console.log(`Created new jurisdiction keyword: ${keyword.keyword}`);
      res.status(201).json(keyword);
    } catch (error) {
      console.error("Error creating jurisdiction keyword:", error);
      res.status(500).json({
        message: "Failed to create jurisdiction keyword",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Bulk import jurisdiction data (for Switzerland example and other countries)
  // Note: We're temporarily removing admin auth check for initial data seeding
  app.post("/api/jurisdictions/import", async (req, res) => {
    try {
      const { 
        name, region, risk_level, favorability_score, notes,
        regulatory_bodies, regulations, compliance_requirements,
        taxation_rule, reporting_obligations, regulatory_updates,
        tags, keywords
      } = req.body;
      
      // Create the jurisdiction first
      const jurisdiction = await storage.createJurisdiction({
        name, region, risk_level, favorability_score, notes
      });
      
      // Create all related records with the jurisdiction_id
      const promises = [];
      
      // Add regulatory bodies
      if (regulatory_bodies && regulatory_bodies.length) {
        regulatory_bodies.forEach((body: any) => {
          promises.push(storage.createRegulatoryBody({
            ...body,
            jurisdiction_id: jurisdiction.id
          }));
        });
      }
      
      // Add regulations
      if (regulations && regulations.length) {
        regulations.forEach((regulation: any) => {
          promises.push(storage.createRegulation({
            ...regulation,
            jurisdiction_id: jurisdiction.id
          }));
        });
      }
      
      // Add compliance requirements
      if (compliance_requirements && compliance_requirements.length) {
        compliance_requirements.forEach((requirement: any) => {
          promises.push(storage.createComplianceRequirement({
            ...requirement,
            jurisdiction_id: jurisdiction.id
          }));
        });
      }
      
      // Add taxation rule
      if (taxation_rule) {
        promises.push(storage.createTaxationRule({
          ...taxation_rule,
          jurisdiction_id: jurisdiction.id
        }));
      }
      
      // Add reporting obligations
      if (reporting_obligations && reporting_obligations.length) {
        reporting_obligations.forEach((obligation: any) => {
          promises.push(storage.createReportingObligation({
            ...obligation,
            jurisdiction_id: jurisdiction.id
          }));
        });
      }
      
      // Add regulatory updates
      if (regulatory_updates && regulatory_updates.length) {
        regulatory_updates.forEach((update: any) => {
          promises.push(storage.createRegulatoryUpdate({
            ...update,
            jurisdiction_id: jurisdiction.id
          }));
        });
      }
      
      // Add tags
      if (tags && tags.length) {
        tags.forEach((tag: string) => {
          promises.push(storage.createJurisdictionTag({
            jurisdiction_id: jurisdiction.id,
            tag
          }));
        });
      }
      
      // Add keywords
      if (keywords && keywords.length) {
        keywords.forEach((keyword: string) => {
          promises.push(storage.createJurisdictionQueryKeyword({
            jurisdiction_id: jurisdiction.id,
            keyword
          }));
        });
      }
      
      // Wait for all related records to be created
      await Promise.all(promises);
      
      console.log(`Imported complete jurisdiction data for ${name}`);
      res.status(201).json({
        message: "Jurisdiction data imported successfully",
        jurisdiction_id: jurisdiction.id
      });
    } catch (error) {
      console.error("Error importing jurisdiction data:", error);
      res.status(500).json({
        message: "Failed to import jurisdiction data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Error handling middleware
  app.use((err: Error, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // Token Registration Module Routes
  
  // Get all token registrations (admin only)
  app.get("/api/tokens/admin", checkAdminAuth, async (req, res) => {
    try {
      console.log('Fetching all token registrations...');
      const tokens = await storage.getAllTokenRegistrations();
      console.log(`Successfully retrieved ${tokens.length} token registrations`);
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching token registrations:", error);
      res.status(500).json({
        message: "Failed to fetch token registrations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get all token registrations by category (admin only)
  app.get("/api/tokens/admin/category/:category", checkAdminAuth, async (req, res) => {
    try {
      const { category } = req.params;
      console.log(`Fetching token registrations for category: ${category}...`);
      const tokens = await storage.getTokenRegistrationsByCategory(category);
      console.log(`Successfully retrieved ${tokens.length} token registrations for category ${category}`);
      res.json(tokens);
    } catch (error) {
      console.error(`Error fetching token registrations for category:`, error);
      res.status(500).json({
        message: "Failed to fetch token registrations by category",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get user's token registrations
  app.get("/api/tokens", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/tokens');
      return res.sendStatus(401);
    }
    
    try {
      console.log(`Fetching token registrations for user ${req.user.id}...`);
      const tokens = await storage.getTokenRegistrationsByUserId(req.user.id);
      console.log(`Successfully retrieved ${tokens.length} token registrations for user ${req.user.id}`);
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching user token registrations:", error);
      res.status(500).json({
        message: "Failed to fetch token registrations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get a specific token registration
  app.get("/api/tokens/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/tokens/:id');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Fetching token registration ${tokenId}...`);
      const token = await storage.getTokenRegistration(tokenId);
      
      if (!token) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only view their own token registrations
      if (!req.user.isAdmin && token.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to access token registration ${tokenId} belonging to user ${token.userId}`);
        return res.sendStatus(403);
      }
      
      console.log(`Successfully retrieved token registration ${tokenId}`);
      res.json(token);
    } catch (error) {
      console.error("Error fetching token registration:", error);
      res.status(500).json({
        message: "Failed to fetch token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Register a new token
  app.post("/api/tokens", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/tokens');
      return res.sendStatus(401);
    }
    
    try {
      console.log('Validating token registration data...');
      const tokenData = tokenRegistrationSchema.parse(req.body);
      
      console.log(`Creating new token registration for user ${req.user.id}...`);
      const registration = await storage.createTokenRegistration(req.user.id, tokenData);
      
      // Create blockchain attestation if user has a wallet
      if (req.user.walletAddress) {
        console.log(`Creating attestation for token registration ${registration.id}...`);
        const attestation = await createRegistrationAttestation(
          'token',
          registration.id.toString(),
          req.user.walletAddress
        );
        
        if (!attestation.success) {
          console.warn('Attestation creation failed:', attestation.error);
        } else {
          console.log(`Attestation created successfully for token registration ${registration.id}`);
        }
      }
      
      console.log(`Token registration ${registration.id} created successfully`);
      res.status(201).json(registration);
    } catch (error) {
      console.error('Error registering token:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });
  
  // Update a token registration
  app.patch("/api/tokens/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to PATCH /api/tokens/:id');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Updating token registration ${tokenId}...`);
      
      // Verify token exists and belongs to user
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only update their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to update token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Partial update validation
      const updateData = req.body;
      
      // Update token registration
      const updatedToken = await storage.updateTokenRegistration(tokenId, updateData);
      
      console.log(`Token registration ${tokenId} updated successfully`);
      res.json(updatedToken);
    } catch (error) {
      console.error('Error updating token registration:', error);
      res.status(500).json({ 
        message: "Failed to update token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Add document to token registration
  app.post("/api/tokens/:id/documents", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to POST /api/tokens/:id/documents');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Adding document to token registration ${tokenId}...`);
      
      // Verify token exists and belongs to user
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only add documents to their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to add document to token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Validate document data
      const documentData = tokenRegistrationDocumentSchema.parse(req.body);
      
      // Create document
      const document = await storage.createTokenRegistrationDocument({
        ...documentData,
        tokenRegistrationId: tokenId
      });
      
      console.log(`Document added to token registration ${tokenId}`);
      res.status(201).json(document);
    } catch (error) {
      console.error('Error adding document to token registration:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ 
          message: "Failed to add document to token registration",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });
  
  // Get documents for a token registration
  app.get("/api/tokens/:id/documents", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/tokens/:id/documents');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Fetching documents for token registration ${tokenId}...`);
      
      // Verify token exists and belongs to user
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only view documents for their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view documents for token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Get documents
      const documents = await storage.getTokenRegistrationDocuments(tokenId);
      
      console.log(`Successfully retrieved ${documents.length} documents for token registration ${tokenId}`);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents for token registration:', error);
      res.status(500).json({ 
        message: "Failed to fetch documents for token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Admin-only: Add verification to token registration
  app.post("/api/tokens/:id/verifications", checkAdminAuth, async (req, res) => {
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Adding verification to token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Create verification with admin as verifier
      const verification = await storage.createTokenRegistrationVerification({
        tokenRegistrationId: tokenId,
        verifierUserId: req.user.id,
        verificationType: req.body.verificationType,
        verificationStatus: req.body.verificationStatus,
        verificationDetails: req.body.verificationDetails,
        expiryDate: req.body.expiryDate
      });
      
      console.log(`Verification added to token registration ${tokenId}`);
      res.status(201).json(verification);
    } catch (error) {
      console.error('Error adding verification to token registration:', error);
      res.status(500).json({ 
        message: "Failed to add verification to token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get verifications for a token registration
  app.get("/api/tokens/:id/verifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/tokens/:id/verifications');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Fetching verifications for token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only view verifications for their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view verifications for token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Get verifications
      const verifications = await storage.getTokenRegistrationVerifications(tokenId);
      
      console.log(`Successfully retrieved ${verifications.length} verifications for token registration ${tokenId}`);
      res.json(verifications);
    } catch (error) {
      console.error('Error fetching verifications for token registration:', error);
      res.status(500).json({ 
        message: "Failed to fetch verifications for token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Admin-only: Add risk assessment to token registration
  app.post("/api/tokens/:id/risk-assessments", checkAdminAuth, async (req, res) => {
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Adding risk assessment to token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Create risk assessment with admin as assessor
      const assessment = await storage.createTokenRiskAssessment({
        tokenRegistrationId: tokenId,
        assessorUserId: req.user.id,
        riskCategory: req.body.riskCategory,
        riskLevel: req.body.riskLevel,
        riskDetails: req.body.riskDetails,
        mitigationMeasures: req.body.mitigationMeasures
      });
      
      console.log(`Risk assessment added to token registration ${tokenId}`);
      res.status(201).json(assessment);
    } catch (error) {
      console.error('Error adding risk assessment to token registration:', error);
      res.status(500).json({ 
        message: "Failed to add risk assessment to token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get risk assessments for a token registration
  app.get("/api/tokens/:id/risk-assessments", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/tokens/:id/risk-assessments');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Fetching risk assessments for token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only view risk assessments for their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view risk assessments for token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Get risk assessments
      const assessments = await storage.getTokenRiskAssessments(tokenId);
      
      console.log(`Successfully retrieved ${assessments.length} risk assessments for token registration ${tokenId}`);
      res.json(assessments);
    } catch (error) {
      console.error('Error fetching risk assessments for token registration:', error);
      res.status(500).json({ 
        message: "Failed to fetch risk assessments for token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Admin-only: Add jurisdiction approval to token registration
  app.post("/api/tokens/:id/jurisdiction-approvals", checkAdminAuth, async (req, res) => {
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Adding jurisdiction approval to token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Create jurisdiction approval
      const approval = await storage.createTokenJurisdictionApproval({
        tokenRegistrationId: tokenId,
        jurisdictionId: req.body.jurisdictionId,
        approvalStatus: req.body.approvalStatus,
        approvalDetails: req.body.approvalDetails,
        restrictionDetails: req.body.restrictionDetails,
        approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : new Date(),
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null
      });
      
      console.log(`Jurisdiction approval added to token registration ${tokenId}`);
      res.status(201).json(approval);
    } catch (error) {
      console.error('Error adding jurisdiction approval to token registration:', error);
      res.status(500).json({ 
        message: "Failed to add jurisdiction approval to token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get jurisdiction approvals for a token registration
  app.get("/api/tokens/:id/jurisdiction-approvals", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to GET /api/tokens/:id/jurisdiction-approvals');
      return res.sendStatus(401);
    }
    
    try {
      const tokenId = parseInt(req.params.id);
      console.log(`Fetching jurisdiction approvals for token registration ${tokenId}...`);
      
      // Verify token exists
      const existingToken = await storage.getTokenRegistration(tokenId);
      if (!existingToken) {
        console.log(`Token registration ${tokenId} not found`);
        return res.status(404).json({ message: "Token registration not found" });
      }
      
      // Non-admins can only view jurisdiction approvals for their own token registrations
      if (!req.user.isAdmin && existingToken.userId !== req.user.id) {
        console.log(`User ${req.user.id} attempted to view jurisdiction approvals for token registration ${tokenId} belonging to user ${existingToken.userId}`);
        return res.sendStatus(403);
      }
      
      // Get jurisdiction approvals
      const approvals = await storage.getTokenJurisdictionApprovals(tokenId);
      
      console.log(`Successfully retrieved ${approvals.length} jurisdiction approvals for token registration ${tokenId}`);
      res.json(approvals);
    } catch (error) {
      console.error('Error fetching jurisdiction approvals for token registration:', error);
      res.status(500).json({ 
        message: "Failed to fetch jurisdiction approvals for token registration",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}