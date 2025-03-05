import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { exchangeInfoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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