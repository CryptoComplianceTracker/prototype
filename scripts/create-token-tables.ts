import { pool } from "../server/db";

async function createTokenTables() {
  console.log("Creating token tables in the database...");
  try {
    // Create token_category enum if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_category') THEN
          CREATE TYPE token_category AS ENUM (
            'FINANCIAL_INSTRUMENT',
            'REAL_WORLD_ASSET',
            'PAYMENT_STABLE',
            'UTILITY',
            'GOVERNANCE',
            'SYNTHETIC_DERIVATIVE',
            'NFT',
            'COMPLIANCE_ACCESS',
            'SPECIAL_PURPOSE'
          );
        END IF;
      END$$;
    `);
    
    // Create token_registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_registrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        token_name TEXT NOT NULL,
        token_symbol TEXT NOT NULL,
        token_category token_category NOT NULL,
        token_type TEXT NOT NULL,
        token_standard TEXT,
        issuer_name TEXT NOT NULL,
        issuer_legal_entity TEXT,
        issuer_jurisdiction TEXT,
        blockchain_networks JSONB,
        smart_contracts JSONB,
        total_supply BIGINT,
        circulating_supply BIGINT,
        launch_date TIMESTAMP WITH TIME ZONE,
        description TEXT,
        use_case TEXT,
        website_url TEXT,
        whitepaper_url TEXT,
        github_url TEXT,
        social_media_links JSONB,
        contact_information JSONB,
        token_economics TEXT,
        jurisdictions JSONB,
        asset_backing_details JSONB,
        tokenomics_details JSONB,
        token_management_team JSONB,
        regulatory_status TEXT,
        legal_opinion_references TEXT,
        audit_status TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_listed BOOLEAN DEFAULT FALSE,
        visibility TEXT DEFAULT 'public'
      );
    `);

    // Create token_registration_documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_registration_documents (
        id SERIAL PRIMARY KEY,
        token_registration_id INTEGER NOT NULL REFERENCES token_registrations(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        document_name TEXT NOT NULL,
        document_url TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create token_registration_verifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_registration_verifications (
        id SERIAL PRIMARY KEY,
        token_registration_id INTEGER NOT NULL REFERENCES token_registrations(id) ON DELETE CASCADE,
        verification_status TEXT NOT NULL,
        verification_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verifier_user_id INTEGER REFERENCES users(id),
        verification_notes TEXT,
        verification_documents JSONB
      );
    `);

    // Create token_risk_assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_risk_assessments (
        id SERIAL PRIMARY KEY,
        token_registration_id INTEGER NOT NULL REFERENCES token_registrations(id) ON DELETE CASCADE,
        risk_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        assessor_user_id INTEGER REFERENCES users(id),
        assessment_notes TEXT,
        risk_factors JSONB
      );
    `);

    // Create token_jurisdiction_approvals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS token_jurisdiction_approvals (
        id SERIAL PRIMARY KEY,
        token_registration_id INTEGER NOT NULL REFERENCES token_registrations(id) ON DELETE CASCADE,
        jurisdiction_id INTEGER REFERENCES jurisdictions(id),
        approval_status TEXT NOT NULL,
        approval_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        approval_details TEXT,
        regulatory_requirements JSONB,
        restrictions JSONB
      );
    `);

    console.log("Successfully created token tables in the database.");
  } catch (error) {
    console.error("Error creating token tables:", error);
    throw error;
  } finally {
    // Don't close the pool if it's used elsewhere
    // await pool.end();
  }
}

// Run the function
createTokenTables()
  .then(() => {
    console.log("Token tables creation completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to create token tables:", err);
    process.exit(1);
  });