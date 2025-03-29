import { db } from "../server/db";
import { jurisdictions, regulatory_bodies, regulations, compliance_requirements, 
         taxation_rules, reporting_obligations, regulatory_updates, jurisdiction_tags } from "../shared/schema";

async function importUaeData() {
  try {
    console.log("Starting UAE jurisdiction data import...");

    // 1. Insert main jurisdiction record
    const [jurisdiction] = await db.insert(jurisdictions).values({
      name: "United Arab Emirates",
      region: "Middle East",
      iso_code: "AE",
      risk_level: "Low",
      favorability_score: 88,
      notes: "UAE is rapidly becoming a global crypto hub, with proactive regulatory bodies like VARA and FSRA (ADGM) issuing licenses and compliance frameworks. Multiple free zones support crypto businesses."
    }).returning();

    console.log(`Created jurisdiction: ${jurisdiction.name} with ID ${jurisdiction.id}`);

    // 2. Insert regulatory bodies
    const regulatoryBodiesData = [
      {
        name: "Virtual Assets Regulatory Authority (VARA) – Dubai",
        website_url: "https://vara.ae",
        description: "Dubai's regulatory authority responsible for virtual asset service providers operating in the emirate.",
        jurisdiction_id: jurisdiction.id
      },
      {
        name: "Financial Services Regulatory Authority (FSRA) – ADGM",
        website_url: "https://www.adgm.com/operating-in-adgm/financial-services-regulatory-authority",
        description: "Abu Dhabi Global Market's regulatory authority overseeing virtual asset service providers in ADGM free zone.",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const body of regulatoryBodiesData) {
      await db.insert(regulatory_bodies).values(body);
    }
    console.log(`Added ${regulatoryBodiesData.length} regulatory bodies`);

    // 3. Insert regulations
    const regulationsData = [
      {
        title: "ADGM Virtual Asset Regulatory Framework",
        type: "Licensing, Custody, Trading",
        description: "Framework established by FSRA for regulating virtual asset activities within the Abu Dhabi Global Market free zone.",
        effective_date: new Date("2018-06-01"),
        last_updated: new Date("2023-04-12"),
        compliance_url: "https://www.adgm.com/operating-in-adgm/financial-services-regulatory-authority/regulations-and-guidance",
        jurisdiction_id: jurisdiction.id
      },
      {
        title: "Dubai VARA Regulations (2022)",
        type: "Licensing, AML, Market Conduct",
        description: "Covers VASPs in Dubai, including exchanges, custodians, and brokers. Establishes rules for market conduct, AML compliance, and operational requirements.",
        effective_date: new Date("2022-02-28"),
        last_updated: new Date("2024-01-15"),
        compliance_url: "https://vara.ae/licensing-framework/",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const regulation of regulationsData) {
      await db.insert(regulations).values(regulation);
    }
    console.log(`Added ${regulationsData.length} regulations`);

    // 4. Insert compliance requirements
    const complianceRequirementsData = [
      {
        requirement_type: "Licensing Required",
        summary: "VASPs must register with either VARA (Dubai) or FSRA (Abu Dhabi) depending on location",
        details: "Licensing requirements vary by category and jurisdiction. VARA licenses cover Broker-Dealer, Custodian, Exchange, and Wallet Service categories.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "AML/CFT Controls",
        summary: "Mandatory transaction monitoring, STR reporting to UAE FIU",
        details: "VASPs must implement robust AML/CFT programs, including KYC, transaction monitoring, travel rule compliance, and suspicious transaction reporting.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "Cold Wallet Minimums",
        summary: "80% of client funds must be stored in cold wallets",
        details: "VASPs must maintain at least 80% of client assets in secure cold storage solutions with appropriate key management procedures.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "Marketing Approvals",
        summary: "Ads and campaigns must be pre-approved",
        details: "All marketing materials and promotional campaigns must be reviewed and approved by the relevant regulatory authority before publication.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "Custody & Insurance",
        summary: "Custodians must have insurance and segregate assets",
        details: "Custody providers must maintain insurance coverage for client assets and implement segregation of client and operational funds.",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const req of complianceRequirementsData) {
      await db.insert(compliance_requirements).values(req);
    }
    console.log(`Added ${complianceRequirementsData.length} compliance requirements`);

    // 5. Insert taxation rule
    const taxationRule = {
      income_tax_applicable: false,
      capital_gains_tax: false,
      vat_applicable: true,
      tax_description: "Crypto activity in free zones is generally tax-exempt unless connected to mainland activity. Standard 5% VAT may apply to crypto services.",
      tax_authority_url: "https://tax.gov.ae/en",
      last_updated: new Date("2023-12-10"),
      jurisdiction_id: jurisdiction.id
    };

    await db.insert(taxation_rules).values(taxationRule);
    console.log("Added taxation rule");

    // 6. Insert reporting obligations
    const reportingObligationsData = [
      {
        type: "Suspicious Transaction Reports (STRs)",
        frequency: "As needed",
        submission_url: "https://www.uaefiu.gov.ae/",
        penalties: "Severe penalties including license revocation and fines for non-compliance",
        last_reviewed: new Date("2023-11-20"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Operational Reports",
        frequency: "Monthly",
        submission_url: null,
        penalties: "Administrative penalties for late or incomplete submissions",
        last_reviewed: new Date("2024-01-05"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Wallet Proof Reports",
        frequency: "Quarterly",
        submission_url: null,
        penalties: "Escalating fines for continued non-compliance",
        last_reviewed: new Date("2023-09-30"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Client Onboarding Logs",
        frequency: "Ongoing (kept for 5+ years)",
        submission_url: null,
        penalties: "Potential regulatory action and fines for incomplete recordkeeping",
        last_reviewed: new Date("2023-10-15"),
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const obligation of reportingObligationsData) {
      await db.insert(reporting_obligations).values(obligation);
    }
    console.log(`Added ${reportingObligationsData.length} reporting obligations`);

    // 7. Insert regulatory updates
    const regulatoryUpdatesData = [
      {
        update_title: "VARA Issuance of Full Licensing Guide",
        update_date: new Date("2024-01-15"),
        source: "Virtual Assets Regulatory Authority",
        summary: "Clarifies licensing categories: Broker-Dealer, Custodian, Exchange, Wallet Service with detailed compliance requirements for each.",
        jurisdiction_id: jurisdiction.id
      },
      {
        update_title: "AML Law Aligned to FATF",
        update_date: new Date("2023-10-25"),
        source: "UAE Federal Government",
        summary: "UAE adopted new national AML law, increasing FIU monitoring powers and strengthening requirements for virtual asset service providers.",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const update of regulatoryUpdatesData) {
      await db.insert(regulatory_updates).values(update);
    }
    console.log(`Added ${regulatoryUpdatesData.length} regulatory updates`);

    // 8. Insert tags
    const tagsData = [
      "VARA", "ADGM", "VASP", "ColdWallet", "FATF", "FreeZone", "CryptoLicensing", "MiddleEast"
    ];

    for (const tag of tagsData) {
      await db.insert(jurisdiction_tags).values({
        jurisdiction_id: jurisdiction.id,
        tag
      });
    }
    console.log(`Added ${tagsData.length} tags`);

    console.log("UAE jurisdiction data import completed successfully!");
    
    return {
      success: true,
      jurisdictionId: jurisdiction.id,
      message: "United Arab Emirates jurisdiction data imported successfully"
    };
  } catch (error) {
    console.error("Error importing UAE jurisdiction data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Execute import function
importUaeData()
  .then((result) => {
    console.log("Import result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Import failed with error:", error);
    process.exit(1);
  });

export { importUaeData };