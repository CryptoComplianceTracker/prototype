import { db, pool } from "../server/db";

async function fixStablecoinSchemaFull() {
  try {
    console.log("Starting complete stablecoin schema fix...");

    // Define all the columns that should be in the stablecoin_info table based on schema.ts
    const requiredColumns = [
      { name: "website_url", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "compliance_officer_email", type: "TEXT DEFAULT NULL" },
      { name: "backing_asset_type", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "backing_asset_details", type: "TEXT DEFAULT NULL" },
      { name: "pegged_to", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "total_supply", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "reserve_ratio", type: "TEXT DEFAULT NULL" },
      { name: "custodian_name", type: "TEXT DEFAULT NULL" },
      { name: "audit_provider", type: "TEXT DEFAULT NULL" },
      { name: "attestation_method", type: "TEXT DEFAULT NULL" },
      { name: "redemption_policy", type: "TEXT DEFAULT NULL" },
      { name: "redemption_frequency", type: "TEXT DEFAULT NULL" },
      { name: "central_bank_partnership", type: "BOOLEAN DEFAULT FALSE" },
      { name: "is_regulated", type: "BOOLEAN DEFAULT FALSE" },
      { name: "has_market_makers", type: "BOOLEAN DEFAULT FALSE" },
      { name: "has_travel_rule", type: "BOOLEAN DEFAULT FALSE" },
      { name: "aml_policy_url", type: "TEXT DEFAULT NULL" },
      { name: "reserve_details", type: "JSONB DEFAULT '{}'::jsonb" },
      { name: "custodian_details", type: "JSONB DEFAULT '{}'::jsonb" },
      { name: "audit_information", type: "JSONB DEFAULT '{}'::jsonb" },
      { name: "chain_ids", type: "TEXT[] DEFAULT '{}'::text[]" },
      { name: "contract_addresses", type: "JSONB DEFAULT '{}'::jsonb" },
      { name: "blockchain_platforms", type: "JSONB DEFAULT '{}'::jsonb" }
    ];

    // Check which columns already exist
    for (const column of requiredColumns) {
      const columnExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'stablecoin_info' AND column_name = '${column.name}'
        );
      `;
      
      const columnExistsResult = await pool.query(columnExistsQuery);
      const columnExists = columnExistsResult.rows[0].exists;
      
      if (columnExists) {
        console.log(`Column ${column.name} already exists, skipping`);
      } else {
        // Add the missing column
        const addColumnQuery = `
          ALTER TABLE stablecoin_info 
          ADD COLUMN ${column.name} ${column.type};
        `;
        
        await pool.query(addColumnQuery);
        console.log(`Successfully added ${column.name} column to stablecoin_info table`);
      }
    }
    
    console.log("Stablecoin schema fix completed successfully!");
    
    return { 
      success: true, 
      message: "Successfully fixed stablecoin_info table schema" 
    };
  } catch (error) {
    console.error("Error fixing stablecoin schema:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Execute the fix function
fixStablecoinSchemaFull()
  .then((result) => {
    console.log("Fix result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Fix failed with error:", error);
    process.exit(1);
  });

export { fixStablecoinSchemaFull };