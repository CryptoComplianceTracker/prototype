/**
 * Simple runner script to seed Singapore data
 */
import seedSingapore from './seed-singapore-core';

async function main() {
  try {
    console.log('Starting Singapore data seeding process...');
    const success = await seedSingapore();
    
    if (success) {
      console.log('✅ Singapore data seeding completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Singapore data seeding failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during Singapore data seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();