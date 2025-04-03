/**
 * Core script that adds Estonia to the database
 * This handles jurisdiction, regulatory bodies, laws and other relevant data
 */
import { db } from '../server/db';
import { jurisdictions, regulatory_bodies, laws, InsertJurisdiction } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedEstoniaCore() {
  console.log('Seeding Estonia jurisdiction...');

  try {
    // Check if Estonia already exists to avoid duplicate entries
    const existingEstonia = await db.select().from(jurisdictions).where(
      eq(jurisdictions.name, 'Estonia')
    );

    if (existingEstonia.length > 0) {
      console.log('Estonia jurisdiction already exists:', existingEstonia[0].id);
      return existingEstonia[0];
    }

    // Estonia jurisdiction data
    const estoniaData: InsertJurisdiction = {
      name: 'Estonia',
      region: 'Europe',
      iso_code: 'EE',
      risk_level: 'Low',
      favorability_score: 75,
      notes: 'Estonia is one of the EU\'s earliest adopters of crypto licensing frameworks. After regulatory tightening in 2022–2023, Estonia now enforces strict compliance rules for crypto custodians, exchanges, and wallet providers. Legal entities must maintain an actual presence in Estonia with robust AML programs.',
      currency_code: 'EUR',
      is_fatf_member: true,
      legal_system_type: 'Civil Law',
      national_language: 'Estonian',
      central_bank_url: 'https://www.eestipank.ee/en',
      financial_licensing_portal: 'https://fiu.ee',
      contact_email: 'info@fiu.ee',
    };

    // Insert Estonia jurisdiction
    const [insertedJurisdiction] = await db.insert(jurisdictions).values(estoniaData).returning();
    console.log('Estonia jurisdiction added with ID:', insertedJurisdiction.id);

    // Regulatory bodies for Estonia
    const regulatoryBodies = [
      {
        name: 'Estonian Financial Intelligence Unit (FIU)',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://fiu.ee',
        description: 'Estonia\'s national AML authority, responsible for licensing and oversight of crypto service providers.',
        authority_level: 'Primary',
        crypto_scope: 'Comprehensive',
        contact_email: 'info@fiu.ee',
        reporting_api_available: true
      },
      {
        name: 'Estonian Ministry of Finance',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://fin.ee',
        description: 'Handles financial sector policies and proposals including crypto law reforms.',
        authority_level: 'Secondary',
        crypto_scope: 'Policy',
        contact_email: 'info@fin.ee',
        reporting_api_available: false
      },
      {
        name: 'Tax and Customs Board (EMTA)',
        jurisdiction_id: insertedJurisdiction.id,
        website_url: 'https://emta.ee',
        description: 'Oversees taxation of crypto assets for individuals and businesses.',
        authority_level: 'Secondary',
        crypto_scope: 'Taxation',
        contact_email: 'info@emta.ee',
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
    console.error('Error seeding Estonia jurisdiction:', error);
    throw error;
  }
}

// Add laws and other regulatory data for Estonia
async function seedEstoniaDetails(jurisdictionId: number) {
  console.log('Seeding Estonia regulatory details...');

  try {
    if (!jurisdictionId) {
      throw new Error('No jurisdiction ID provided');
    }

    console.log(`Using Estonia jurisdiction ID: ${jurisdictionId}`);

    // 1. Add Estonia Laws
    const estoniaLaws = [
      {
        jurisdiction_id: jurisdictionId,
        title: 'Virtual Currency Service Provider Act (updated 2023)',
        type: 'Licensing, AML',
        effective_date: new Date('2023-01-01'),
        source_url: 'https://fiu.ee',
        description: 'Governs wallet services, custodians, exchanges. Requires AML/KYC programs, risk assessments, and local presence.',
        is_active: true
      },
      {
        jurisdiction_id: jurisdictionId,
        title: 'EU AMLD (Anti-Money Laundering Directives)',
        type: 'EU alignment',
        effective_date: new Date('2021-01-01'),
        source_url: 'https://ec.europa.eu/info/business-economy-euro/banking-and-finance/financial-supervision-and-risk-management/anti-money-laundering-and-counter-terrorist-financing_en',
        description: 'Estonia aligns with the latest AMLD standards from the EU, including AMLD5 and AMLD6.',
        is_active: true
      },
      {
        jurisdiction_id: jurisdictionId,
        title: 'Commercial Code Revisions (2022)',
        type: 'Company law',
        effective_date: new Date('2022-01-01'),
        source_url: 'https://www.riigiteataja.ee/en/',
        description: 'Requires VCSPs to have physical office space, local directors, and minimum share capital (€100,000).',
        is_active: true
      }
    ];

    for (const law of estoniaLaws) {
      const [inserted] = await db.insert(laws).values(law).returning();
      console.log(`Added law: ${law.title} with ID: ${inserted.id}`);
    }

    // Could add more details like compliance requirements, taxation rules, etc.
    // These would need additional tables in the schema

    console.log('Successfully seeded Estonia regulatory details');
    return true;
  } catch (error) {
    console.error('Error seeding Estonia details:', error);
    throw error;
  }
}

// Main function to seed all Estonia data
async function seedEstonia() {
  try {
    // First add the jurisdiction and regulatory bodies
    const estonia = await seedEstoniaCore();
    
    if (!estonia || !estonia.id) {
      throw new Error('Failed to seed Estonia jurisdiction');
    }
    
    // Then add detailed information
    await seedEstoniaDetails(estonia.id);
    
    console.log('✅ Successfully seeded Estonia data');
    return true;
  } catch (error) {
    console.error('Error seeding Estonia data:', error);
    return false;
  }
}

// Export the main seeding function
export default seedEstonia;