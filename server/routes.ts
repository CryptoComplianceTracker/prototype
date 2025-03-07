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

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Stablecoin registration route
  app.post("/api/stablecoin/register", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const data = stablecoinInfoSchema.parse(req.body);
      await storage.createStablecoinInfo(req.user.id, data);
      res.sendStatus(201);
    } catch (error) {
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
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const data = defiProtocolInfoSchema.parse(req.body);
      await storage.createDefiProtocolInfo(req.user.id, data);
      res.sendStatus(201);
    } catch (error) {
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
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const data = nftMarketplaceInfoSchema.parse(req.body);
      await storage.createNftMarketplaceInfo(req.user.id, data);
      res.sendStatus(201);
    } catch (error) {
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
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const data = cryptoFundInfoSchema.parse(req.body);
      await storage.createCryptoFundInfo(req.user.id, data);
      res.sendStatus(201);
    } catch (error) {
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

  // Admin routes
  app.get("/api/admin/exchanges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.user.isAdmin) return res.sendStatus(403);

    try {
      const exchanges = await storage.getAllExchangeInfo();
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
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactionsByUserId(req.user.id);
    res.json(transactions);
  });

  // Exchange registration route
  app.post("/api/exchange/register", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const data = exchangeInfoSchema.parse(req.body);
      await storage.createExchangeInfo(req.user.id, data);
      res.sendStatus(201);
    } catch (error) {
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
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const kycSchema = z.object({
      walletAddress: z.string(),
      complianceData: z.record(z.unknown())
    });

    const data = kycSchema.parse(req.body);

    await storage.updateUserKYC(req.user.id, {
      walletAddress: data.walletAddress,
      kycVerified: true,
      complianceData: data.complianceData
    });

    res.sendStatus(200);
  });

  // Risk assessment route
  app.get("/api/risk-assessment/:walletAddress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const riskScore = Math.floor(Math.random() * 100); // Mock risk score
    res.json({ riskScore });
  });

  const httpServer = createServer(app);
  return httpServer;
}