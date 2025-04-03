/**
 * Runner script for the Estonia advanced seed data
 */
import seedEstoniaAdvanced from './seed-estonia-advanced';

async function main() {
  try {
    console.log('Starting advanced Estonia data seeding process...');
    const success = await seedEstoniaAdvanced();
    
    if (success) {
      console.log('✅ Estonia advanced data seeding completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Estonia advanced data seeding failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during Estonia advanced data seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();