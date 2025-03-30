import { db, pool } from "../server/db";

async function fixStablecoinSchema() {
  try {
    console.log("Starting stablecoin schema fix...");

    // Check if column exists
    const columnExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'stablecoin_info' AND column_name = 'website_url'
      );
    `;
    
    const columnExistsResult = await pool.query(columnExistsQuery);
    const columnExists = columnExistsResult.rows[0].exists;
    
    if (columnExists) {
      console.log("website_url column already exists, no action needed");
      return { success: true, message: "Column already exists" };
    }
    
    // Add the missing column
    const addColumnQuery = `
      ALTER TABLE stablecoin_info 
      ADD COLUMN website_url TEXT DEFAULT '' NOT NULL;
    `;
    
    await pool.query(addColumnQuery);
    console.log("Successfully added website_url column to stablecoin_info table");
    
    return { 
      success: true, 
      message: "Successfully added website_url column to stablecoin_info table" 
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
fixStablecoinSchema()
  .then((result) => {
    console.log("Fix result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Fix failed with error:", error);
    process.exit(1);
  });

export { fixStablecoinSchema };