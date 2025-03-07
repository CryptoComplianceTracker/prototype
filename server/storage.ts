import { 
  users, transactions, exchangeInfo, stablecoinInfo, defiProtocolInfo, nftMarketplaceInfo, cryptoFundInfo,
  type User, type InsertUser, type Transaction, type InsertExchangeInfo, type ExchangeInfo,
  type StablecoinInfo, type InsertStablecoinInfo,
  type DefiProtocolInfo, type InsertDefiProtocolInfo,
  type NftMarketplaceInfo, type InsertNftMarketplaceInfo,
  type CryptoFundInfo, type InsertCryptoFundInfo
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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
  createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<void>;
  getExchangeInfo(userId: number): Promise<ExchangeInfo | undefined>;

  // Transaction operations
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction>;

  // Session store
  sessionStore: session.Store;

  // Admin operations
  getAllExchangeInfo(): Promise<ExchangeInfo[]>;

  // Stablecoin operations
  createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<void>;
  getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined>;

  // DeFi Protocol operations
  createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<void>;
  getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined>;

  // NFT Marketplace operations
  createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<void>;
  getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined>;

  // Crypto Fund operations
  createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<void>;
  getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined>;
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

  async createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<void> {
    await db.insert(exchangeInfo).values({ ...info, userId });
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
        washTradingDetection: exchange.washTradingDetection || {},
        custodyArrangements: exchange.custodyArrangements || {},
        kycAmlControls: exchange.kycAmlControls || {},
        tradingPolicies: exchange.tradingPolicies || {},
        blockchainAnalytics: exchange.blockchainAnalytics || {}
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

  async createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<void> {
    await db.insert(stablecoinInfo).values({ ...info, userId });
  }

  async getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined> {
    const [info] = await db.select().from(stablecoinInfo).where(eq(stablecoinInfo.userId, userId));
    return info;
  }

  async createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<void> {
    await db.insert(defiProtocolInfo).values({ ...info, userId });
  }

  async getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined> {
    const [info] = await db.select().from(defiProtocolInfo).where(eq(defiProtocolInfo.userId, userId));
    return info;
  }

  async createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<void> {
    await db.insert(nftMarketplaceInfo).values({ ...info, userId });
  }

  async getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined> {
    const [info] = await db.select().from(nftMarketplaceInfo).where(eq(nftMarketplaceInfo.userId, userId));
    return info;
  }

  async createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<void> {
    await db.insert(cryptoFundInfo).values({ ...info, userId });
  }

  async getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined> {
    const [info] = await db.select().from(cryptoFundInfo).where(eq(cryptoFundInfo.userId, userId));
    return info;
  }
}

export const storage = new DatabaseStorage();