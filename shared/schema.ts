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
  exchangeName: text("exchange_name").notNull(),
  legalEntityName: text("legal_entity_name").notNull(),
  registrationNumber: text("registration_number").notNull(),
  headquartersLocation: text("headquarters_location").notNull(),
  websiteUrl: text("website_url").notNull(),
  yearEstablished: text("year_established").notNull(),
  exchangeType: text("exchange_type").notNull(),
  regulatoryLicenses: text("regulatory_licenses"),
  complianceContactName: text("compliance_contact_name").notNull(),
  complianceContactEmail: text("compliance_contact_email").notNull(),
  complianceContactPhone: text("compliance_contact_phone").notNull(),
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
    exchangeType: z.enum(["CEX", "DEX"]),
    websiteUrl: z.string().url(),
    complianceContactEmail: z.string().email(),
    complianceContactPhone: z.string().min(10),
    yearEstablished: z.string().regex(/^\d{4}$/),
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