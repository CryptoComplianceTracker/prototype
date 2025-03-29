import { db } from '../server/db';
import { 
  jurisdictions, regulatory_bodies, regulations, compliance_requirements, 
  taxation_rules, reporting_obligations, regulatory_updates, jurisdiction_tags, 
  jurisdiction_query_keywords, laws, organizations, obligations
} from '../shared/schema';

async function importEnhancedSwitzerlandData() {
  console.log('Starting Switzerland data import with enhanced schema...');

  try {
    // 1. First, insert the jurisdiction record for Switzerland
    const [switzerlandJurisdiction] = await db.insert(jurisdictions)
      .values({
        name: 'Switzerland',
        region: 'Europe',
        iso_code: 'CH',
        currency_code: 'CHF',
        is_fatf_member: true,
        risk_level: 'Low',
        favorability_score: 92,
        legal_system_type: 'Civil law',
        national_language: 'German, French, Italian, Romansh',
        central_bank_url: 'https://www.snb.ch/',
        financial_licensing_portal: 'https://www.finma.ch/en/authorisation/',
        contact_email: 'info@finma.ch',
        notes: 'Switzerland is home to "Crypto Valley" (Zug), and offers a clear regulatory framework for blockchain innovation. It supports tokenized assets, DAOs, and stablecoins.',
        created_at: new Date(),
        updated_at: new Date(),
        last_updated: new Date()
      })
      .returning();

    console.log(`Added Switzerland jurisdiction with ID: ${switzerlandJurisdiction.id}`);

    // 2. Insert the regulatory body (FINMA) with enhanced fields
    const [finma] = await db.insert(regulatory_bodies)
      .values({
        name: 'Swiss Financial Market Supervisory Authority (FINMA)',
        jurisdiction_id: switzerlandJurisdiction.id,
        website_url: 'https://www.finma.ch',
        description: 'FINMA regulates financial markets in Switzerland and provides token classification and licensing guidelines for blockchain/crypto companies.',
        contact_email: 'info@finma.ch',
        phone_number: '+41 31 327 91 00',
        crypto_scope: 'ICOs, exchanges, custody, stablecoins, securities tokens',
        authority_level: 'National',
        reporting_api_available: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    console.log(`Added FINMA regulatory body with ID: ${finma.id}`);

    // 3. Insert laws (enhanced regulation data)
    const lawsData = [
      {
        title: 'FINMA ICO Guidelines',
        abbreviation: 'ICO-GL',
        law_type: 'Guideline',
        jurisdiction_id: switzerlandJurisdiction.id,
        regulatory_body_id: finma.id,
        effective_date: new Date('2018-02-16'),
        last_updated: new Date('2023-08-01'),
        legal_category: 'Regulatory Guideline',
        description: 'Classifies tokens into three types: payment, utility, and asset tokens. Provides guidance on when a token constitutes a security.',
        applicability: 'ICO issuers, token creators, exchanges listing new tokens',
        full_text_link: 'https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/faktenblaetter/faktenblatt-ico.pdf?la=en',
        source_url: 'https://www.finma.ch/en/news/2018/02/20180216-mm-ico-wegleitung/',
        source_language: 'English, German, French, Italian'
      },
      {
        title: 'Financial Institutions Act',
        abbreviation: 'FinIA',
        law_type: 'Legislation',
        jurisdiction_id: switzerlandJurisdiction.id,
        regulatory_body_id: finma.id,
        effective_date: new Date('2020-01-01'),
        last_updated: new Date('2024-06-01'),
        legal_category: 'Federal Act',
        description: 'Regulates independent asset managers and fintech companies, including crypto custody providers.',
        applicability: 'Crypto custodians, asset managers, broker-dealers',
        full_text_link: 'https://www.fedlex.admin.ch/eli/cc/2018/801/en',
        source_url: 'https://www.finma.ch/en/authorisation/financial-institutions-and-financial-market-infrastructures/institute/',
        source_language: 'German, French, Italian, English'
      },
      {
        title: 'DLT Framework Amendments',
        abbreviation: 'DLT-FA',
        law_type: 'Legislation',
        jurisdiction_id: switzerlandJurisdiction.id,
        regulatory_body_id: finma.id,
        effective_date: new Date('2021-08-01'),
        last_updated: new Date('2024-03-01'),
        legal_category: 'Federal Act Amendment',
        description: 'Introduced a new license type for trading platforms dealing exclusively with DLT securities.',
        applicability: 'Crypto exchanges, DLT trading facilities, tokenized securities issuers',
        full_text_link: 'https://www.fedlex.admin.ch/eli/cc/2021/33/en',
        source_url: 'https://www.admin.ch/gov/en/start/documentation/media-releases.msg-id-81563.html',
        source_language: 'German, French, Italian, English'
      }
    ];

    const insertedLaws = await db.insert(laws)
      .values(lawsData)
      .returning();

    console.log(`Added ${insertedLaws.length} laws`);

    // 4. Insert regulations (keep for backward compatibility)
    const regulationsData = [
      {
        title: 'FINMA ICO Guidelines',
        type: 'ICO, Token Classification',
        description: 'Classifies tokens into three types: payment, utility, and asset tokens. Provides guidance on when a token constitutes a security.',
        compliance_url: 'https://www.finma.ch/en/news/2018/02/20180216-mm-ico-wegleitung/',
        effective_date: new Date('2018-02-16'),
        last_updated: new Date('2023-08-01'),
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        title: 'Financial Institutions Act (FinIA)',
        type: 'Licensing, Custody',
        description: 'Regulates independent asset managers and fintech companies, including crypto custody providers.',
        compliance_url: 'https://www.finma.ch/en/authorisation/financial-institutions-and-financial-market-infrastructures/institute/',
        effective_date: new Date('2020-01-01'),
        last_updated: new Date('2024-06-01'),
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        title: 'DLT Framework Amendments',
        type: 'DLT, Asset Tokenization, DAOs',
        description: 'Introduced a new license type for trading platforms dealing exclusively with DLT securities.',
        compliance_url: 'https://www.admin.ch/gov/en/start/documentation/media-releases.msg-id-81563.html',
        effective_date: new Date('2021-08-01'),
        last_updated: new Date('2024-03-01'),
        jurisdiction_id: switzerlandJurisdiction.id
      }
    ];

    const insertedRegulations = await db.insert(regulations)
      .values(regulationsData)
      .returning();

    console.log(`Added ${insertedRegulations.length} regulations for backward compatibility`);

    // 5. Insert obligations (enhanced compliance requirements)
    const obligationsData = [
      {
        title: 'KYC Verification for Payment Token Users',
        description: 'Required for all exchanges and wallets handling payment tokens. Companies must verify the identity of users through a formal KYC process.',
        jurisdiction_id: switzerlandJurisdiction.id,
        law_id: insertedLaws[0].id, // FINMA ICO Guidelines
        obligation_type: 'KYC',
        frequency: 'Once per client plus periodic review',
        format: 'Standardized',
        delivery_method: 'Internal records',
        submission_url: null,
        escalation_policy: 'Unverified users must have transactions blocked',
        penalty_type: 'Monetary fine',
        penalty_amount: '50000',
        threshold_condition: 'All clients, regardless of transaction amount',
        is_active: true
      },
      {
        title: 'AML Suspicious Activity Reporting',
        description: 'Entities must file Suspicious Activity Reports (SARs) for suspicious transactions and register under AMLA.',
        jurisdiction_id: switzerlandJurisdiction.id,
        law_id: insertedLaws[0].id, // FINMA ICO Guidelines
        obligation_type: 'AML',
        frequency: 'Real-time',
        format: 'Online form',
        delivery_method: 'API or web portal',
        submission_url: 'https://www.fedpol.admin.ch/fedpol/en/home/kriminalitaet/geldwaescherei/meldung.html',
        escalation_policy: 'Must be reported within 24 hours of detection',
        penalty_type: 'Monetary and criminal',
        penalty_amount: '500000',
        threshold_condition: 'Any suspicious transaction regardless of amount',
        is_active: true
      },
      {
        title: 'DLT Trading Platform Licensing',
        description: 'Entities facilitating the trading of tokenized securities must obtain a DLT Trading Facility license.',
        jurisdiction_id: switzerlandJurisdiction.id,
        law_id: insertedLaws[2].id, // DLT Framework Amendments
        obligation_type: 'Licensing',
        frequency: 'Once, then annual renewal',
        format: 'Application form with documentation',
        delivery_method: 'Electronic submission',
        submission_url: 'https://www.finma.ch/en/authorisation/fintech/dlt-trading-facility/',
        penalty_type: 'Cease and desist',
        threshold_condition: 'Any platform facilitating the exchange of security tokens',
        is_active: true
      }
    ];

    const insertedObligations = await db.insert(obligations)
      .values(obligationsData)
      .returning();

    console.log(`Added ${insertedObligations.length} obligations`);

    // 6. Insert compliance requirements (for backward compatibility)
    const complianceRequirementsData = [
      {
        requirement_type: 'KYC',
        summary: 'Required for all ICOs and crypto exchanges. Companies must verify the identity of users. Applies to payment and asset tokens.',
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        requirement_type: 'AML',
        summary: 'Entities must file Suspicious Activity Reports (SARs) and register under AMLA.',
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        requirement_type: 'Token Classification',
        summary: 'Companies must classify tokens and determine whether securities law applies, based on FINMA\'s framework.',
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        requirement_type: 'Custody Regulation',
        summary: 'Crypto custody providers require a FinIA license.',
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        requirement_type: 'Client Asset Segregation',
        summary: 'Required under the DLT regulations for platform operators.',
        jurisdiction_id: switzerlandJurisdiction.id
      },
      {
        requirement_type: 'Banking License (optional)',
        summary: 'Necessary for crypto firms offering interest-bearing accounts or taking deposits.',
        jurisdiction_id: switzerlandJurisdiction.id
      }
    ];

    const insertedComplianceRequirements = await db.insert(compliance_requirements)
      .values(complianceRequirementsData)
      .returning();

    console.log(`Added ${insertedComplianceRequirements.length} compliance requirements for backward compatibility`);

    // 7. Insert taxation rules
    const [taxationRules] = await db.insert(taxation_rules)
      .values({
        jurisdiction_id: switzerlandJurisdiction.id,
        income_tax_applicable: true,
        capital_gains_tax: false,
        vat_applicable: false,
        tax_description: 'Private investors are not subject to capital gains tax. Mining income, staking rewards, and crypto used in business operations are subject to income tax.',
        tax_authority_url: 'https://www.estv.admin.ch/estv/en/home.html',
        last_updated: new Date('2024-05-01')
      })
      .returning();

    console.log(`Added taxation rules with ID: ${taxationRules.id}`);

    // 8. Insert reporting obligations
    const [reportingObligation] = await db.insert(reporting_obligations)
      .values({
        jurisdiction_id: switzerlandJurisdiction.id,
        type: 'Suspicious Activity Reporting (SAR), Periodic Compliance Reporting',
        frequency: 'Real-time (SAR), Annually (compliance audit if licensed)',
        submission_url: 'https://www.fedpol.admin.ch/fedpol/en/home/kriminalitaet/geldwaescherei/meldung.html',
        penalties: 'Up to CHF 500,000 fine, license suspension or revocation',
        last_reviewed: new Date('2024-12-31')
      })
      .returning();

    console.log(`Added reporting obligation with ID: ${reportingObligation.id}`);

    // 9. Insert regulatory updates
    const regulatoryUpdatesData = [
      {
        jurisdiction_id: switzerlandJurisdiction.id,
        update_title: 'FINMA expands tokenization sandbox',
        update_date: new Date('2025-03-15'),
        summary: 'FINMA has broadened its sandbox license to allow non-banks to issue and manage tokenized securities up to CHF 2 million in customer assets.',
        source: 'FINMA Newsroom'
      },
      {
        jurisdiction_id: switzerlandJurisdiction.id,
        update_title: 'AML 6th Directive Compliance',
        update_date: new Date('2024-10-01'),
        summary: 'Switzerland has updated AML rules to align with the 6th EU Directive. Expanded obligations for VASPs (Virtual Asset Service Providers).',
        source: 'Swiss AML Updates'
      },
      {
        jurisdiction_id: switzerlandJurisdiction.id,
        update_title: 'ESG Disclosure Guidance',
        update_date: new Date('2024-07-15'),
        summary: 'New FINMA guidance suggests crypto firms disclose ESG impact in whitepapers or investor disclosures.',
        source: 'FINMA Guidelines'
      }
    ];

    const insertedRegulatoryUpdates = await db.insert(regulatory_updates)
      .values(regulatoryUpdatesData)
      .returning();

    console.log(`Added ${insertedRegulatoryUpdates.length} regulatory updates`);

    // 10. Insert jurisdiction tags
    const tagsData = [
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'ICO' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'TokenClassification' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'KYCAML' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'DLT' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'Custody' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'TaxExempt' },
      { jurisdiction_id: switzerlandJurisdiction.id, tag: 'FINMA' }
    ];

    const insertedTags = await db.insert(jurisdiction_tags)
      .values(tagsData)
      .returning();

    console.log(`Added ${insertedTags.length} jurisdiction tags`);

    // 11. Insert jurisdiction query keywords
    const keywordsData = [
      { jurisdiction_id: switzerlandJurisdiction.id, keyword: "Token Security Classification Switzerland" },
      { jurisdiction_id: switzerlandJurisdiction.id, keyword: "Crypto Taxation Swiss Individuals" },
      { jurisdiction_id: switzerlandJurisdiction.id, keyword: "DLT License Zug" },
      { jurisdiction_id: switzerlandJurisdiction.id, keyword: "FINMA AML reporting" }
    ];

    const insertedKeywords = await db.insert(jurisdiction_query_keywords)
      .values(keywordsData)
      .returning();

    console.log(`Added ${insertedKeywords.length} jurisdiction query keywords`);

    // 12. Insert a sample organization
    const [organization] = await db.insert(organizations)
      .values({
        name: 'Crypto Valley Association',
        incorporation_country: 'Switzerland',
        main_exchange_token: null,
        regulatory_classification: 'Industry Association',
        onboarding_date: new Date('2017-03-01'),
        website_url: 'https://cryptovalley.swiss/',
        contact_email: 'info@cryptovalley.swiss'
      })
      .returning();

    console.log(`Added sample organization with ID: ${organization.id}`);

    console.log('Switzerland data import with enhanced schema completed successfully!');
    
    return {
      success: true,
      message: 'Switzerland data imported successfully with enhanced schema'
    };
  } catch (error) {
    console.error('Error importing Switzerland data:', error);
    return {
      success: false,
      message: `Import failed: ${(error as Error).message}`
    };
  }
}

// Execute if this script is run directly
// For ESM compatibility
importEnhancedSwitzerlandData()
  .then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error during import:', err);
    process.exit(1);
  });

export { importEnhancedSwitzerlandData };