/**
 * This script seeds detailed Singapore regulatory data including laws, 
 * compliance requirements, taxation rules, and reporting obligations
 */
import { db } from '../server/db';
import { 
  jurisdictions, 
  laws, 
  compliance_requirements, 
  taxation_rules,
  reporting_obligations,
  regulatory_updates,
  jurisdiction_tags
} from '../shared/schema';
import { seedSingaporeJurisdiction } from './seed-singapore-jurisdiction';
import { fileURLToPath } from 'url';

async function seedSingaporeDetails() {
  console.log('Seeding Singapore regulatory details...');

  try {
    // First ensure the Singapore jurisdiction exists
    const singapore = await seedSingaporeJurisdiction();
    
    if (!singapore || !singapore.id) {
      throw new Error('Failed to seed or retrieve Singapore jurisdiction');
    }

    const jurisdictionId = singapore.id;
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

    // 2. Add Singapore Compliance Requirements
    // Due to schema issues, we need to match the exact schema structure
    // Get the schema structure first from an existing record
    const complianceSchema = await db.select().from(compliance_requirements).limit(1);
    console.log('Compliance requirements schema structure:', Object.keys(complianceSchema[0] || {}));
    
    // Adapt our data to match the schema
    // For now just adding the requirement_type and summary fields to match schema
    for (const requirement of [
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'Licensing',
        summary: 'DPT License (under PSA)',
        description: 'Required for exchanges, custodians, OTC desks, and payment apps dealing with crypto.',
      },
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'AML/CTF',
        summary: 'AML Program',
        description: 'Includes CDD, screening (PEP, sanctions), EDD for high-risk clients, transaction monitoring, recordkeeping.',
      },
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'AML/CTF',
        summary: 'Travel Rule Implementation',
        description: 'Must comply with FATF Travel Rule — originator and beneficiary info required for DPT transfers ≥ S$1,500.',
      },
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'Risk Management',
        summary: 'Risk-Based Assessment',
        description: 'Pre-launch risk assessments must be documented and submitted to MAS upon request.',
      },
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'Governance',
        summary: 'Ongoing Compliance Officer',
        description: 'Firms must designate a Compliance Officer with adequate AML/CFT training.',
      },
      {
        jurisdiction_id: jurisdictionId,
        requirement_type: 'Stablecoin Regulation',
        summary: 'Stablecoin Issuer Requirements',
        description: 'Includes reserve segregation, independent audits, and redemption guarantees.',
      }
    ]) {
      const [inserted] = await db.insert(compliance_requirements).values(requirement).returning();
      console.log(`Added compliance requirement: ${requirement.summary} with ID: ${inserted.id}`);
    }

    // 3. Add Singapore Taxation Rules
    const taxationRule = {
      jurisdiction_id: jurisdictionId,
      income_tax_applicable: true,
      income_tax_rate: '0-22%',
      capital_gains_tax: false,
      capital_gains_rate: null,
      vat_applicable: false,
      vat_rate: null,
      description: 'Individuals holding crypto for personal investment are not taxed. Companies must report income from crypto business.',
      tax_authority: 'Inland Revenue Authority of Singapore (IRAS)',
      tax_authority_url: 'https://www.iras.gov.sg/irashome/Businesses/Companies/Working-out-Corporate-Income-Taxes/Specific-topics/Income-Tax-Treatment-of-Digital-Tokens/',
      last_updated: new Date()
    };

    const [insertedTax] = await db.insert(taxation_rules).values(taxationRule).returning();
    console.log(`Added taxation rule with ID: ${insertedTax.id}`);

    // 4. Add Singapore Reporting Obligations
    // Check schema structure for reporting obligations
    const reportingSchema = await db.select().from(reporting_obligations).limit(1);
    console.log('Reporting obligations schema structure:', Object.keys(reportingSchema[0] || {}));
    
    // Adapt to schema structure
    for (const obligation of [
      {
        jurisdiction_id: jurisdictionId,
        type: 'Suspicious Transaction Reports (STRs)',
        frequency: 'As needed',
        submission_url: 'https://www.police.gov.sg/sonar',
        description: 'Required for any suspected criminal activity or AML breach. Submit to STRO via online portal.',
        penalties: 'Criminal penalties for non-reporting',
      },
      {
        jurisdiction_id: jurisdictionId,
        type: 'Regulatory Filings to MAS',
        frequency: 'Monthly/Quarterly',
        submission_url: 'https://www.mas.gov.sg/portal',
        description: 'Volume reports, complaints, AML audit findings, and business activity summaries.',
        penalties: 'Fines and possible license revocation',
      },
      {
        jurisdiction_id: jurisdictionId,
        type: 'Incident Reporting (Cyber/Risk Events)',
        frequency: 'Immediate (within 1 day)',
        submission_url: 'https://www.mas.gov.sg/incident-reporting',
        description: 'MAS must be informed of hacks, breaches, or major risks affecting DPT services.',
        penalties: 'License suspension for non-compliance',
      },
      {
        jurisdiction_id: jurisdictionId,
        type: 'Audit Reports (Stablecoins)',
        frequency: 'Annual',
        submission_url: 'https://www.mas.gov.sg/stablecoin-oversight',
        description: 'Required for licensed SCS issuers, covering reserve audits and redemptions.',
        penalties: 'Regulatory action and potential delisting',
      }
    ]) {
      const [inserted] = await db.insert(reporting_obligations).values(obligation).returning();
      console.log(`Added reporting obligation: ${obligation.type} with ID: ${inserted.id}`);
    }

    // 5. Add Singapore Regulatory Updates
    // Check schema structure for regulatory updates
    const updatesSchema = await db.select().from(regulatory_updates).limit(1);
    console.log('Regulatory updates schema structure:', Object.keys(updatesSchema[0] || {}));
    
    // Adapt to schema structure
    for (const update of [
      {
        jurisdiction_id: jurisdictionId,
        update_title: 'MAS Stablecoin Framework Released',
        update_date: new Date('2023-08-15'),
        description: 'Introduces regulatory regime for stablecoin issuers (SCS), covering 1:1 backing, audits, and redemption rights.',
        source: 'https://www.mas.gov.sg/news/press-releases/2023/mas-releases-regulatory-framework-for-stablecoin-issuers',
      },
      {
        jurisdiction_id: jurisdictionId,
        update_title: 'Travel Rule Enforcement Begins',
        update_date: new Date('2024-04-01'),
        description: 'MAS mandates full implementation of FATF-compliant Travel Rule for DPT transfers.',
        source: 'https://www.mas.gov.sg',
      },
      {
        jurisdiction_id: jurisdictionId,
        update_title: 'Licensing Tightened for Custodians',
        update_date: new Date('2023-09-01'),
        description: 'MAS expanded risk management standards for crypto custodians, including insurance and asset segregation.',
        source: 'https://www.mas.gov.sg',
      }
    ]) {
      const [inserted] = await db.insert(regulatory_updates).values(update).returning();
      console.log(`Added regulatory update: ${update.update_title} with ID: ${inserted.id}`);
    }

    // 6. Add Singapore Tags
    const singaporeTags = [
      'MAS', 'PSA', 'DPT', 'Stablecoin', 'AML', 'STR', 'TravelRule', 
      'LowRisk', 'NoCapitalGains', 'APAC', 'RegTechFriendly'
    ];

    for (const tag of singaporeTags) {
      await db.insert(jurisdiction_tags).values({
        jurisdiction_id: jurisdictionId,
        tag: tag
      });
      console.log(`Added tag: ${tag}`);
    }

    console.log('Successfully seeded Singapore regulatory details');
    return true;
  } catch (error) {
    console.error('Error seeding Singapore details:', error);
    throw error;
  }
}

// Execute the function if this script is run directly
const isMainModule = import.meta.url === `file://${fileURLToPath(process.argv[1])}`;
if (isMainModule) {
  seedSingaporeDetails()
    .then(() => {
      console.log('Singapore regulatory details seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding Singapore details:', error);
      process.exit(1);
    });
}

export { seedSingaporeDetails };