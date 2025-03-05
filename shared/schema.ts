import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name").notNull(),
  walletAddress: text("wallet_address"),
  kycVerified: boolean("kyc_verified").default(false),
  riskScore: integer("risk_score").default(0),
  complianceData: jsonb("compliance_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exchangeInfo = pgTable("exchange_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),

  // General Exchange Information
  exchangeName: text("exchange_name").notNull(),
  legalEntityName: text("legal_entity_name").notNull(),
  registrationNumber: text("registration_number").notNull(),
  headquartersLocation: text("headquarters_location").notNull(),
  websiteUrl: text("website_url").notNull(),
  yearEstablished: text("year_established").notNull(),
  exchangeType: text("exchange_type").notNull(),
  regulatoryLicenses: text("regulatory_licenses"),

  // Compliance Contact
  complianceContactName: text("compliance_contact_name").notNull(),
  complianceContactEmail: text("compliance_contact_email").notNull(),
  complianceContactPhone: text("compliance_contact_phone").notNull(),

  // Trading & Market Data
  tradingPairs: jsonb("trading_pairs"), // Array of trading pairs and volumes
  leverageAndMargin: jsonb("leverage_and_margin"), // Leverage settings
  hftActivityMetrics: jsonb("hft_activity_metrics"), // HFT related data

  // Security & Risk
  washTradingDetection: jsonb("wash_trading_detection"), // Wash trading prevention details
  securityMeasures: jsonb("security_measures"), // Security protocols
  riskManagement: jsonb("risk_management"), // Risk management details

  // AML & KYC
  kycVerificationMetrics: jsonb("kyc_verification_metrics"), // KYC statistics
  sanctionsCompliance: jsonb("sanctions_compliance"), // Sanctions compliance details

  // Custody & Insurance
  custodyArrangements: jsonb("custody_arrangements"), // Custody details
  insuranceCoverage: jsonb("insurance_coverage"), // Insurance information

  // Blockchain Integration
  supportedBlockchains: jsonb("supported_blockchains"), // Supported networks
  blockchainAnalytics: jsonb("blockchain_analytics"), // Analytics tools used

  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  amount: text("amount").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  riskLevel: text("risk_level").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const exchangeInfoSchema = createInsertSchema(exchangeInfo)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    exchangeType: z.enum(["CEX", "DEX"], {
      required_error: "Please select an exchange type",
      invalid_type_error: "Exchange type must be either CEX or DEX",
    }),
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL starting with http:// or https://",
    }),
    complianceContactEmail: z.string().email({
      message: "Please enter a valid email address",
    }),
    complianceContactPhone: z.string().min(10, {
      message: "Phone number must be at least 10 digits long",
    }).regex(/^\+?[\d\s-()]+$/, {
      message: "Please enter a valid phone number",
    }),
    yearEstablished: z.string().regex(/^\d{4}$/, {
      message: "Please enter a valid 4-digit year",
    }).refine((year) => {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      return yearNum >= 1990 && yearNum <= currentYear;
    }, {
      message: "Year must be between 1990 and current year",
    }),
    exchangeName: z.string().min(2, {
      message: "Exchange name must be at least 2 characters long",
    }),
    legalEntityName: z.string().min(2, {
      message: "Legal entity name must be at least 2 characters long",
    }),
    registrationNumber: z.string().min(1, {
      message: "Registration number is required",
    }),
    headquartersLocation: z.string().min(2, {
      message: "Please enter a valid location (City, Country)",
    }),
    regulatoryLicenses: z.string().optional(),
    complianceContactName: z.string().min(2, {
      message: "Contact name must be at least 2 characters long",
    }),
    tradingPairs: z.array(z.object({
      pair: z.string(),
      volume: z.number(),
      volatility: z.number(),
    })).optional(),
    leverageAndMargin: z.object({
      maxLeverage: z.number(),
      marginAccountsPercentage: z.number(),
    }).optional(),
    hftActivityMetrics: z.object({
      hftBotsAllowed: z.boolean(),
      hftVolumePercentage: z.number(),
    }).optional(),
    washTradingDetection: z.object({
      automatedBotDetection: z.boolean(),
      timeStampGranularity: z.enum(["milliseconds", "seconds"]),
      spoofingDetection: z.boolean(),
    }).optional(),
    kycVerificationMetrics: z.object({
      verifiedUsers: z.number(),
      nonVerifiedUsers: z.number(),
      highRiskJurisdictionPercentage: z.number(),
    }).optional(),
    sanctionsCompliance: z.object({
      ofacCompliant: z.boolean(),
      fatfCompliant: z.boolean(),
      euCompliant: z.boolean(),
    }).optional(),
    custodyArrangements: z.object({
      coldStoragePercentage: z.number(),
      hotWalletPercentage: z.number(),
      userFundSegregation: z.boolean(),
    }).optional(),
    insuranceCoverage: z.object({
      hasInsurance: z.boolean(),
      coverageLimit: z.number().optional(),
      lastPenetrationTest: z.string().optional(),
    }).optional(),
    supportedBlockchains: z.array(z.enum([
      "Ethereum",
      "Bitcoin",
      "Binance Smart Chain",
      "Solana",
      "Polygon"
    ])).optional(),
    blockchainAnalytics: z.object({
      realTimeAnalytics: z.boolean(),
      proofOfReserves: z.boolean(),
      monitoringTools: z.array(z.string()),
    }).optional(),
  });

export const insertUserSchema = createInsertSchema(users)
  .extend({
    password: z.string().min(8),
    email: z.string().email(),
    companyName: z.string().min(2),
  })
  .omit({ id: true, createdAt: true, kycVerified: true, riskScore: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ExchangeInfo = typeof exchangeInfo.$inferSelect;
export type InsertExchangeInfo = z.infer<typeof exchangeInfoSchema>;