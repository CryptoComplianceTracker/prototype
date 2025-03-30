// Token categories and their associated types
export const TOKEN_CATEGORIES = [
  "FINANCIAL_INSTRUMENT",
  "REAL_WORLD_ASSET",
  "PAYMENT_STABLE",
  "UTILITY",
  "GOVERNANCE",
  "SYNTHETIC_DERIVATIVE",
  "NFT",
  "COMPLIANCE_ACCESS",
  "SPECIAL_PURPOSE"
] as const;

export type TokenCategory = typeof TOKEN_CATEGORIES[number];

// Detailed token type definitions mapped to categories
export const TOKEN_TYPES: Record<TokenCategory, { type: string; description: string }[]> = {
  "FINANCIAL_INSTRUMENT": [
    { 
      type: "Equity Token", 
      description: "Represent ownership shares in a company (tokenized stock)" 
    },
    { 
      type: "Debt Token / Bond Token", 
      description: "Tokenized debt instruments" 
    },
    { 
      type: "Revenue-Share Token", 
      description: "Grant access to a % of project's earnings" 
    },
    { 
      type: "Convertible Token", 
      description: "Convertible to equity under predefined conditions" 
    },
    { 
      type: "Structured Product Token", 
      description: "Complex hybrid instruments (with triggers/options)" 
    }
  ],
  "REAL_WORLD_ASSET": [
    { 
      type: "Real Estate Token", 
      description: "Fractional ownership in physical properties" 
    },
    { 
      type: "Precious Metal Token", 
      description: "1:1 backed by gold, silver, etc." 
    },
    { 
      type: "Commodity Token", 
      description: "Represent oil, wheat, natural gas, etc." 
    },
    { 
      type: "Invoice & Trade Finance Token", 
      description: "Represent receivables, invoices, PO financing" 
    },
    { 
      type: "Carbon Credit Token", 
      description: "Represent certified carbon offsets" 
    },
    { 
      type: "Art & Collectible Token", 
      description: "Physical fine art or collectibles tokenized" 
    },
    { 
      type: "Vehicle / Equipment Token", 
      description: "Fractional ownership or leasing rights" 
    },
    { 
      type: "Music / IP Royalties Token", 
      description: "Rights to future streaming/publishing revenues" 
    }
  ],
  "PAYMENT_STABLE": [
    { 
      type: "Fiat-Backed Stablecoin", 
      description: "Pegged to fiat and fully collateralized" 
    },
    { 
      type: "Algorithmic Stablecoin", 
      description: "Pegged via code/supply mechanisms (no 1:1 backing)" 
    },
    { 
      type: "CBDC", 
      description: "Central Bank Digital Currency - Sovereign-issued stablecoin" 
    },
    { 
      type: "Payment Token", 
      description: "General-purpose money-like asset" 
    }
  ],
  "UTILITY": [
    { 
      type: "Platform Access Token", 
      description: "Access to services/features" 
    },
    { 
      type: "Staking Token", 
      description: "Lock tokens to earn rewards or access governance" 
    },
    { 
      type: "API/Service Usage Token", 
      description: "Pay to access decentralized APIs, bandwidth, storage" 
    },
    { 
      type: "Gaming/Metaverse Token", 
      description: "In-game currencies or items" 
    }
  ],
  "GOVERNANCE": [
    { 
      type: "DAO Governance Token", 
      description: "Represent voting rights in DAOs" 
    },
    { 
      type: "Quadratic Voting Token", 
      description: "Vote with square-root weighting" 
    },
    { 
      type: "Delegated Governance Token", 
      description: "Allow delegation of votes to trusted parties" 
    }
  ],
  "SYNTHETIC_DERIVATIVE": [
    { 
      type: "Synthetic Asset Token", 
      description: "Mirror real-world asset prices without holding them" 
    },
    { 
      type: "Option Token", 
      description: "Represent on-chain call/put options" 
    },
    { 
      type: "Futures Token", 
      description: "Tokenized forward contracts" 
    },
    { 
      type: "Leveraged Token", 
      description: "Tokens with built-in leverage mechanics" 
    }
  ],
  "NFT": [
    { 
      type: "Art NFT", 
      description: "Represent digital or physical artwork" 
    },
    { 
      type: "Music NFT", 
      description: "Represent audio tracks, albums, royalties" 
    },
    { 
      type: "Game NFT", 
      description: "In-game items or characters" 
    },
    { 
      type: "Identity NFT / Soulbound Token", 
      description: "Tied to user achievements or reputation" 
    },
    { 
      type: "Domain NFT", 
      description: "Blockchain-based web addresses" 
    }
  ],
  "COMPLIANCE_ACCESS": [
    { 
      type: "KYC-Verified Token", 
      description: "Whitelisted identity layer on chain" 
    },
    { 
      type: "Access-Controlled Token", 
      description: "Only tradable or usable by verified users" 
    },
    { 
      type: "Compliance-Aware Token", 
      description: "Tokens that auto-block based on geography/rules" 
    }
  ],
  "SPECIAL_PURPOSE": [
    { 
      type: "Memecoin", 
      description: "Cultural/speculative tokens with no inherent utility" 
    },
    { 
      type: "Fan Token", 
      description: "Issued by sports teams/celebrities for fan engagement" 
    },
    { 
      type: "Voucher/Coupon Token", 
      description: "Redeemable for services, discounts, or access" 
    },
    { 
      type: "Time Token", 
      description: "Tokens representing someone's time or service hours" 
    }
  ]
};

// Token standards for different blockchain networks
export const TOKEN_STANDARDS = {
  "Ethereum": ["ERC-20", "ERC-721", "ERC-777", "ERC-1155", "ERC-4626"],
  "Binance Smart Chain": ["BEP-20", "BEP-721", "BEP-1155"],
  "Polygon": ["ERC-20", "ERC-721", "ERC-1155"],
  "Solana": ["SPL"],
  "Cosmos": ["CW-20", "CW-721"],
  "Avalanche": ["ARC-20", "ARC-721"],
  "Tezos": ["FA1.2", "FA2"],
  "Other": ["Custom"]
};

// Common blockchain networks and their chain IDs
export const BLOCKCHAIN_NETWORKS = [
  { name: "Ethereum Mainnet", chainId: "1" },
  { name: "Ethereum Sepolia", chainId: "11155111" },
  { name: "Polygon", chainId: "137" },
  { name: "Polygon Mumbai", chainId: "80001" },
  { name: "Binance Smart Chain", chainId: "56" },
  { name: "Avalanche C-Chain", chainId: "43114" },
  { name: "Solana Mainnet", chainId: "1" },
  { name: "Arbitrum One", chainId: "42161" },
  { name: "Optimism", chainId: "10" },
  { name: "Base", chainId: "8453" }
];

// Regulatory status options
export const REGULATORY_STATUS_OPTIONS = [
  "Registered Security",
  "Exempt Security",
  "Utility Token",
  "Payment Token",
  "Regulatory Sandbox",
  "Pending Review",
  "Not Applicable",
  "Other"
];

// Document types
export const DOCUMENT_TYPES = [
  "Legal Opinion",
  "Securities Registration",
  "Whitepaper",
  "Technical Documentation",
  "Smart Contract Audit",
  "KYC/AML Policy",
  "Tokenomics Documentation",
  "Terms of Service",
  "Privacy Policy"
];

// Risk levels
export const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

// Verification status options
export const VERIFICATION_STATUS_OPTIONS = [
  "Pending",
  "Verified",
  "Rejected",
  "Expired",
  "Under Review"
];

// KYC requirement options
export const KYC_REQUIREMENT_OPTIONS = [
  "None",
  "Basic KYC",
  "Enhanced KYC",
  "Corporate KYC",
  "Accredited Investors Only",
  "Jurisdiction-Specific"
];

// Category icons and colors for UI
export const CATEGORY_UI_CONFIG: Record<TokenCategory, { icon: string; color: string }> = {
  "FINANCIAL_INSTRUMENT": { icon: "building-library", color: "bg-blue-500" },
  "REAL_WORLD_ASSET": { icon: "building", color: "bg-green-600" },
  "PAYMENT_STABLE": { icon: "banknotes", color: "bg-emerald-500" },
  "UTILITY": { icon: "wrench", color: "bg-indigo-500" },
  "GOVERNANCE": { icon: "building-office-2", color: "bg-purple-600" },
  "SYNTHETIC_DERIVATIVE": { icon: "chart-bar", color: "bg-orange-500" },
  "NFT": { icon: "photo", color: "bg-pink-600" },
  "COMPLIANCE_ACCESS": { icon: "shield-check", color: "bg-cyan-600" },
  "SPECIAL_PURPOSE": { icon: "sparkles", color: "bg-amber-500" }
};