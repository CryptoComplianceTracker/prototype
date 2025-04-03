/**
 * This script seeds the Singapore jurisdiction into the database
 */
import { db } from '../server/db';
import { jurisdictions, regulatory_bodies, InsertJurisdiction } from '../shared/schema';
import { fileURLToPath } from 'url';
import { eq } from 'drizzle-orm';

async function seedSingaporeJurisdiction() {
  console.log('Seeding Singapore jurisdiction...');

  try {
    // Check if Singapore already exists to avoid duplicate entries
    const existingSingapore = await db.select().from(jurisdictions).where(
      eq(jurisdictions.name, 'Singapore')
    );

    if (existingSingapore.length > 0) {
      console.log('Singapore jurisdiction already exists:', existingSingapore[0].id);
      return existingSingapore[0];
    }

    // Singapore jurisdiction data
    const singaporeData: InsertJurisdiction = {
      name: 'Singapore',
      region: 'Asia-Pacific',
      iso_code: 'SG',
      risk_level: 'Low',
      favorability_score: 90,
      notes: 'Singapore is widely considered a regulatory leader in crypto with the Payment Services Act and MAS Digital Payment Token (DPT) framework. It supports licensed exchanges, custodians, and stablecoin issuers, with strong AML/CFT controls.',
      currency_code: 'SGD',
      is_fatf_member: true,
      legal_system_type: 'Common Law',
      national_language: 'English, Malay, Mandarin, Tamil',
      central_bank_url: 'https://www.mas.gov.sg',
      financial_licensing_portal: 'https://www.mas.gov.sg/regulation/payments/entities-that-have-notified-mas-pursuant-to-the-ps-esp-r',
      contact_email: 'webmaster@mas.gov.sg',
    };

    // Insert Singapore jurisdiction
    const [insertedJurisdiction] = await db.insert(jurisdictions).values(singaporeData).returning();
    console.log('Singapore jurisdiction added with ID:', insertedJurisdiction.id);

    // Regulatory bodies for Singapore
    const regulatoryBodies = [
      {
        name: 'Monetary Authority of Singapore (MAS)',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://www.mas.gov.sg',
        description: 'Singapore\'s central bank and primary financial regulator. Oversees licensing and compliance for DPT service providers under the PSA.',
        authority_level: 'Primary',
        crypto_scope: 'Comprehensive',
        contact_email: 'webmaster@mas.gov.sg',
        reporting_api_available: true
      },
      {
        name: 'Accounting and Corporate Regulatory Authority (ACRA)',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://www.acra.gov.sg',
        description: 'Handles business entity registration and corporate compliance.',
        authority_level: 'Secondary',
        crypto_scope: 'Limited',
        contact_email: 'acra_feedback@acra.gov.sg',
        reporting_api_available: false
      },
      {
        name: 'Singapore Police Force – Suspicious Transaction Reporting Office (STRO)',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://www.police.gov.sg',
        description: 'National FIU for filing STRs related to money laundering, fraud, and terrorism financing.',
        authority_level: 'Secondary',
        crypto_scope: 'AML/CTF',
        contact_email: null,
        reporting_api_available: false
      }
    ];

    // Insert regulatory bodies
    for (const body of regulatoryBodies) {
      const [inserted] = await db.insert(regulatory_bodies).values(body).returning();
      console.log(`Added regulatory body: ${body.name} with ID: ${inserted.id}`);
    }

    return insertedJurisdiction;
  } catch (error) {
    console.error('Error seeding Singapore jurisdiction:', error);
    throw error;
  }
}

// Execute the function if this script is run directly
const isMainModule = import.meta.url === `file://${fileURLToPath(process.argv[1])}`;
if (isMainModule) {
  seedSingaporeJurisdiction()
    .then(() => {
      console.log('Singapore jurisdiction seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding Singapore jurisdiction:', error);
      process.exit(1);
    });
}

export { seedSingaporeJurisdiction };