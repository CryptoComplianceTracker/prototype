import { pool } from "../server/db";

async function fixTokenTables() {
  console.log("Fixing token tables in the database...");
  try {
    // Add all required columns to token_registrations if they don't exist
    await pool.query(`
      DO $$
      BEGIN
        -- Basic token info columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'contract_addresses') THEN
          ALTER TABLE token_registrations ADD COLUMN contract_addresses JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'blockchain_networks') THEN
          ALTER TABLE token_registrations ADD COLUMN blockchain_networks JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'description') THEN
          ALTER TABLE token_registrations ADD COLUMN description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'issuer_legal_entity') THEN
          ALTER TABLE token_registrations ADD COLUMN issuer_legal_entity TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'compliance_contacts') THEN
          ALTER TABLE token_registrations ADD COLUMN compliance_contacts JSONB;
        END IF;
        
        -- Compliance and regulatory columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'kyc_requirements') THEN
          ALTER TABLE token_registrations ADD COLUMN kyc_requirements TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'aml_policy_url') THEN
          ALTER TABLE token_registrations ADD COLUMN aml_policy_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'transfer_restrictions') THEN
          ALTER TABLE token_registrations ADD COLUMN transfer_restrictions TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'regulatory_status') THEN
          ALTER TABLE token_registrations ADD COLUMN regulatory_status TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'jurisdictions') THEN
          ALTER TABLE token_registrations ADD COLUMN jurisdictions JSONB;
        END IF;
        
        -- Technical details columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'token_standard') THEN
          ALTER TABLE token_registrations ADD COLUMN token_standard TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'total_supply') THEN
          ALTER TABLE token_registrations ADD COLUMN total_supply TEXT;
        END IF;
        
        -- Token-specific fields
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'asset_backing_details') THEN
          ALTER TABLE token_registrations ADD COLUMN asset_backing_details JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'peg_details') THEN
          ALTER TABLE token_registrations ADD COLUMN peg_details JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'security_features') THEN
          ALTER TABLE token_registrations ADD COLUMN security_features JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'tokenomics_details') THEN
          ALTER TABLE token_registrations ADD COLUMN tokenomics_details JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'whitelist_status') THEN
          ALTER TABLE token_registrations ADD COLUMN whitelist_status BOOLEAN DEFAULT false;
        END IF;
        
        -- Audit information
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'security_audit_details') THEN
          ALTER TABLE token_registrations ADD COLUMN security_audit_details JSONB;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'last_audit_date') THEN
          ALTER TABLE token_registrations ADD COLUMN last_audit_date DATE;
        END IF;
        
        -- Status and metadata
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'registration_status') THEN
          ALTER TABLE token_registrations ADD COLUMN registration_status TEXT DEFAULT 'draft' NOT NULL;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'token_registrations' AND column_name = 'risk_assessment') THEN
          ALTER TABLE token_registrations ADD COLUMN risk_assessment JSONB;
        END IF;
      END$$;
    `);

    console.log("Successfully fixed token tables in the database.");
  } catch (error) {
    console.error("Error fixing token tables:", error);
    throw error;
  }
}

// Run the function
fixTokenTables()
  .then(() => {
    console.log("Token tables fixes completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to fix token tables:", err);
    process.exit(1);
  });