import { pool, db } from "../server/db";
import { token_registrations } from "../shared/schema";

async function importTokenData() {
  console.log("Importing sample token data...");
  
  try {
    // First check if we already have token registrations
    const existingTokens = await db.select({ count: { count: token_registrations.id } })
      .from(token_registrations);
    
    const tokenCount = Number(existingTokens[0]?.count || 0);
    
    if (tokenCount > 0) {
      console.log(`Found ${tokenCount} existing token registrations. Skipping import.`);
      return;
    }
    
    // Sample token data for different categories
    const sampleTokens = [
      // Financial Instrument Token
      {
        user_id: 11, // We assume there is a user with ID 11
        token_name: "Equity Token Alpha",
        token_symbol: "EQA",
        token_category: "FINANCIAL_INSTRUMENT",
        token_type: "Security Token",
        description: "A digital security token representing equity in Alpha Corporation, providing holders with dividend rights and voting capabilities.",
        issuer_name: "Alpha Capital",
        issuer_legal_entity: "Alpha Capital Ltd.",
        website_url: "https://alpha-capital.example.com",
        whitepaper_url: "https://alpha-capital.example.com/whitepaper.pdf",
        blockchain_networks: JSON.stringify([
          { name: "Ethereum", chainId: "1" },
          { name: "Polygon", chainId: "137" }
        ]),
        contract_addresses: JSON.stringify([
          { network: "Ethereum", address: "0x1234567890123456789012345678901234567890" },
          { network: "Polygon", address: "0x2345678901234567890123456789012345678901" }
        ]),
        token_standard: "ERC-1400",
        total_supply: "10000000",
        regulatory_status: "Registered",
        jurisdictions: JSON.stringify([
          { id: 1, name: "United States" },
          { id: 3, name: "Singapore" }
        ]),
        compliance_contacts: JSON.stringify([
          { name: "Sarah Johnson", email: "sjohnson@alpha-capital.example.com", role: "Compliance Officer" }
        ]),
        kyc_requirements: "Full KYC/AML required for all token holders",
        aml_policy_url: "https://alpha-capital.example.com/aml-policy",
        transfer_restrictions: "Transfer restricted to verified investors only",
        security_features: JSON.stringify({
          multisig: true,
          pausable: true,
          upgradeability: "Proxy pattern"
        }),
        tokenomics_details: JSON.stringify({
          release_schedule: "4-year vesting with 1-year cliff",
          inflation_rate: "0%"
        }),
        registration_status: "approved"
      },
      
      // Real World Asset Token
      {
        user_id: 11,
        token_name: "RealEstate Token",
        token_symbol: "RET",
        token_category: "REAL_WORLD_ASSET",
        token_type: "Real Estate Token",
        description: "A token representing fractional ownership in premium commercial real estate properties across major US cities.",
        issuer_name: "RealToken Properties",
        issuer_legal_entity: "RealToken Properties Inc.",
        website_url: "https://realtoken.example.com",
        whitepaper_url: "https://realtoken.example.com/whitepaper.pdf",
        blockchain_networks: JSON.stringify([
          { name: "Ethereum", chainId: "1" }
        ]),
        contract_addresses: JSON.stringify([
          { network: "Ethereum", address: "0x3456789012345678901234567890123456789012" }
        ]),
        token_standard: "ERC-20",
        total_supply: "5000000",
        regulatory_status: "Regulated",
        jurisdictions: JSON.stringify([
          { id: 1, name: "United States" }
        ]),
        compliance_contacts: JSON.stringify([
          { name: "Michael Chen", email: "mchen@realtoken.example.com", role: "Legal Counsel" }
        ]),
        kyc_requirements: "Full KYC required for token purchase",
        aml_policy_url: "https://realtoken.example.com/aml-policy",
        transfer_restrictions: "Transferable only to accredited investors",
        asset_backing_details: JSON.stringify({
          asset_class: "Commercial Real Estate",
          asset_location: "United States",
          valuation_method: "Professional appraisal",
          custodian: "Trustee Bank LLC"
        }),
        registration_status: "approved"
      },
      
      // Payment/Stablecoin
      {
        user_id: 11,
        token_name: "Stable Dollar",
        token_symbol: "USDS",
        token_category: "PAYMENT_STABLE",
        token_type: "Fiat-Backed Stablecoin",
        description: "A fully collateralized USD-pegged stablecoin backed 1:1 with cash reserves in regulated US banks.",
        issuer_name: "Stable Financial",
        issuer_legal_entity: "Stable Financial Inc.",
        website_url: "https://stablefinancial.example.com",
        whitepaper_url: "https://stablefinancial.example.com/whitepaper.pdf",
        blockchain_networks: JSON.stringify([
          { name: "Ethereum", chainId: "1" },
          { name: "Solana", chainId: "101" },
          { name: "BNB Chain", chainId: "56" }
        ]),
        contract_addresses: JSON.stringify([
          { network: "Ethereum", address: "0x4567890123456789012345678901234567890123" },
          { network: "Solana", address: "0x5678901234567890123456789012345678901234" },
          { network: "BNB Chain", address: "0x6789012345678901234567890123456789012345" }
        ]),
        token_standard: "ERC-20",
        total_supply: "1000000000",
        regulatory_status: "Licensed",
        jurisdictions: JSON.stringify([
          { id: 1, name: "United States" },
          { id: 2, name: "United Arab Emirates" }
        ]),
        compliance_contacts: JSON.stringify([
          { name: "Jennifer Park", email: "jpark@stablefinancial.example.com", role: "Compliance Director" },
          { name: "Robert Garcia", email: "rgarcia@stablefinancial.example.com", role: "AML Officer" }
        ]),
        kyc_requirements: "KYC required for all transactions above $1,000",
        aml_policy_url: "https://stablefinancial.example.com/aml-policy",
        transfer_restrictions: "No transfers to sanctioned countries",
        peg_details: JSON.stringify({
          peg_type: "USD",
          peg_ratio: "1:1",
          collateral_type: "Cash and cash equivalents",
          reserve_ratio: "100%",
          reserve_auditor: "Big4 Auditing Firm",
          last_audit_date: "2025-02-15"
        }),
        security_features: JSON.stringify({
          multisig: true,
          pausable: true,
          blacklisting: true
        }),
        registration_status: "approved"
      },
      
      // Utility Token
      {
        user_id: 11,
        token_name: "Cloud Computing Token",
        token_symbol: "CCT",
        token_category: "UTILITY",
        token_type: "Platform Access Token",
        description: "A utility token used to pay for decentralized cloud computing services on the Cloud3 network.",
        issuer_name: "Cloud3 Network",
        issuer_legal_entity: "Cloud3 Foundation",
        website_url: "https://cloud3.example.com",
        whitepaper_url: "https://cloud3.example.com/whitepaper.pdf",
        blockchain_networks: JSON.stringify([
          { name: "Ethereum", chainId: "1" }
        ]),
        contract_addresses: JSON.stringify([
          { network: "Ethereum", address: "0x7890123456789012345678901234567890123456" }
        ]),
        token_standard: "ERC-20",
        total_supply: "100000000",
        regulatory_status: "Unregulated Utility",
        jurisdictions: JSON.stringify([
          { id: 3, name: "Singapore" }
        ]),
        compliance_contacts: JSON.stringify([
          { name: "David Wong", email: "dwong@cloud3.example.com", role: "Legal Advisor" }
        ]),
        kyc_requirements: "None for small transactions, KYC for large holders",
        aml_policy_url: "https://cloud3.example.com/compliance",
        transfer_restrictions: "None",
        tokenomics_details: JSON.stringify({
          utility: "Payment for computing resources",
          burn_mechanism: "Fee burning model",
          staking_rewards: "10% APY for network validators"
        }),
        registration_status: "approved"
      },
      
      // NFT Platform
      {
        user_id: 11,
        token_name: "ArtVerse",
        token_symbol: "ART",
        token_category: "NFT",
        token_type: "NFT Marketplace Platform",
        description: "A platform token for the ArtVerse NFT marketplace, used for governance, artist verification, and fee reductions.",
        issuer_name: "ArtVerse Foundation",
        issuer_legal_entity: "ArtVerse Foundation Ltd.",
        website_url: "https://artverse.example.com",
        whitepaper_url: "https://artverse.example.com/whitepaper.pdf",
        blockchain_networks: JSON.stringify([
          { name: "Ethereum", chainId: "1" }
        ]),
        contract_addresses: JSON.stringify([
          { network: "Ethereum", address: "0x8901234567890123456789012345678901234567" }
        ]),
        token_standard: "ERC-721, ERC-1155",
        total_supply: "50000000",
        regulatory_status: "Unregulated",
        jurisdictions: JSON.stringify([
          { id: 2, name: "United Arab Emirates" }
        ]),
        compliance_contacts: JSON.stringify([
          { name: "Alexandra Kim", email: "akim@artverse.example.com", role: "Community Manager" }
        ]),
        kyc_requirements: "None for basic users, creators require verification",
        aml_policy_url: "https://artverse.example.com/terms",
        transfer_restrictions: "None",
        security_audit_details: JSON.stringify({
          auditor: "Security Audit Partners",
          audit_date: "2025-01-10",
          findings: "No critical vulnerabilities"
        }),
        registration_status: "pending"
      }
    ];
    
    // Insert the sample tokens
    for (const token of sampleTokens) {
      await pool.query(`
        INSERT INTO token_registrations (
          user_id, token_name, token_symbol, token_category, token_type, 
          description, issuer_name, issuer_legal_entity, website_url, whitepaper_url,
          blockchain_networks, contract_addresses, token_standard, total_supply,
          regulatory_status, jurisdictions, compliance_contacts, kyc_requirements,
          aml_policy_url, transfer_restrictions, asset_backing_details, peg_details,
          security_features, tokenomics_details, security_audit_details, registration_status,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW()
        )
      `, [
        token.user_id, token.token_name, token.token_symbol, token.token_category, token.token_type,
        token.description, token.issuer_name, token.issuer_legal_entity, token.website_url, token.whitepaper_url,
        token.blockchain_networks, token.contract_addresses, token.token_standard, token.total_supply,
        token.regulatory_status, token.jurisdictions, token.compliance_contacts, token.kyc_requirements,
        token.aml_policy_url, token.transfer_restrictions, token.asset_backing_details || null, token.peg_details || null,
        token.security_features || null, token.tokenomics_details || null, token.security_audit_details || null, token.registration_status
      ]);
    }
    
    console.log(`Successfully imported ${sampleTokens.length} sample token registrations.`);
  } catch (error) {
    console.error("Error importing token data:", error);
    throw error;
  }
}

// Run the function
importTokenData()
  .then(() => {
    console.log("Token data import completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to import token data:", err);
    process.exit(1);
  });