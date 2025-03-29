import { migrateJurisdictionsSchema } from './migrate-jurisdiction-schema';
import { importEnhancedSwitzerlandData } from './import-switzerland-enhanced';

async function setupEnhancedJurisdictionSchema() {
  try {
    console.log('Starting enhanced jurisdiction schema setup...');
    
    // Step 1: Migrate the schema
    console.log('\n--- STEP 1: Migrate Schema ---');
    const migrationResult = await migrateJurisdictionsSchema();
    
    if (!migrationResult.success) {
      throw new Error(`Schema migration failed: ${migrationResult.message}`);
    }
    
    console.log('Schema migration completed successfully!');
    
    // Step 2: Import Switzerland data
    console.log('\n--- STEP 2: Import Switzerland Data ---');
    const importResult = await importEnhancedSwitzerlandData();
    
    if (!importResult.success) {
      throw new Error(`Switzerland data import failed: ${importResult.message}`);
    }
    
    console.log('Switzerland data imported successfully!');
    
    // Final success message
    console.log('\n✅ Enhanced jurisdiction schema setup complete!');
    return {
      success: true,
      message: 'Enhanced jurisdiction schema setup complete'
    };
  } catch (error) {
    console.error('Setup failed:', error);
    return {
      success: false,
      message: `Setup failed: ${(error as Error).message}`
    };
  }
}

// Execute if this script is run directly
if (require.main === module) {
  setupEnhancedJurisdictionSchema()
    .then(result => {
      console.log(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Unhandled error during setup:', err);
      process.exit(1);
    });
}

export { setupEnhancedJurisdictionSchema };