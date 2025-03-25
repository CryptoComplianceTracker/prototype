import { 
  users, transactions, exchangeInfo, stablecoinInfo, defiProtocolInfo, nftMarketplaceInfo, cryptoFundInfo,
  registrations, registrationVersions, auditLogs,
  type User, type InsertUser, type Transaction, type InsertExchangeInfo, type ExchangeInfo,
  type StablecoinInfo, type InsertStablecoinInfo,
  type DefiProtocolInfo, type InsertDefiProtocolInfo,
  type NftMarketplaceInfo, type InsertNftMarketplaceInfo,
  type CryptoFundInfo, type InsertCryptoFundInfo,
  type Registration, type InsertRegistration, type RegistrationVersion, type AuditLog
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
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
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