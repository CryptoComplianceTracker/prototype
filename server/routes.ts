import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import axios from "axios";
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
    try {
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


  const httpServer = createServer(app);
  return httpServer;
}