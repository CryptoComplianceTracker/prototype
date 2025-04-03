/**
 * Core script that adds Singapore to the database
 * This avoids ES module import issues by using a simpler approach
 */
import { db } from '../server/db';
import { jurisdictions, regulatory_bodies, laws, InsertJurisdiction } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedSingaporeCore() {
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

// Add laws and other regulatory data for Singapore
async function seedSingaporeDetails(jurisdictionId: number) {
  console.log('Seeding Singapore regulatory details...');

  try {
    if (!jurisdictionId) {
      throw new Error('No jurisdiction ID provided');
    }

    console.log(`Using Singapore jurisdiction ID: ${jurisdictionId}`);

    // 1. Add Singapore Laws
    const singaporeLaws = [
      {
        jurisdiction_id: jurisdictionId,
        title: 'Payment Services Act (PSA)',
        type: 'Licensing, AML',
        effective_date: new Date('2020-01-28'),
        source_url: 'https://www.mas.gov.sg/regulation/acts/payment-services-act',
        description: 'Governs licensing for Digital Payment Token (DPT) services including exchanges, custodians, and wallet providers.',
        is_active: true
      },
      {
        jurisdiction_id: jurisdictionId,
        title: 'AML/CFT Notices 626 & 824',
        type: 'AML',
        effective_date: new Date('2020-01-28'),
        source_url: 'https://www.mas.gov.sg/regulation/notices/notice-ps-n02-prevention-of-money-laundering-and-countering-the-financing-of-terrorism',
        description: 'Mandatory AML program requirements for all regulated DPT providers. Covers KYC, CDD, ongoing monitoring, STR filing.',
        is_active: true
      },
      {
        jurisdiction_id: jurisdictionId,
        title: 'MAS Stablecoin Regulatory Framework (2023)',
        type: 'Stablecoin regulation',
        effective_date: new Date('2023-08-15'),
        source_url: 'https://www.mas.gov.sg/regulation/stablecoin-framework',
        description: 'Regulates SCS (Single-Currency Stablecoins), including reserve requirements, redemptions, and audits.',
        is_active: true
      }
    ];

    for (const law of singaporeLaws) {
      const [inserted] = await db.insert(laws).values(law).returning();
      console.log(`Added law: ${law.title} with ID: ${inserted.id}`);
    }

    console.log('Successfully seeded Singapore regulatory details');
    return true;
  } catch (error) {
    console.error('Error seeding Singapore details:', error);
    throw error;
  }
}

// Main function to seed all Singapore data
async function seedSingapore() {
  try {
    // First add the jurisdiction and regulatory bodies
    const singapore = await seedSingaporeCore();
    
    if (!singapore || !singapore.id) {
      throw new Error('Failed to seed Singapore jurisdiction');
    }
    
    // Then add detailed information
    await seedSingaporeDetails(singapore.id);
    
    console.log('✅ Successfully seeded Singapore data');
    return true;
  } catch (error) {
    console.error('Error seeding Singapore data:', error);
    return false;
  }
}

// Only export this function
export default seedSingapore;