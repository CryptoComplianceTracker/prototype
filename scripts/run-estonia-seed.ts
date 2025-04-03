/**
 * Simple runner script to seed Estonia data
 */
import seedEstonia from './seed-estonia-core';

async function main() {
  try {
    console.log('Starting Estonia data seeding process...');
    const success = await seedEstonia();
    
    if (success) {
      console.log('✅ Estonia data seeding completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Estonia data seeding failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during Estonia data seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();