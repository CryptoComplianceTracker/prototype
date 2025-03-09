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
  app.get("/api/admin/exchanges", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/admin/exchanges');
      return res.sendStatus(401);
    }
    if (!req.user.isAdmin) {
      console.log(`Non-admin user ${req.user.id} attempted to access admin endpoint`);
      return res.sendStatus(403);
    }

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