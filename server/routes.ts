import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import {
  exchangeInfoSchema,
  stablecoinInfoSchema,
  defiProtocolInfoSchema,
  nftMarketplaceInfoSchema,
  cryptoFundInfoSchema
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
      // Since News API has limitations on the developer plan (particularly for localhost/development),
      // we'll create some realistic sample data for development purposes
      // This would be replaced with a real API call in production
      const articles = [
        {
          title: "SEC Issues New Guidelines for Crypto Exchanges",
          description: "The Securities and Exchange Commission has released updated compliance requirements that all cryptocurrency exchanges operating in the US must adhere to.",
          url: "https://www.sec.gov/news/press-release/2025-45",
          publishedAt: new Date().toISOString(),
          source: "SEC Press Release"
        },
        {
          title: "EU Parliament Approves Comprehensive Crypto Regulation Framework",
          description: "The European Parliament has voted to approve a new framework for regulating cryptocurrency assets and services across the European Union.",
          url: "https://ec.europa.eu/commission/presscorner/detail/en/ip_25_1234",
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          source: "European Commission"
        },
        {
          title: "Financial Action Task Force Updates Crypto Travel Rule Requirements",
          description: "The FATF has updated its recommendations on the implementation of the travel rule for virtual asset service providers.",
          url: "https://www.fatf-gafi.org/publications/fatfrecommendations/documents/travel-rule-guidelines-2025.html",
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          source: "FATF Guidelines"
        },
        {
          title: "Singapore MAS Strengthens Crypto Licensing Requirements",
          description: "The Monetary Authority of Singapore has announced stricter requirements for cryptocurrency firms seeking to operate in the country.",
          url: "https://www.mas.gov.sg/news/media-releases/2025/mas-strengthens-digital-payment-token-service-regulations",
          publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          source: "MAS Media Releases"
        },
        {
          title: "Japan FSA Unveils New Stablecoin Regulations",
          description: "Japan's Financial Services Agency has released a new regulatory framework specifically targeting stablecoin issuers and service providers.",
          url: "https://www.fsa.go.jp/en/news/2025/20250328.html",
          publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          source: "FSA Japan"
        }
      ];
      
      console.log('Serving compliance news data');
      res.json(articles);
      
      // Note: In production, this would be an actual API call
      // const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
      // const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";
      // const axios = require('axios');
      // const response = await axios.get(NEWS_API_ENDPOINT, ...);
      
    } catch (error: unknown) {
      console.error('Error processing compliance news:', error);
      res.status(500).json({ 
        message: 'Failed to fetch compliance news',
        error: error instanceof Error ? error.message : 'Unknown error'
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

  // Error handling middleware
  app.use((err: Error, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });


  const httpServer = createServer(app);
  return httpServer;
}