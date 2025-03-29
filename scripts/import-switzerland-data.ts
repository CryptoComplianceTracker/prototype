import axios from 'axios';

// Parse the Switzerland example data and format it for the API
const switzerlandData = {
  name: "Switzerland",
  region: "Europe",
  risk_level: "Low",
  favorability_score: 92,
  notes: "Switzerland is home to \"Crypto Valley\" (Zug), and offers a clear regulatory framework for blockchain innovation. It supports tokenized assets, DAOs, and stablecoins.",
  
  regulatory_bodies: [
    {
      name: "Swiss Financial Market Supervisory Authority (FINMA)",
      website_url: "https://www.finma.ch",
      description: "FINMA regulates financial markets in Switzerland and provides token classification and licensing guidelines for blockchain/crypto companies."
    }
  ],
  
  regulations: [
    {
      title: "FINMA ICO Guidelines",
      type: "ICO, Token Classification",
      description: "Classifies tokens into three types: payment, utility, and asset tokens. Provides guidance on when a token constitutes a security.",
      compliance_url: "https://www.finma.ch/en/news/2018/02/20180216-mm-ico-wegleitung/",
      effective_date: "2018-02-16T00:00:00.000Z",
      last_updated: "2023-08-01T00:00:00.000Z"
    },
    {
      title: "Financial Institutions Act (FinIA)",
      type: "Licensing, Custody",
      description: "Regulates independent asset managers and fintech companies, including crypto custody providers.",
      compliance_url: "https://www.finma.ch/en/authorisation/financial-institutions-and-financial-service-providers/",
      effective_date: "2020-01-01T00:00:00.000Z",
      last_updated: "2024-06-01T00:00:00.000Z"
    },
    {
      title: "DLT Framework Amendments",
      type: "DLT, Asset Tokenization, DAOs",
      description: "Introduced a new license type for trading platforms dealing exclusively with DLT securities.",
      compliance_url: "https://www.sif.admin.ch/sif/en/home/finanzmarktpolitik/digitalisation-of-the-financial-sector/blockchain-and-dlt.html",
      effective_date: "2021-08-01T00:00:00.000Z",
      last_updated: "2024-03-01T00:00:00.000Z"
    }
  ],
  
  compliance_requirements: [
    {
      requirement_type: "KYC",
      summary: "Required for all ICOs and crypto exchanges. Companies must verify the identity of users. Applies to payment and asset tokens."
    },
    {
      requirement_type: "AML",
      summary: "Entities must file Suspicious Activity Reports (SARs) and register under AMLA."
    },
    {
      requirement_type: "Token Classification",
      summary: "Companies must classify tokens and determine whether securities law applies, based on FINMA's framework."
    },
    {
      requirement_type: "Custody Regulation",
      summary: "Crypto custody providers require a FinIA license."
    },
    {
      requirement_type: "Client Asset Segregation",
      summary: "Required under the DLT regulations for platform operators."
    },
    {
      requirement_type: "Banking License (optional)",
      summary: "Necessary for crypto firms offering interest-bearing accounts or taking deposits."
    }
  ],
  
  taxation_rule: {
    income_tax_applicable: true,
    capital_gains_tax: false,
    vat_applicable: false,
    tax_description: "Private investors are not subject to capital gains tax. Mining income, staking rewards, and crypto used in business operations are subject to income tax.",
    tax_authority_url: "https://www.estv.admin.ch/estv/en/home.html",
    last_updated: "2024-05-01T00:00:00.000Z"
  },
  
  reporting_obligations: [
    {
      type: "Suspicious Activity Reporting (SAR)",
      frequency: "Real-time",
      submission_url: "https://www.fedpol.admin.ch/fedpol/en/home/kriminalitaet/geldwaescherei/meldung.html",
      penalties: "Up to CHF 500,000 fine, license suspension or revocation",
      last_reviewed: "2024-12-31T00:00:00.000Z"
    },
    {
      type: "Periodic Compliance Reporting",
      frequency: "Annually",
      submission_url: "https://www.finma.ch/en/monitoring/",
      penalties: "License suspension, additional requirements",
      last_reviewed: "2024-12-31T00:00:00.000Z"
    }
  ],
  
  regulatory_updates: [
    {
      update_title: "FINMA expands tokenization sandbox",
      update_date: "2025-01-15T00:00:00.000Z",
      summary: "FINMA has broadened its sandbox license to allow non-banks to issue and manage tokenized securities up to CHF 2 million in customer assets.",
      source: "FINMA Newsroom"
    },
    {
      update_title: "AML 6th Directive Compliance",
      update_date: "2024-10-05T00:00:00.000Z",
      summary: "Switzerland has updated AML rules to align with the 6th EU Directive. Expanded obligations for VASPs (Virtual Asset Service Providers).",
      source: "Swiss AML Updates"
    },
    {
      update_title: "ESG Disclosure Guidance",
      update_date: "2024-07-20T00:00:00.000Z",
      summary: "New FINMA guidance suggests crypto firms disclose ESG impact in whitepapers or investor disclosures.",
      source: "FINMA Guidelines"
    }
  ],
  
  tags: [
    "ICO", "TokenClassification", "KYCAML", "DLT", "Custody", "TaxExempt", "FINMA"
  ],
  
  keywords: [
    "Token Security Classification Switzerland", 
    "Crypto Taxation Swiss Individuals", 
    "DLT License Zug", 
    "FINMA AML reporting"
  ]
};

// Function to send the data to the API endpoint
async function importSwitzerlandData() {
  try {
    console.log("Importing Switzerland regulatory data...");
    
    const response = await axios.post('http://localhost:5000/api/jurisdictions/import', switzerlandData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Import successful:", response.data);
  } catch (error) {
    console.error("Failed to import Switzerland data:", error);
    if (error.response) {
      console.error("Response details:", error.response.data);
    }
  }
}

// Run the import function
importSwitzerlandData();