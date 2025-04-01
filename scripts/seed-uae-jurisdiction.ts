import { db } from "../server/db";
import { jurisdictions } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * This script ensures that the UAE jurisdiction exists in the database
 */
async function seedUaeJurisdiction() {
  try {
    console.log("Checking if UAE jurisdiction exists...");
    
    // Check if UAE jurisdiction already exists
    const [existingUae] = await db.select().from(jurisdictions)
      .where(eq(jurisdictions.name, "United Arab Emirates"));
    
    if (existingUae) {
      console.log(`UAE jurisdiction already exists with ID ${existingUae.id}`);
      return;
    }
    
    // Insert UAE jurisdiction
    const [uae] = await db.insert(jurisdictions)
      .values({
        name: "United Arab Emirates",
        region: "Middle East",
        risk_level: "Medium",
        favorability_score: 7,
        notes: "Emerging crypto hub with progressive regulatory framework focused on attracting blockchain businesses.",
        iso_code: "AE",
        currency_code: "AED",
        is_fatf_member: true,
        legal_system_type: "Civil Law with Sharia influence",
        national_language: "Arabic",
        central_bank_url: "https://www.centralbank.ae/",
        financial_licensing_portal: "https://www.vara.ae/",
        contact_email: "info@vara.ae"
      })
      .returning();
    
    console.log(`Created UAE jurisdiction with ID ${uae.id}`);
  } catch (error) {
    console.error("Error seeding UAE jurisdiction:", error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedUaeJurisdiction();