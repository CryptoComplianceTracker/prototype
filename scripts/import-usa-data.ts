import { db } from "../server/db";
import { jurisdictions, regulatory_bodies, regulations, compliance_requirements, 
         taxation_rules, reporting_obligations, regulatory_updates, jurisdiction_tags } from "../shared/schema";

async function importUsaData() {
  try {
    console.log("Starting USA jurisdiction data import...");

    // 1. Insert main jurisdiction record
    const [jurisdiction] = await db.insert(jurisdictions).values({
      name: "United States",
      region: "North America",
      iso_code: "US",
      risk_level: "Medium",
      favorability_score: 65,
      notes: "The U.S. is a patchwork of federal and state laws. Crypto companies must navigate overlapping jurisdictions from the SEC, CFTC, FinCEN, IRS, and state financial regulators."
    }).returning();

    console.log(`Created jurisdiction: ${jurisdiction.name} with ID ${jurisdiction.id}`);

    // 2. Insert regulatory bodies
    const regulatoryBodiesData = [
      {
        name: "FinCEN (AML oversight)",
        website_url: "https://www.fincen.gov",
        description: "Financial Crimes Enforcement Network, responsible for Anti-Money Laundering oversight and enforcement.",
        jurisdiction_id: jurisdiction.id
      },
      {
        name: "SEC (Securities)",
        website_url: "https://www.sec.gov",
        description: "Securities and Exchange Commission, regulates securities markets and oversees token offerings that qualify as securities.",
        jurisdiction_id: jurisdiction.id
      },
      {
        name: "CFTC (Derivatives/Commodities)",
        website_url: "https://www.cftc.gov",
        description: "Commodity Futures Trading Commission, oversees derivatives markets including futures contracts based on cryptocurrencies.",
        jurisdiction_id: jurisdiction.id
      },
      {
        name: "IRS (Taxation)",
        website_url: "https://www.irs.gov",
        description: "Internal Revenue Service, responsible for tax collection and enforcement of cryptocurrency tax reporting.",
        jurisdiction_id: jurisdiction.id
      },
      {
        name: "State regulators (e.g., NYDFS in New York)",
        website_url: "https://www.dfs.ny.gov",
        description: "State-level financial regulators that may have their own licensing and compliance requirements for cryptocurrency businesses.",
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
        title: "Bank Secrecy Act (BSA)",
        type: "Federal Law",
        description: "Requires cryptocurrency exchanges and custodians to register as Money Services Businesses (MSBs). Mandates SAR filing, KYC procedures, and detailed record keeping.",
        effective_date: new Date("2013-03-18"), // FinCEN guidance date applying BSA to virtual currencies
        last_updated: new Date("2023-12-15"),
        compliance_url: "https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering",
        jurisdiction_id: jurisdiction.id
      },
      {
        title: "Securities Act 1933 / Howey Test",
        type: "Federal Law",
        description: "Determines whether tokens are securities. Token sales may require SEC registration or exemption. The Howey Test is used to evaluate if a transaction qualifies as an investment contract.",
        effective_date: new Date("1933-05-27"),
        last_updated: new Date("2023-06-10"), // Approximate date for recent SEC actions
        compliance_url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets",
        jurisdiction_id: jurisdiction.id
      },
      {
        title: "Commodity Exchange Act",
        type: "Federal Law",
        description: "CFTC oversees derivatives and futures contracts based on crypto assets. Bitcoin and other cryptocurrencies have been deemed commodities under this framework.",
        effective_date: new Date("1936-06-15"),
        last_updated: new Date("2024-01-14"),
        compliance_url: "https://www.cftc.gov/digitalassets/index.htm",
        jurisdiction_id: jurisdiction.id
      },
      {
        title: "NY BitLicense",
        type: "State Regulation",
        description: "New York's specialized licensing regime for virtual currency businesses, administered by the New York Department of Financial Services (NYDFS).",
        effective_date: new Date("2015-08-08"),
        last_updated: new Date("2023-11-28"),
        compliance_url: "https://www.dfs.ny.gov/virtual_currency_businesses",
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
        requirement_type: "MSB Registration",
        summary: "Mandatory registration with FinCEN for most exchanges and crypto ATMs",
        details: "Requires filing Form 107, implementing a compliance program, and ongoing reporting obligations.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "SAR Filings",
        summary: "Suspicious Activity Reports for AML compliance",
        details: "Required for transactions of $5,000+ that appear suspicious. Reports must be filed within 30 days of detection.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "Securities Registration/Exemption",
        summary: "Required depending on the token's structure and use case",
        details: "If a token is deemed a security, issuers must either register with the SEC or qualify for an exemption like Regulation D or S.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "KYC Requirements",
        summary: "Varies slightly by state but generally required for MSBs",
        details: "Customer identification, identity verification, and recordkeeping are mandatory for exchanges and other crypto financial services.",
        jurisdiction_id: jurisdiction.id
      },
      {
        requirement_type: "Sanctions Screening",
        summary: "Required for OFAC-listed addresses/entities",
        details: "Businesses must screen customers against OFAC sanctions lists and implement controls to prevent transactions with sanctioned entities.",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const req of complianceRequirementsData) {
      await db.insert(compliance_requirements).values(req);
    }
    console.log(`Added ${complianceRequirementsData.length} compliance requirements`);

    // 5. Insert taxation rule
    const taxationRule = {
      income_tax_applicable: true,
      capital_gains_tax: true,
      vat_applicable: false,
      tax_description: "Crypto is treated as property. Every disposal (sale, trade, use) is a taxable event. Mining and staking income treated as ordinary income. Capital gains rates depend on holding period (short-term vs long-term).",
      tax_authority_url: "https://www.irs.gov/businesses/small-businesses-self-employed/virtual-currencies",
      last_updated: new Date("2024-01-05"),
      jurisdiction_id: jurisdiction.id
    };

    await db.insert(taxation_rules).values(taxationRule);
    console.log("Added taxation rule");

    // 6. Insert reporting obligations
    const reportingObligationsData = [
      {
        type: "Suspicious Activity Reports (SARs)",
        frequency: "As needed",
        submission_url: "https://bsaefiling.fincen.treas.gov/",
        penalties: "Civil and criminal penalties up to $250,000 and 5 years imprisonment for willful non-compliance",
        last_reviewed: new Date("2024-01-15"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Form 1099",
        frequency: "Annual",
        submission_url: "https://www.irs.gov/businesses/small-businesses-self-employed/virtual-currencies",
        penalties: "Penalties for non-filing range from $50 to $280 per form, up to $3,392,000 annually",
        last_reviewed: new Date("2023-12-20"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Form 8949 / Schedule D",
        frequency: "Annual",
        submission_url: "https://www.irs.gov/forms-pubs/about-form-8949",
        penalties: "Accuracy-related penalties of 20% of the underpayment for substantial understatement",
        last_reviewed: new Date("2023-11-10"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "Travel Rule Compliance",
        frequency: "Per transaction",
        submission_url: "https://www.fincen.gov/resources/statutes-regulations/guidance/travel-rule",
        penalties: "Civil penalties up to $23,011 per violation and criminal penalties including fines and imprisonment",
        last_reviewed: new Date("2024-02-15"),
        jurisdiction_id: jurisdiction.id
      },
      {
        type: "State Reports",
        frequency: "Varies by state",
        submission_url: null,
        penalties: "Varies by state, can include fines, license revocation, and cease and desist orders",
        last_reviewed: new Date("2024-01-30"),
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
        update_title: "SEC vs. Crypto Exchanges",
        update_date: new Date("2023-06-05"),
        source: "Securities and Exchange Commission",
        summary: "Ongoing litigation to determine whether certain tokens listed on major exchanges are securities, with significant implications for the industry's regulatory framework.",
        jurisdiction_id: jurisdiction.id
      },
      {
        update_title: "FinCEN Proposed Rulemaking",
        update_date: new Date("2025-01-15"),
        source: "Financial Crimes Enforcement Network",
        summary: "Proposed rules to tighten Travel Rule implementation and mandate beneficial ownership disclosure requirements for cryptocurrency transactions.",
        jurisdiction_id: jurisdiction.id
      },
      {
        update_title: "IRS 1099-DA Proposal",
        update_date: new Date("2024-10-15"),
        source: "Internal Revenue Service",
        summary: "New proposed reporting form 1099-DA specifically for digital assets, requiring all crypto brokers, including decentralized exchanges, to report user transactions.",
        jurisdiction_id: jurisdiction.id
      }
    ];

    for (const update of regulatoryUpdatesData) {
      await db.insert(regulatory_updates).values(update);
    }
    console.log(`Added ${regulatoryUpdatesData.length} regulatory updates`);

    // 8. Insert tags
    const tagsData = [
      "FinCEN", "SEC", "CFTC", "MSB", "TaxableEvent", "NYDFS", "1099-DA", "HoweyTest"
    ];

    for (const tag of tagsData) {
      await db.insert(jurisdiction_tags).values({
        jurisdiction_id: jurisdiction.id,
        tag
      });
    }
    console.log(`Added ${tagsData.length} tags`);

    console.log("USA jurisdiction data import completed successfully!");
    
    return {
      success: true,
      jurisdictionId: jurisdiction.id,
      message: "United States jurisdiction data imported successfully"
    };
  } catch (error) {
    console.error("Error importing USA jurisdiction data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Execute import function
importUsaData()
  .then((result) => {
    console.log("Import result:", result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Import failed with error:", error);
    process.exit(1);
  });

export { importUsaData };