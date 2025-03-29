import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  isAdmin: boolean("is_admin").default(false),
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

export const stablecoinInfo = pgTable("stablecoin_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),

  // General Information
  stablecoinName: text("stablecoin_name").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  issuerName: text("issuer_name").notNull(),
  registrationNumber: text("registration_number").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  websiteUrl: text("website_url").notNull(),
  complianceOfficerEmail: text("compliance_officer_email"),

  // Stablecoin Details
  backingAssetType: text("backing_asset_type").notNull(),
  backingAssetDetails: text("backing_asset_details"),
  peggedTo: text("pegged_to").notNull(),
  totalSupply: text("total_supply").notNull(),

  // Reserve & Compliance Information
  reserveRatio: text("reserve_ratio"),
  custodianName: text("custodian_name"),
  auditProvider: text("audit_provider"),
  attestationMethod: text("attestation_method"),
  redemptionPolicy: text("redemption_policy"),
  redemptionFrequency: text("redemption_frequency"),
  centralBankPartnership: boolean("central_bank_partnership").default(false),
  isRegulated: boolean("is_regulated").default(false),
  hasMarketMakers: boolean("has_market_makers").default(false),
  hasTravelRule: boolean("has_travel_rule").default(false),
  amlPolicyUrl: text("aml_policy_url"),

  // Reserve Information (JSON fields)
  reserveDetails: jsonb("reserve_details"),
  custodianDetails: jsonb("custodian_details"),
  auditInformation: jsonb("audit_information"),

  // Smart Contract Details
  chainIds: text("chain_ids").array(),
  contractAddresses: jsonb("contract_addresses"),
  blockchainPlatforms: jsonb("blockchain_platforms"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const defiProtocolInfo = pgTable("defi_protocol_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),

  // Protocol Information
  protocolName: text("protocol_name").notNull(),
  protocolType: text("protocol_type").notNull(),
  websiteUrl: text("website_url").notNull(),

  // Technical Details
  smartContractAddresses: jsonb("smart_contract_addresses"),
  supportedTokens: jsonb("supported_tokens"),
  blockchainNetworks: jsonb("blockchain_networks"),

  // Security Information
  securityAudits: jsonb("security_audits"),
  insuranceCoverage: jsonb("insurance_coverage"),
  riskManagement: jsonb("risk_management"),

  // Governance
  governanceStructure: jsonb("governance_structure"),
  tokenomics: jsonb("tokenomics"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const nftMarketplaceInfo = pgTable("nft_marketplace_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),

  // Marketplace Information
  marketplaceName: text("marketplace_name").notNull(),
  businessEntity: text("business_entity").notNull(),
  websiteUrl: text("website_url").notNull(),

  // Technical Infrastructure
  supportedStandards: jsonb("supported_standards"),
  blockchainNetworks: jsonb("blockchain_networks"),
  smartContracts: jsonb("smart_contracts"),

  // Operations
  royaltyEnforcement: jsonb("royalty_enforcement"),
  listingPolicies: jsonb("listing_policies"),
  moderationProcedures: jsonb("moderation_procedures"),

  // Security & Compliance
  copyrightPolicies: jsonb("copyright_policies"),
  amlPolicies: jsonb("aml_policies"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const cryptoFundInfo = pgTable("crypto_fund_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),

  // Fund Information
  fundName: text("fund_name").notNull(),
  fundType: text("fund_type").notNull(),
  registrationNumber: text("registration_number").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  websiteUrl: text("website_url").notNull(),

  // Investment Strategy
  investmentStrategy: jsonb("investment_strategy"),
  assetAllocation: jsonb("asset_allocation"),
  riskProfile: jsonb("risk_profile"),

  // Operations
  custodyArrangements: jsonb("custody_arrangements"),
  valuationMethods: jsonb("valuation_methods"),

  // Compliance
  regulatoryLicenses: jsonb("regulatory_licenses"),
  amlProcedures: jsonb("aml_procedures"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Unified registration table
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  registrationType: text("registration_type").notNull(),
  status: text("status").notNull().default('draft'),
  version: integer("version").notNull().default(1),
  name: text("name").notNull(),
  registrationNumber: text("registration_number"),
  jurisdiction: text("jurisdiction"),
  websiteUrl: text("website_url"),
  entityDetails: jsonb("entity_details").notNull(),
  complianceData: jsonb("compliance_data"),
  riskScore: integer("risk_score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Registration versions table
export const registrationVersions = pgTable("registration_versions", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").notNull().references(() => registrations.id),
  version: integer("version").notNull(),
  entityDetails: jsonb("entity_details").notNull(),
  complianceData: jsonb("compliance_data"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  recordId: integer("record_id").notNull(),
  action: text("action").notNull(),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
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
    password: z.string()
      .min(12, "Password must be at least 12 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    email: z.string().email("Please enter a valid email address"),
    companyName: z.string().min(2, "Company name must be at least 2 characters long"),
  })
  .omit({ id: true, createdAt: true, kycVerified: true, riskScore: true });

export const stablecoinInfoSchema = createInsertSchema(stablecoinInfo)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    backingAssetType: z.enum(["Fiat", "Crypto", "Commodity", "Mixed", "Algorithmic", "Sovereign", "Commercial"], {
      required_error: "Please select a backing asset type",
    }),
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL",
    }),
    totalSupply: z.string().min(1, {
      message: "Total supply is required",
    }),
    // Validation for new fields
    backingAssetDetails: z.string().optional(),
    redemptionPolicy: z.string().optional(),
    auditProvider: z.string().optional(),
    centralBankPartnership: z.boolean().default(false),
    isRegulated: z.boolean().default(false),
    custodianName: z.string().optional(),
    chainIds: z.array(z.string()).optional(),
    complianceOfficerEmail: z.string().email({ message: "Please enter a valid email" }).optional(),
    reserveRatio: z.string().regex(/^\d+$/, { message: "Reserve ratio must be a number" }).optional(),
    hasMarketMakers: z.boolean().default(false),
    amlPolicyUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
    redemptionFrequency: z.enum([
      "Real-time", "Daily", "Weekly", "Monthly", "Quarterly", "By Request", "None"
    ]).optional(),
    hasTravelRule: z.boolean().default(false),
    attestationMethod: z.enum([
      "Professional Audit", "Cryptographic Proof", "On-Chain Verification", 
      "Self Reported", "Regulatory Oversight", "None"
    ]).optional(),
  });

export const defiProtocolInfoSchema = createInsertSchema(defiProtocolInfo)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    protocolType: z.enum(["Lending", "DEX", "Yield", "Insurance", "Other"], {
      required_error: "Please select a protocol type",
    }),
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL",
    }),
  });

export const nftMarketplaceInfoSchema = createInsertSchema(nftMarketplaceInfo)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL",
    }),
  });

export const cryptoFundInfoSchema = createInsertSchema(cryptoFundInfo)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    fundType: z.enum(["Hedge Fund", "Venture Capital", "Private Equity", "ETF", "Other"], {
      required_error: "Please select a fund type",
    }),
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL",
    }),
  });

export const registrationSchema = createInsertSchema(registrations)
  .omit({ 
    id: true, 
    userId: true, 
    version: true, 
    createdAt: true, 
    updatedAt: true, 
    deletedAt: true 
  })
  .extend({
    registrationType: z.enum(['exchange', 'stablecoin', 'defi', 'nft', 'fund'], {
      required_error: "Registration type is required",
    }),
    status: z.enum(['draft', 'pending', 'approved', 'rejected', 'suspended'], {
      required_error: "Status is required",
    }),
    websiteUrl: z.string().url({
      message: "Please enter a valid website URL",
    }).optional(),
    entityDetails: z.record(z.unknown()),
    complianceData: z.record(z.unknown()).optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ExchangeInfo = typeof exchangeInfo.$inferSelect;
export type InsertExchangeInfo = z.infer<typeof exchangeInfoSchema>;
export type StablecoinInfo = typeof stablecoinInfo.$inferSelect;
export type DefiProtocolInfo = typeof defiProtocolInfo.$inferSelect;
export type NftMarketplaceInfo = typeof nftMarketplaceInfo.$inferSelect;
export type CryptoFundInfo = typeof cryptoFundInfo.$inferSelect;

export type InsertStablecoinInfo = z.infer<typeof stablecoinInfoSchema>;
export type InsertDefiProtocolInfo = z.infer<typeof defiProtocolInfoSchema>;
export type InsertNftMarketplaceInfo = z.infer<typeof nftMarketplaceInfoSchema>;
export type InsertCryptoFundInfo = z.infer<typeof cryptoFundInfoSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof registrationSchema>;
export type RegistrationVersion = typeof registrationVersions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export interface RiskScore {
  category: string;
  score: number;
  maxScore: number;
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  recommendation?: string;
}

export interface RiskAssessment {
  overallScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  categories: RiskScore[];
  timestamp: string;
}

// Global compliance database schema

export const jurisdictions = pgTable("jurisdictions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  iso_code: text("iso_code"),
  currency_code: text("currency_code"),
  is_fatf_member: boolean("is_fatf_member").default(false),
  risk_level: text("risk_level").notNull(),
  favorability_score: integer("favorability_score"),
  legal_system_type: text("legal_system_type"),
  national_language: text("national_language"),
  central_bank_url: text("central_bank_url"),
  financial_licensing_portal: text("financial_licensing_portal"),
  contact_email: text("contact_email"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  last_updated: timestamp("last_updated").defaultNow()
});

export const regulatory_bodies = pgTable("regulatory_bodies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  website_url: text("website_url"),
  description: text("description"),
  contact_email: text("contact_email"),
  phone_number: text("phone_number"),
  crypto_scope: text("crypto_scope"),
  authority_level: text("authority_level"),
  reporting_api_available: boolean("reporting_api_available").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const regulations = pgTable("regulations", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  compliance_url: text("compliance_url"),
  effective_date: timestamp("effective_date"),
  last_updated: timestamp("last_updated"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const compliance_requirements = pgTable("compliance_requirements", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  requirement_type: text("requirement_type").notNull(),
  summary: text("summary").notNull(),
  details: text("details"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const taxation_rules = pgTable("taxation_rules", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  income_tax_applicable: boolean("income_tax_applicable"),
  capital_gains_tax: boolean("capital_gains_tax"),
  vat_applicable: boolean("vat_applicable"),
  tax_description: text("tax_description"),
  tax_authority_url: text("tax_authority_url"),
  last_updated: timestamp("last_updated"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const reporting_obligations = pgTable("reporting_obligations", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  type: text("type").notNull(),
  frequency: text("frequency"),
  submission_url: text("submission_url"),
  penalties: text("penalties"),
  last_reviewed: timestamp("last_reviewed"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// New table for compliance report types
export const compliance_report_types = pgTable("compliance_report_types", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // Category from master list (Risk & Licensing, Tokens & Protocols, etc.)
  name: text("name").notNull(), // Report name (e.g., "Annual Risk Assessment")
  description: text("description").notNull(),
  frequency: text("frequency").notNull(), // Annual, Quarterly, Monthly, Weekly, Real-time, As required, etc.
  applies_to: text("applies_to").notNull(), // What type of entities this applies to
  template_available: boolean("template_available").default(false),
  documentation_url: text("documentation_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// User-specific compliance reports
export const compliance_reports = pgTable("compliance_reports", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  report_type_id: integer("report_type_id").references(() => compliance_report_types.id),
  entity_id: integer("entity_id"), // Can reference various entity tables (exchanges, funds, etc.)
  entity_type: text("entity_type").notNull(), // exchange, stablecoin, fund, etc.
  status: text("status").notNull().default('draft'), // draft, in_progress, submitted, approved, rejected
  due_date: timestamp("due_date"),
  submission_date: timestamp("submission_date"),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id),
  report_data: jsonb("report_data"),
  version: integer("version").default(1),
  attachments: jsonb("attachments"),
  reviewer_id: integer("reviewer_id").references(() => users.id),
  reviewer_notes: text("reviewer_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Report schedules 
export const report_schedules = pgTable("report_schedules", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  report_type_id: integer("report_type_id").references(() => compliance_report_types.id),
  entity_id: integer("entity_id"),
  entity_type: text("entity_type").notNull(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id),
  frequency: text("frequency").notNull(), // daily, weekly, monthly, quarterly, annually
  next_due_date: timestamp("next_due_date").notNull(),
  last_generated: timestamp("last_generated"),
  reminders_enabled: boolean("reminders_enabled").default(true),
  reminder_days_before: integer("reminder_days_before").default(7),
  auto_generate: boolean("auto_generate").default(false),
  status: text("status").default('active'), // active, paused, completed
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const regulatory_updates = pgTable("regulatory_updates", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  update_title: text("update_title").notNull(),
  update_date: timestamp("update_date"),
  summary: text("summary"),
  source: text("source"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const jurisdiction_tags = pgTable("jurisdiction_tags", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  tag: text("tag").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

export const jurisdiction_query_keywords = pgTable("jurisdiction_query_keywords", {
  id: serial("id").primaryKey(),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  keyword: text("keyword").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

// New tables for enhanced jurisdictional schema
export const laws = pgTable("laws", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abbreviation: text("abbreviation"),
  law_type: text("law_type"),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  regulatory_body_id: integer("regulatory_body_id").references(() => regulatory_bodies.id),
  effective_date: timestamp("effective_date"),
  last_updated: timestamp("last_updated"),
  legal_category: text("legal_category"),
  description: text("description"),
  applicability: text("applicability"),
  full_text_link: text("full_text_link"),
  source_url: text("source_url"),
  source_language: text("source_language"),
  created_at: timestamp("created_at").defaultNow()
});

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  incorporation_country: text("incorporation_country"),
  main_exchange_token: text("main_exchange_token"),
  regulatory_classification: text("regulatory_classification"),
  onboarding_date: timestamp("onboarding_date"),
  website_url: text("website_url"),
  contact_email: text("contact_email"),
  created_at: timestamp("created_at").defaultNow()
});

export const obligations = pgTable("obligations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  law_id: integer("law_id").references(() => laws.id),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id, { onDelete: 'cascade' }),
  obligation_type: text("obligation_type"),
  frequency: text("frequency"),
  due_by_day: integer("due_by_day"),
  due_months: text("due_months"),
  format: text("format"),
  delivery_method: text("delivery_method"),
  submission_url: text("submission_url"),
  escalation_policy: text("escalation_policy"),
  penalty_type: text("penalty_type"),
  penalty_amount: text("penalty_amount"),
  threshold_condition: text("threshold_condition"),
  dependent_on: integer("dependent_on").references((): any => obligations.id),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow()
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  obligation_id: integer("obligation_id").references(() => obligations.id),
  organization_id: integer("organization_id").references(() => organizations.id),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id),
  submitted_by: integer("submitted_by").references(() => users.id),
  status: text("status"),
  file_link: text("file_link"),
  submission_hash: text("submission_hash"),
  submission_signature: text("submission_signature"),
  blockchain_anchor_tx: text("blockchain_anchor_tx"),
  submitted_to: text("submitted_to"),
  submission_date: timestamp("submission_date"),
  verified_by: integer("verified_by").references(() => users.id),
  verification_notes: text("verification_notes"),
  response_code: text("response_code"),
  response_message: text("response_message"),
  created_at: timestamp("created_at").defaultNow()
});

export const obligation_assignments = pgTable("obligation_assignments", {
  id: serial("id").primaryKey(),
  obligation_id: integer("obligation_id").references(() => obligations.id),
  user_id: integer("user_id").references(() => users.id),
  team_role: text("team_role"),
  status: text("status"),
  due_date: timestamp("due_date"),
  actual_completion_date: timestamp("actual_completion_date"),
  is_blocking: boolean("is_blocking").default(false),
  sla_hours: integer("sla_hours"),
  priority_level: text("priority_level"),
  completion_notes: text("completion_notes"),
  created_at: timestamp("created_at").defaultNow()
});

export const regulatory_keywords_index = pgTable("regulatory_keywords_index", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  law_id: integer("law_id").references(() => laws.id),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id),
  match_score: text("match_score"),
  created_at: timestamp("created_at").defaultNow()
});

// Schemas for data insertion
export const jurisdictionSchema = createInsertSchema(jurisdictions);
export const regulatoryBodySchema = createInsertSchema(regulatory_bodies);
export const regulationSchema = createInsertSchema(regulations);
export const complianceRequirementSchema = createInsertSchema(compliance_requirements);
export const taxationRuleSchema = createInsertSchema(taxation_rules);
export const reportingObligationSchema = createInsertSchema(reporting_obligations);
export const regulatoryUpdateSchema = createInsertSchema(regulatory_updates);
export const jurisdictionTagSchema = createInsertSchema(jurisdiction_tags);
export const jurisdictionQueryKeywordSchema = createInsertSchema(jurisdiction_query_keywords);

// Schemas for new compliance reporting tables
export const complianceReportTypeSchema = createInsertSchema(compliance_report_types)
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    category: z.enum([
      'Risk & Licensing',
      'Tokens & Protocols',
      'Stablecoins & Custodial Assets',
      'Activity, Behavior & Monitoring',
      'Governance & Market Integrity',
      'ESG, Transparency, & Controls',
      'Meta-Compliance & Regulator Interface'
    ], {
      required_error: "Category is required"
    }),
    frequency: z.enum([
      'Annual',
      'Quarterly',
      'Monthly',
      'Weekly',
      'Daily',
      'Real-time',
      'As required',
      'Per major update',
      'Per issuance/update',
      'Per campaign',
      'Per incident',
      'Per fork/upgrade',
      'Bi-monthly',
      'Continuous'
    ], {
      required_error: "Frequency is required"
    })
  });

export const complianceReportSchema = createInsertSchema(compliance_reports)
  .omit({ id: true, created_at: true, updated_at: true, user_id: true, reviewer_id: true, version: true })
  .extend({
    entity_type: z.enum(['exchange', 'stablecoin', 'defi', 'nft', 'fund', 'general'], {
      required_error: "Entity type is required"
    }),
    status: z.enum(['draft', 'in_progress', 'submitted', 'approved', 'rejected', 'needs_review'], {
      required_error: "Status is required"
    }),
    report_data: z.record(z.unknown()),
    attachments: z.array(z.object({
      name: z.string(),
      url: z.string(),
      type: z.string(),
      size: z.number(),
      uploaded_at: z.date()
    })).optional()
  });

export const reportScheduleSchema = createInsertSchema(report_schedules)
  .omit({ id: true, created_at: true, updated_at: true, user_id: true, last_generated: true })
  .extend({
    entity_type: z.enum(['exchange', 'stablecoin', 'defi', 'nft', 'fund', 'general'], {
      required_error: "Entity type is required"
    }),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'], {
      required_error: "Frequency is required"
    }),
    status: z.enum(['active', 'paused', 'completed'], {
      required_error: "Status is required"
    })
  });

// Schemas for new tables
export const lawSchema = createInsertSchema(laws);
export const organizationSchema = createInsertSchema(organizations);
export const obligationSchema = createInsertSchema(obligations);
export const reportSchema = createInsertSchema(reports);
export const obligationAssignmentSchema = createInsertSchema(obligation_assignments);
export const regulatoryKeywordIndexSchema = createInsertSchema(regulatory_keywords_index);

// Types for the tables
export type Jurisdiction = {
  id: number;
  name: string;
  region: string;
  risk_level: string;
  favorability_score: number | null;
  notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  iso_code?: string | null;
  currency_code?: string | null;
  is_fatf_member?: boolean | null;
  legal_system_type?: string | null;
  national_language?: string | null;
  central_bank_url?: string | null;
  financial_licensing_portal?: string | null;
  contact_email?: string | null;
  last_updated?: Date | null;
};

export type RegulatoryBody = typeof regulatory_bodies.$inferSelect;
export type Regulation = typeof regulations.$inferSelect;
export type ComplianceRequirement = typeof compliance_requirements.$inferSelect;
export type TaxationRule = typeof taxation_rules.$inferSelect;
export type ReportingObligation = typeof reporting_obligations.$inferSelect;
export type RegulatoryUpdate = typeof regulatory_updates.$inferSelect;
export type JurisdictionTag = typeof jurisdiction_tags.$inferSelect;
export type JurisdictionQueryKeyword = typeof jurisdiction_query_keywords.$inferSelect;
export type Law = typeof laws.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Obligation = typeof obligations.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type ObligationAssignment = typeof obligation_assignments.$inferSelect;
export type RegulatoryKeywordIndex = typeof regulatory_keywords_index.$inferSelect;

// Types for compliance reporting tables
export type ComplianceReportType = typeof compliance_report_types.$inferSelect;
export type ComplianceReport = typeof compliance_reports.$inferSelect;
export type ReportSchedule = typeof report_schedules.$inferSelect;

// Insert types
export type InsertJurisdiction = z.infer<typeof jurisdictionSchema>;
export type InsertRegulatoryBody = z.infer<typeof regulatoryBodySchema>;
export type InsertRegulation = z.infer<typeof regulationSchema>;
export type InsertComplianceRequirement = z.infer<typeof complianceRequirementSchema>;
export type InsertTaxationRule = z.infer<typeof taxationRuleSchema>;
export type InsertReportingObligation = z.infer<typeof reportingObligationSchema>;
export type InsertRegulatoryUpdate = z.infer<typeof regulatoryUpdateSchema>;
export type InsertJurisdictionTag = z.infer<typeof jurisdictionTagSchema>;
export type InsertJurisdictionQueryKeyword = z.infer<typeof jurisdictionQueryKeywordSchema>;
export type InsertLaw = z.infer<typeof lawSchema>;
export type InsertOrganization = z.infer<typeof organizationSchema>;
export type InsertObligation = z.infer<typeof obligationSchema>;
export type InsertReport = z.infer<typeof reportSchema>;
export type InsertObligationAssignment = z.infer<typeof obligationAssignmentSchema>;
export type InsertRegulatoryKeywordIndex = z.infer<typeof regulatoryKeywordIndexSchema>;

// Insert types for compliance reporting
export type InsertComplianceReportType = z.infer<typeof complianceReportTypeSchema>;
export type InsertComplianceReport = z.infer<typeof complianceReportSchema>;  
export type InsertReportSchedule = z.infer<typeof reportScheduleSchema>;

// Policy Framework Tables
export const policy_templates = pgTable("policy_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  content: jsonb("content").notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(), // draft, active, archived, review_needed
  content: jsonb("content").notNull(),
  metadata: jsonb("metadata"),
  jurisdiction_id: integer("jurisdiction_id").references(() => jurisdictions.id),
  created_by: integer("created_by").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const policy_versions = pgTable("policy_versions", {
  id: serial("id").primaryKey(),
  policy_id: integer("policy_id").notNull().references(() => policies.id, { onDelete: 'cascade' }),
  version: text("version").notNull(),
  content: jsonb("content").notNull(),
  change_summary: text("change_summary").notNull(),
  created_by: integer("created_by").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow()
});

export const policy_obligation_mappings = pgTable("policy_obligation_mappings", {
  id: serial("id").primaryKey(),
  policy_id: integer("policy_id").notNull().references(() => policies.id, { onDelete: 'cascade' }),
  obligation_id: integer("obligation_id").notNull().references(() => obligations.id, { onDelete: 'cascade' }),
  coverage_percentage: integer("coverage_percentage").notNull(),
  evidence: jsonb("evidence"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const policy_tags = pgTable("policy_tags", {
  id: serial("id").primaryKey(),
  policy_id: integer("policy_id").notNull().references(() => policies.id, { onDelete: 'cascade' }),
  tag: text("tag").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

export const policy_approvals = pgTable("policy_approvals", {
  id: serial("id").primaryKey(),
  policy_id: integer("policy_id").notNull().references(() => policies.id, { onDelete: 'cascade' }),
  approver_id: integer("approver_id").notNull().references(() => users.id),
  status: text("status").notNull(), // pending, approved, rejected
  comments: text("comments"),
  created_at: timestamp("created_at").defaultNow()
});

// Create schemas and types for policy framework tables
export const policyTemplateSchema = createInsertSchema(policy_templates)
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    content: z.record(z.unknown()),
    metadata: z.record(z.unknown()).optional(),
  });

export const policySchema = createInsertSchema(policies)
  .omit({ id: true, created_at: true, updated_at: true, created_by: true })
  .extend({
    status: z.enum(['draft', 'active', 'archived', 'review_needed'], {
      required_error: "Status is required",
    }),
    content: z.record(z.unknown()),
    metadata: z.record(z.unknown()).optional(),
  });

export const policyVersionSchema = createInsertSchema(policy_versions)
  .omit({ id: true, created_at: true, created_by: true })
  .extend({
    content: z.record(z.unknown()),
  });

export const policyObligationMappingSchema = createInsertSchema(policy_obligation_mappings)
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    coverage_percentage: z.number().min(0).max(100),
    evidence: z.record(z.unknown()).optional(),
  });

export const policyTagSchema = createInsertSchema(policy_tags)
  .omit({ id: true, created_at: true });

export const policyApprovalSchema = createInsertSchema(policy_approvals)
  .omit({ id: true, created_at: true })
  .extend({
    status: z.enum(['pending', 'approved', 'rejected'], {
      required_error: "Status is required",
    }),
  });

// Define relationships for compliance reporting tables
export const complianceReportTypesRelations = relations(compliance_report_types, ({ many }) => ({
  reports: many(compliance_reports),
  schedules: many(report_schedules)
}));

export const complianceReportsRelations = relations(compliance_reports, ({ one }) => ({
  reportType: one(compliance_report_types, {
    fields: [compliance_reports.report_type_id],
    references: [compliance_report_types.id]
  }),
  user: one(users, {
    fields: [compliance_reports.user_id],
    references: [users.id]
  }),
  jurisdiction: one(jurisdictions, {
    fields: [compliance_reports.jurisdiction_id],
    references: [jurisdictions.id]
  }),
  reviewer: one(users, {
    fields: [compliance_reports.reviewer_id],
    references: [users.id]
  })
}));

export const reportSchedulesRelations = relations(report_schedules, ({ one }) => ({
  reportType: one(compliance_report_types, {
    fields: [report_schedules.report_type_id],
    references: [compliance_report_types.id]
  }),
  user: one(users, {
    fields: [report_schedules.user_id],
    references: [users.id]
  }),
  jurisdiction: one(jurisdictions, {
    fields: [report_schedules.jurisdiction_id],
    references: [jurisdictions.id]
  })
}));

// Define relationship between policies and versions
export const policiesRelations = relations(policies, ({ many, one }) => ({
  versions: many(policy_versions),
  jurisdiction: one(jurisdictions, {
    fields: [policies.jurisdiction_id],
    references: [jurisdictions.id],
  }),
  creator: one(users, {
    fields: [policies.created_by],
    references: [users.id],
  }),
  obligationMappings: many(policy_obligation_mappings),
  tags: many(policy_tags),
  approvals: many(policy_approvals),
}));

export type PolicyTemplate = typeof policy_templates.$inferSelect;
export type InsertPolicyTemplate = z.infer<typeof policyTemplateSchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof policySchema>;
export type PolicyVersion = typeof policy_versions.$inferSelect;
export type InsertPolicyVersion = z.infer<typeof policyVersionSchema>;
export type PolicyObligationMapping = typeof policy_obligation_mappings.$inferSelect;
export type InsertPolicyObligationMapping = z.infer<typeof policyObligationMappingSchema>;
export type PolicyTag = typeof policy_tags.$inferSelect;
export type InsertPolicyTag = z.infer<typeof policyTagSchema>;
export type PolicyApproval = typeof policy_approvals.$inferSelect;
export type InsertPolicyApproval = z.infer<typeof policyApprovalSchema>;