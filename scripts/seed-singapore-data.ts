/**
 * Master script to seed Singapore jurisdiction data
 * This script will:
 * 1. Seed the Singapore jurisdiction
 * 2. Seed regulatory bodies
 * 3. Seed laws, compliance requirements, taxation rules, and other regulatory details
 */
import { seedSingaporeJurisdiction } from './seed-singapore-jurisdiction';
import { seedSingaporeDetails } from './seed-singapore-details';
import { fileURLToPath } from 'url';

async function seedSingaporeData() {
  console.log('Starting Singapore data seeding process...');

  try {
    // Step 1: Seed Singapore jurisdiction and regulatory bodies
    await seedSingaporeJurisdiction();
    console.log('✅ Successfully seeded Singapore jurisdiction and regulatory bodies');

    // Step 2: Seed detailed regulatory information
    await seedSingaporeDetails();
    console.log('✅ Successfully seeded Singapore detailed regulatory information');

    console.log('Singapore data seeding completed successfully 🚀');
    return true;
  } catch (error) {
    console.error('Failed to seed Singapore data:', error);
    throw error;
  }
}

// Execute the function if this script is run directly
const isMainModule = import.meta.url === `file://${fileURLToPath(process.argv[1])}`;
if (isMainModule) {
  seedSingaporeData()
    .then(() => {
      console.log('Singapore data seeding process completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error in Singapore data seeding process:', error);
      process.exit(1);
    });
}

export { seedSingaporeData };