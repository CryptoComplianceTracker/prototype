import { 
  users, transactions, exchangeInfo, stablecoinInfo, defiProtocolInfo, nftMarketplaceInfo, cryptoFundInfo,
  registrations, registrationVersions, auditLogs,
  jurisdictions, regulatory_bodies, regulations, compliance_requirements, taxation_rules,
  reporting_obligations, regulatory_updates, jurisdiction_tags, jurisdiction_query_keywords,
  type User, type InsertUser, type Transaction, type InsertExchangeInfo, type ExchangeInfo,
  type StablecoinInfo, type InsertStablecoinInfo,
  type DefiProtocolInfo, type InsertDefiProtocolInfo,
  type NftMarketplaceInfo, type InsertNftMarketplaceInfo,
  type CryptoFundInfo, type InsertCryptoFundInfo,
  type Registration, type InsertRegistration, type RegistrationVersion, type AuditLog,
  type Jurisdiction, type InsertJurisdiction,
  type RegulatoryBody, type InsertRegulatoryBody,
  type Regulation, type InsertRegulation,
  type ComplianceRequirement, type InsertComplianceRequirement,
  type TaxationRule, type InsertTaxationRule,
  type ReportingObligation, type InsertReportingObligation,
  type RegulatoryUpdate, type InsertRegulatoryUpdate,
  type JurisdictionTag, type InsertJurisdictionTag,
  type JurisdictionQueryKeyword, type InsertJurisdictionQueryKeyword
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserKYC(id: number, data: Partial<User>): Promise<void>;

  // Exchange operations
  createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<ExchangeInfo>;
  getExchangeInfo(userId: number): Promise<ExchangeInfo | undefined>;
  getExchangeInfoByUserId(userId: number): Promise<ExchangeInfo[]>;

  // Transaction operations
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction>;

  // Session store
  sessionStore: session.Store;

  // Admin operations
  getAllExchangeInfo(): Promise<ExchangeInfo[]>;
  getAllStablecoinInfo(): Promise<StablecoinInfo[]>;
  getAllDefiProtocolInfo(): Promise<DefiProtocolInfo[]>;
  getAllNftMarketplaceInfo(): Promise<NftMarketplaceInfo[]>;
  getAllCryptoFundInfo(): Promise<CryptoFundInfo[]>;

  // Stablecoin operations
  createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<StablecoinInfo>;
  getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined>;
  getStablecoinInfoByUserId(userId: number): Promise<StablecoinInfo[]>;

  // DeFi Protocol operations
  createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<DefiProtocolInfo>;
  getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined>;
  getDefiProtocolInfoByUserId(userId: number): Promise<DefiProtocolInfo[]>;

  // NFT Marketplace operations
  createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<NftMarketplaceInfo>;
  getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined>;
  getNftMarketplaceInfoByUserId(userId: number): Promise<NftMarketplaceInfo[]>;

  // Crypto Fund operations
  createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<CryptoFundInfo>;
  getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined>;
  getCryptoFundInfoByUserId(userId: number): Promise<CryptoFundInfo[]>;

  // New unified registration methods
  createRegistration(userId: number, registration: InsertRegistration): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationsByUserId(userId: number): Promise<Registration[]>;
  getRegistrationsByType(type: string): Promise<Registration[]>;
  updateRegistration(id: number, data: Partial<Registration>): Promise<Registration>;

  // Version tracking
  createRegistrationVersion(registrationId: number, version: Partial<RegistrationVersion>): Promise<RegistrationVersion>;
  getRegistrationVersions(registrationId: number): Promise<RegistrationVersion[]>;

  // Audit logging
  createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog>;
  getAuditLogs(tableName: string, recordId: number): Promise<AuditLog[]>;
  
  // Jurisdiction database
  createJurisdiction(data: InsertJurisdiction): Promise<Jurisdiction>;
  getJurisdiction(id: number): Promise<Jurisdiction | undefined>;
  getJurisdictionByName(name: string): Promise<Jurisdiction | undefined>;
  getAllJurisdictions(): Promise<Jurisdiction[]>;
  updateJurisdiction(id: number, data: Partial<Jurisdiction>): Promise<Jurisdiction>;
  
  // Regulatory bodies
  createRegulatoryBody(data: InsertRegulatoryBody): Promise<RegulatoryBody>;
  getRegulatoryBodiesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryBody[]>;
  updateRegulatoryBody(id: number, data: Partial<RegulatoryBody>): Promise<RegulatoryBody>;
  
  // Regulations
  createRegulation(data: InsertRegulation): Promise<Regulation>;
  getRegulationsByJurisdictionId(jurisdictionId: number): Promise<Regulation[]>;
  updateRegulation(id: number, data: Partial<Regulation>): Promise<Regulation>;
  
  // Compliance requirements
  createComplianceRequirement(data: InsertComplianceRequirement): Promise<ComplianceRequirement>;
  getComplianceRequirementsByJurisdictionId(jurisdictionId: number): Promise<ComplianceRequirement[]>;
  updateComplianceRequirement(id: number, data: Partial<ComplianceRequirement>): Promise<ComplianceRequirement>;
  
  // Taxation rules
  createTaxationRule(data: InsertTaxationRule): Promise<TaxationRule>;
  getTaxationRuleByJurisdictionId(jurisdictionId: number): Promise<TaxationRule | undefined>;
  updateTaxationRule(id: number, data: Partial<TaxationRule>): Promise<TaxationRule>;
  
  // Reporting obligations
  createReportingObligation(data: InsertReportingObligation): Promise<ReportingObligation>;
  getReportingObligationsByJurisdictionId(jurisdictionId: number): Promise<ReportingObligation[]>;
  updateReportingObligation(id: number, data: Partial<ReportingObligation>): Promise<ReportingObligation>;
  
  // Regulatory updates
  createRegulatoryUpdate(data: InsertRegulatoryUpdate): Promise<RegulatoryUpdate>;
  getRegulatoryUpdatesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryUpdate[]>;
  updateRegulatoryUpdate(id: number, data: Partial<RegulatoryUpdate>): Promise<RegulatoryUpdate>;
  
  // Tags and keywords
  createJurisdictionTag(data: InsertJurisdictionTag): Promise<JurisdictionTag>;
  getJurisdictionTagsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionTag[]>;
  createJurisdictionQueryKeyword(data: InsertJurisdictionQueryKeyword): Promise<JurisdictionQueryKeyword>;
  getJurisdictionQueryKeywordsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionQueryKeyword[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }
  
  // Jurisdiction methods
  async createJurisdiction(data: InsertJurisdiction): Promise<Jurisdiction> {
    const [jurisdiction] = await db.insert(jurisdictions).values(data).returning();
    return jurisdiction;
  }

  async getJurisdiction(id: number): Promise<Jurisdiction | undefined> {
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, id));
    return jurisdiction;
  }

  async getJurisdictionByName(name: string): Promise<Jurisdiction | undefined> {
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.name, name));
    return jurisdiction;
  }

  async getAllJurisdictions(): Promise<Jurisdiction[]> {
    return await db.select().from(jurisdictions);
  }

  async updateJurisdiction(id: number, data: Partial<Jurisdiction>): Promise<Jurisdiction> {
    const [updated] = await db.update(jurisdictions)
      .set({ ...data, updated_at: new Date() })
      .where(eq(jurisdictions.id, id))
      .returning();
    return updated;
  }

  // Regulatory bodies methods
  async createRegulatoryBody(data: InsertRegulatoryBody): Promise<RegulatoryBody> {
    const [body] = await db.insert(regulatory_bodies).values(data).returning();
    return body;
  }

  async getRegulatoryBodiesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryBody[]> {
    return await db.select()
      .from(regulatory_bodies)
      .where(eq(regulatory_bodies.jurisdiction_id, jurisdictionId));
  }

  async updateRegulatoryBody(id: number, data: Partial<RegulatoryBody>): Promise<RegulatoryBody> {
    const [updated] = await db.update(regulatory_bodies)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulatory_bodies.id, id))
      .returning();
    return updated;
  }

  // Regulations methods
  async createRegulation(data: InsertRegulation): Promise<Regulation> {
    const [regulation] = await db.insert(regulations).values(data).returning();
    return regulation;
  }

  async getRegulationsByJurisdictionId(jurisdictionId: number): Promise<Regulation[]> {
    return await db.select()
      .from(regulations)
      .where(eq(regulations.jurisdiction_id, jurisdictionId));
  }

  async updateRegulation(id: number, data: Partial<Regulation>): Promise<Regulation> {
    const [updated] = await db.update(regulations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulations.id, id))
      .returning();
    return updated;
  }

  // Compliance requirements methods
  async createComplianceRequirement(data: InsertComplianceRequirement): Promise<ComplianceRequirement> {
    const [requirement] = await db.insert(compliance_requirements).values(data).returning();
    return requirement;
  }

  async getComplianceRequirementsByJurisdictionId(jurisdictionId: number): Promise<ComplianceRequirement[]> {
    return await db.select()
      .from(compliance_requirements)
      .where(eq(compliance_requirements.jurisdiction_id, jurisdictionId));
  }

  async updateComplianceRequirement(id: number, data: Partial<ComplianceRequirement>): Promise<ComplianceRequirement> {
    const [updated] = await db.update(compliance_requirements)
      .set({ ...data, updated_at: new Date() })
      .where(eq(compliance_requirements.id, id))
      .returning();
    return updated;
  }

  // Taxation rules methods
  async createTaxationRule(data: InsertTaxationRule): Promise<TaxationRule> {
    const [rule] = await db.insert(taxation_rules).values(data).returning();
    return rule;
  }

  async getTaxationRuleByJurisdictionId(jurisdictionId: number): Promise<TaxationRule | undefined> {
    const [rule] = await db.select()
      .from(taxation_rules)
      .where(eq(taxation_rules.jurisdiction_id, jurisdictionId));
    return rule;
  }

  async updateTaxationRule(id: number, data: Partial<TaxationRule>): Promise<TaxationRule> {
    const [updated] = await db.update(taxation_rules)
      .set({ ...data, updated_at: new Date() })
      .where(eq(taxation_rules.id, id))
      .returning();
    return updated;
  }

  // Reporting obligations methods
  async createReportingObligation(data: InsertReportingObligation): Promise<ReportingObligation> {
    const [obligation] = await db.insert(reporting_obligations).values(data).returning();
    return obligation;
  }

  async getReportingObligationsByJurisdictionId(jurisdictionId: number): Promise<ReportingObligation[]> {
    return await db.select()
      .from(reporting_obligations)
      .where(eq(reporting_obligations.jurisdiction_id, jurisdictionId));
  }

  async updateReportingObligation(id: number, data: Partial<ReportingObligation>): Promise<ReportingObligation> {
    const [updated] = await db.update(reporting_obligations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(reporting_obligations.id, id))
      .returning();
    return updated;
  }

  // Regulatory updates methods
  async createRegulatoryUpdate(data: InsertRegulatoryUpdate): Promise<RegulatoryUpdate> {
    const [update] = await db.insert(regulatory_updates).values(data).returning();
    return update;
  }

  async getRegulatoryUpdatesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryUpdate[]> {
    return await db.select()
      .from(regulatory_updates)
      .where(eq(regulatory_updates.jurisdiction_id, jurisdictionId));
  }

  async updateRegulatoryUpdate(id: number, data: Partial<RegulatoryUpdate>): Promise<RegulatoryUpdate> {
    const [updated] = await db.update(regulatory_updates)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulatory_updates.id, id))
      .returning();
    return updated;
  }

  // Tags and keywords methods
  async createJurisdictionTag(data: InsertJurisdictionTag): Promise<JurisdictionTag> {
    const [tag] = await db.insert(jurisdiction_tags).values(data).returning();
    return tag;
  }

  async getJurisdictionTagsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionTag[]> {
    return await db.select()
      .from(jurisdiction_tags)
      .where(eq(jurisdiction_tags.jurisdiction_id, jurisdictionId));
  }

  async createJurisdictionQueryKeyword(data: InsertJurisdictionQueryKeyword): Promise<JurisdictionQueryKeyword> {
    const [keyword] = await db.insert(jurisdiction_query_keywords).values(data).returning();
    return keyword;
  }

  async getJurisdictionQueryKeywordsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionQueryKeyword[]> {
    return await db.select()
      .from(jurisdiction_query_keywords)
      .where(eq(jurisdiction_query_keywords.jurisdiction_id, jurisdictionId));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserKYC(id: number, data: Partial<User>): Promise<void> {
    await db.update(users)
      .set(data)
      .where(eq(users.id, id));
  }

  async createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<ExchangeInfo> {
    const [created] = await db.insert(exchangeInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getExchangeInfo(userId: number): Promise<ExchangeInfo | undefined> {
    const [info] = await db.select().from(exchangeInfo).where(eq(exchangeInfo.userId, userId));
    return info;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  }

  async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getAllExchangeInfo(): Promise<ExchangeInfo[]> {
    try {
      const exchanges = await db.select().from(exchangeInfo);
      console.log("Raw exchanges from database:", exchanges);

      // Transform and validate exchange data
      return exchanges.map(exchange => ({
        ...exchange,
        exchangeType: this.validateExchangeType(exchange.exchangeType),
        washTradingDetection: this.parseJsonField(exchange.washTradingDetection),
        custodyArrangements: this.parseJsonField(exchange.custodyArrangements),
        securityMeasures: this.parseJsonField(exchange.securityMeasures),
        riskManagement: this.parseJsonField(exchange.riskManagement),
        kycVerificationMetrics: this.parseJsonField(exchange.kycVerificationMetrics),
        sanctionsCompliance: this.parseJsonField(exchange.sanctionsCompliance),
        insuranceCoverage: this.parseJsonField(exchange.insuranceCoverage),
        supportedBlockchains: this.parseJsonField(exchange.supportedBlockchains),
        blockchainAnalytics: this.parseJsonField(exchange.blockchainAnalytics)
      }));
    } catch (error) {
      console.error("Error in getAllExchangeInfo:", error);
      throw new Error(`Failed to fetch exchange info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getAllStablecoinInfo(): Promise<StablecoinInfo[]> {
    try {
      const stablecoins = await db.select().from(stablecoinInfo);
      console.log(`Retrieved ${stablecoins.length} stablecoin registrations`);
      return stablecoins;
    } catch (error) {
      console.error("Error in getAllStablecoinInfo:", error);
      throw new Error(`Failed to fetch stablecoin info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllDefiProtocolInfo(): Promise<DefiProtocolInfo[]> {
    try {
      const defiProtocols = await db.select().from(defiProtocolInfo);
      console.log(`Retrieved ${defiProtocols.length} DeFi protocol registrations`);
      return defiProtocols;
    } catch (error) {
      console.error("Error in getAllDefiProtocolInfo:", error);
      throw new Error(`Failed to fetch DeFi protocol info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllNftMarketplaceInfo(): Promise<NftMarketplaceInfo[]> {
    try {
      const nftMarketplaces = await db.select().from(nftMarketplaceInfo);
      console.log(`Retrieved ${nftMarketplaces.length} NFT marketplace registrations`);
      return nftMarketplaces;
    } catch (error) {
      console.error("Error in getAllNftMarketplaceInfo:", error);
      throw new Error(`Failed to fetch NFT marketplace info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllCryptoFundInfo(): Promise<CryptoFundInfo[]> {
    try {
      const cryptoFunds = await db.select().from(cryptoFundInfo);
      console.log(`Retrieved ${cryptoFunds.length} crypto fund registrations`);
      return cryptoFunds;
    } catch (error) {
      console.error("Error in getAllCryptoFundInfo:", error);
      throw new Error(`Failed to fetch crypto fund info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper function to validate exchange type
  private validateExchangeType(type: string): "DEX" | "CEX" {
    if (type !== "DEX" && type !== "CEX") {
      console.warn(`Invalid exchange type "${type}" found, defaulting to "CEX"`);
      return "CEX";
    }
    return type;
  }

  private parseJsonField(field: unknown): Record<string, unknown> {
    if (!field) return {};
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return {};
      }
    }
    if (typeof field === 'object') {
      return field as Record<string, unknown>;
    }
    return {};
  }

  async createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<StablecoinInfo> {
    const [created] = await db.insert(stablecoinInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined> {
    const [info] = await db.select().from(stablecoinInfo).where(eq(stablecoinInfo.userId, userId));
    return info;
  }

  async createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<DefiProtocolInfo> {
    const [created] = await db.insert(defiProtocolInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined> {
    const [info] = await db.select().from(defiProtocolInfo).where(eq(defiProtocolInfo.userId, userId));
    return info;
  }

  async createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<NftMarketplaceInfo> {
    const [created] = await db.insert(nftMarketplaceInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined> {
    const [info] = await db.select().from(nftMarketplaceInfo).where(eq(nftMarketplaceInfo.userId, userId));
    return info;
  }

  async createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<CryptoFundInfo> {
    const [created] = await db.insert(cryptoFundInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined> {
    const [info] = await db.select().from(cryptoFundInfo).where(eq(cryptoFundInfo.userId, userId));
    return info;
  }

  async getExchangeInfoByUserId(userId: number): Promise<ExchangeInfo[]> {
    return await db.select().from(exchangeInfo).where(eq(exchangeInfo.userId, userId));
  }

  async getStablecoinInfoByUserId(userId: number): Promise<StablecoinInfo[]> {
    return await db.select().from(stablecoinInfo).where(eq(stablecoinInfo.userId, userId));
  }

  async getDefiProtocolInfoByUserId(userId: number): Promise<DefiProtocolInfo[]> {
    return await db.select().from(defiProtocolInfo).where(eq(defiProtocolInfo.userId, userId));
  }

  async getNftMarketplaceInfoByUserId(userId: number): Promise<NftMarketplaceInfo[]> {
    return await db.select().from(nftMarketplaceInfo).where(eq(nftMarketplaceInfo.userId, userId));
  }

  async getCryptoFundInfoByUserId(userId: number): Promise<CryptoFundInfo[]> {
    return await db.select().from(cryptoFundInfo).where(eq(cryptoFundInfo.userId, userId));
  }

  async createRegistration(userId: number, registration: InsertRegistration): Promise<Registration> {
    const [created] = await db.insert(registrations)
      .values({ ...registration, userId })
      .returning();
    return created;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    const [registration] = await db.select()
      .from(registrations)
      .where(eq(registrations.id, id))
      .where(sql`deleted_at IS NULL`);
    return registration;
  }

  async getRegistrationsByUserId(userId: number): Promise<Registration[]> {
    return await db.select()
      .from(registrations)
      .where(eq(registrations.userId, userId))
      .where(sql`deleted_at IS NULL`);
  }

  async getRegistrationsByType(type: string): Promise<Registration[]> {
    return await db.select()
      .from(registrations)
      .where(eq(registrations.registrationType, type))
      .where(sql`deleted_at IS NULL`);
  }

  async updateRegistration(id: number, data: Partial<Registration>): Promise<Registration> {
    const [updated] = await db.update(registrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(registrations.id, id))
      .returning();
    return updated;
  }

  async createRegistrationVersion(
    registrationId: number, 
    version: Partial<RegistrationVersion>
  ): Promise<RegistrationVersion> {
    const [created] = await db.insert(registrationVersions)
      .values({ ...version, registrationId })
      .returning();
    return created;
  }

  async getRegistrationVersions(registrationId: number): Promise<RegistrationVersion[]> {
    return await db.select()
      .from(registrationVersions)
      .where(eq(registrationVersions.registrationId, registrationId))
      .orderBy(desc(registrationVersions.version));
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs)
      .values(log)
      .returning();
    return created;
  }

  async getAuditLogs(tableName: string, recordId: number): Promise<AuditLog[]> {
    return await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.tableName, tableName))
      .where(eq(auditLogs.recordId, recordId))
      .orderBy(desc(auditLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();