import { db } from "../server/db";
import {
  jurisdictions, regulatory_bodies, regulations, compliance_requirements,
  taxation_rules, reporting_obligations, regulatory_updates, jurisdiction_tags,
  jurisdiction_query_keywords
} from "../shared/schema";

async function importSwitzerland() {
  try {
    console.log("Directly importing Switzerland data to database...");
    
    // Insert Switzerland jurisdiction
    const [jurisdiction] = await db.insert(jurisdictions).values({
      name: "Switzerland",
      region: "Europe",
      risk_level: "Low",
      favorability_score: 92,
      notes: "Switzerland is home to \"Crypto Valley\" (Zug), and offers a clear regulatory framework for blockchain innovation. It supports tokenized assets, DAOs, and stablecoins."
    }).returning();
    
    console.log(`Created jurisdiction: ${jurisdiction.name} with ID: ${jurisdiction.id}`);
    
    // Insert regulatory bodies
    const regBodyPromise = db.insert(regulatory_bodies).values({
      jurisdiction_id: jurisdiction.id,
      name: "Swiss Financial Market Supervisory Authority (FINMA)",
      website_url: "https://www.finma.ch",
      description: "FINMA regulates financial markets in Switzerland and provides token classification and licensing guidelines for blockchain/crypto companies."
    });
    
    // Insert regulations
    const regPromises = [
      db.insert(regulations).values({
        jurisdiction_id: jurisdiction.id,
        title: "FINMA ICO Guidelines",
        type: "ICO, Token Classification",
        description: "Classifies tokens into three types: payment, utility, and asset tokens. Provides guidance on when a token constitutes a security.",
        compliance_url: "https://www.finma.ch/en/news/2018/02/20180216-mm-ico-wegleitung/",
        effective_date: new Date("2018-02-16"),
        last_updated: new Date("2023-08-01")
      }),
      db.insert(regulations).values({
        jurisdiction_id: jurisdiction.id,
        title: "Financial Institutions Act (FinIA)",
        type: "Licensing, Custody",
        description: "Regulates independent asset managers and fintech companies, including crypto custody providers.",
        compliance_url: "https://www.finma.ch/en/authorisation/financial-institutions-and-financial-service-providers/",
        effective_date: new Date("2020-01-01"),
        last_updated: new Date("2024-06-01")
      }),
      db.insert(regulations).values({
        jurisdiction_id: jurisdiction.id,
        title: "DLT Framework Amendments",
        type: "DLT, Asset Tokenization, DAOs",
        description: "Introduced a new license type for trading platforms dealing exclusively with DLT securities.",
        compliance_url: "https://www.sif.admin.ch/sif/en/home/finanzmarktpolitik/digitalisation-of-the-financial-sector/blockchain-and-dlt.html",
        effective_date: new Date("2021-08-01"),
        last_updated: new Date("2024-03-01")
      })
    ];
    
    // Insert compliance requirements
    const compPromises = [
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "KYC",
        summary: "Required for all ICOs and crypto exchanges. Companies must verify the identity of users. Applies to payment and asset tokens."
      }),
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "AML",
        summary: "Entities must file Suspicious Activity Reports (SARs) and register under AMLA."
      }),
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "Token Classification",
        summary: "Companies must classify tokens and determine whether securities law applies, based on FINMA's framework."
      }),
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "Custody Regulation",
        summary: "Crypto custody providers require a FinIA license."
      }),
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "Client Asset Segregation",
        summary: "Required under the DLT regulations for platform operators."
      }),
      db.insert(compliance_requirements).values({
        jurisdiction_id: jurisdiction.id,
        requirement_type: "Banking License (optional)",
        summary: "Necessary for crypto firms offering interest-bearing accounts or taking deposits."
      })
    ];
    
    // Insert taxation rule
    const taxPromise = db.insert(taxation_rules).values({
      jurisdiction_id: jurisdiction.id,
      income_tax_applicable: true,
      capital_gains_tax: false,
      vat_applicable: false,
      tax_description: "Private investors are not subject to capital gains tax. Mining income, staking rewards, and crypto used in business operations are subject to income tax.",
      tax_authority_url: "https://www.estv.admin.ch/estv/en/home.html",
      last_updated: new Date("2024-05-01")
    });
    
    // Insert reporting obligations
    const reportPromises = [
      db.insert(reporting_obligations).values({
        jurisdiction_id: jurisdiction.id,
        type: "Suspicious Activity Reporting (SAR)",
        frequency: "Real-time",
        submission_url: "https://www.fedpol.admin.ch/fedpol/en/home/kriminalitaet/geldwaescherei/meldung.html",
        penalties: "Up to CHF 500,000 fine, license suspension or revocation",
        last_reviewed: new Date("2024-12-31")
      }),
      db.insert(reporting_obligations).values({
        jurisdiction_id: jurisdiction.id,
        type: "Periodic Compliance Reporting",
        frequency: "Annually",
        submission_url: "https://www.finma.ch/en/monitoring/",
        penalties: "License suspension, additional requirements",
        last_reviewed: new Date("2024-12-31")
      })
    ];
    
    // Insert regulatory updates
    const updatePromises = [
      db.insert(regulatory_updates).values({
        jurisdiction_id: jurisdiction.id,
        update_title: "FINMA expands tokenization sandbox",
        update_date: new Date("2025-01-15"),
        summary: "FINMA has broadened its sandbox license to allow non-banks to issue and manage tokenized securities up to CHF 2 million in customer assets.",
        source: "FINMA Newsroom"
      }),
      db.insert(regulatory_updates).values({
        jurisdiction_id: jurisdiction.id,
        update_title: "AML 6th Directive Compliance",
        update_date: new Date("2024-10-05"),
        summary: "Switzerland has updated AML rules to align with the 6th EU Directive. Expanded obligations for VASPs (Virtual Asset Service Providers).",
        source: "Swiss AML Updates"
      }),
      db.insert(regulatory_updates).values({
        jurisdiction_id: jurisdiction.id,
        update_title: "ESG Disclosure Guidance",
        update_date: new Date("2024-07-20"),
        summary: "New FINMA guidance suggests crypto firms disclose ESG impact in whitepapers or investor disclosures.",
        source: "FINMA Guidelines"
      })
    ];
    
    // Insert tags
    const tagPromises = ["ICO", "TokenClassification", "KYCAML", "DLT", "Custody", "TaxExempt", "FINMA"].map(tag => 
      db.insert(jurisdiction_tags).values({
        jurisdiction_id: jurisdiction.id,
        tag
      })
    );
    
    // Insert keywords
    const keywordPromises = [
      "Token Security Classification Switzerland",
      "Crypto Taxation Swiss Individuals",
      "DLT License Zug",
      "FINMA AML reporting"
    ].map(keyword => 
      db.insert(jurisdiction_query_keywords).values({
        jurisdiction_id: jurisdiction.id,
        keyword
      })
    );
    
    // Execute all insert promises
    await Promise.all([
      regBodyPromise,
      ...regPromises,
      ...compPromises,
      taxPromise,
      ...reportPromises,
      ...updatePromises,
      ...tagPromises,
      ...keywordPromises
    ]);
    
    console.log("Switzerland data imported successfully");
    
  } catch (error) {
    console.error("Error importing Switzerland data:", error);
  }
}

importSwitzerland()
  .then(() => {
    console.log("Import process completed");
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to complete import:", err);
    process.exit(1);
  });