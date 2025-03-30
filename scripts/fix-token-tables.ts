import { pool } from "../server/db";

async function fixTokenTables() {
  console.log("Fixing token tables in the database...");
  try {
    // Check if contract_addresses column exists and add it if missing
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'token_registrations' 
          AND column_name = 'contract_addresses'
        ) THEN
          ALTER TABLE token_registrations 
          ADD COLUMN contract_addresses JSONB;
        END IF;
      END$$;
    `);
    
    // Make sure all required fields in token_registrations have appropriate defaults
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'token_registrations' 
          AND column_name = 'blockchain_networks'
        ) THEN
          ALTER TABLE token_registrations 
          ADD COLUMN blockchain_networks JSONB;
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'token_registrations' 
          AND column_name = 'description'
        ) THEN
          ALTER TABLE token_registrations 
          ADD COLUMN description TEXT;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'token_registrations' 
          AND column_name = 'issuer_legal_entity'
        ) THEN
          ALTER TABLE token_registrations 
          ADD COLUMN issuer_legal_entity TEXT;
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'token_registrations' 
          AND column_name = 'compliance_contacts'
        ) THEN
          ALTER TABLE token_registrations 
          ADD COLUMN compliance_contacts JSONB;
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