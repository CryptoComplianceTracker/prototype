import { db } from "../server/db";
import { 
  users, transactions, exchangeInfo, stablecoinInfo, defiProtocolInfo, nftMarketplaceInfo, 
  cryptoFundInfo, registrations, registrationVersions, auditLogs,
  jurisdictions, regulatory_bodies, regulations, compliance_requirements, taxation_rules,
  reporting_obligations, regulatory_updates, jurisdiction_tags, jurisdiction_query_keywords,
  laws, obligations, organizations, reports, obligation_assignments, regulatory_keywords_index
} from "../shared/schema";
import { sql } from "drizzle-orm";
import { migrateJurisdictionsSchema } from "./migrate-jurisdiction-schema";

async function main() {
  console.log("Creating database schema...");

  // Create a transaction
  const createSchema = async () => {
    try {
      await db.execute(sql`
        CREATE SCHEMA IF NOT EXISTS public;
      `);

      // Create tables for users and related entities
      console.log("Creating users and related tables...");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT NOT NULL,
          company_name TEXT NOT NULL,
          wallet_address TEXT,
          kyc_verified BOOLEAN DEFAULT false,
          risk_score INTEGER DEFAULT 0,
          compliance_data JSONB,
          is_admin BOOLEAN DEFAULT false
        );
      `);

      // Create transactions table
      console.log("Creating transactions table...");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.transactions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES public.users(id),
          transaction_type TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          timestamp TIMESTAMP DEFAULT NOW(),
          status TEXT NOT NULL,
          blockchain TEXT,
          tx_hash TEXT,
          risk_score INTEGER
        );
      `);

      // Create new jurisdiction tables
      console.log("Creating jurisdiction tables...");
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.jurisdictions (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          region TEXT NOT NULL,
          risk_level TEXT NOT NULL,
          favorability_score INTEGER,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.regulatory_bodies (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          website_url TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.regulations (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          compliance_url TEXT,
          effective_date TIMESTAMP,
          last_updated TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.compliance_requirements (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          requirement_type TEXT NOT NULL,
          summary TEXT NOT NULL,
          details TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.taxation_rules (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          income_tax_applicable BOOLEAN,
          capital_gains_tax BOOLEAN,
          vat_applicable BOOLEAN,
          tax_description TEXT,
          tax_authority_url TEXT,
          last_updated TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.reporting_obligations (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          frequency TEXT,
          submission_url TEXT,
          penalties TEXT,
          last_reviewed TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.regulatory_updates (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          update_title TEXT NOT NULL,
          update_date TIMESTAMP,
          summary TEXT,
          source TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.jurisdiction_tags (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          tag TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS public.jurisdiction_query_keywords (
          id SERIAL PRIMARY KEY,
          jurisdiction_id INTEGER REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
          keyword TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      console.log("Database schema created successfully");
    } catch (error) {
      console.error("Error creating database schema:", error);
      throw error;
    }
  };

  await createSchema();
  console.log("Base schema push completed");
  
  // Run migration for the enhanced jurisdiction schema
  console.log("Running jurisdiction schema migration...");
  const migrationResult = await migrateJurisdictionsSchema();
  
  if (migrationResult.success) {
    console.log("Schema push and migration completed successfully");
  } else {
    console.error("Migration failed:", migrationResult.message);
  }
  
  process.exit(migrationResult.success ? 0 : 1);
}

main().catch((err) => {
  console.error("Error in schema push:", err);
  process.exit(1);
});