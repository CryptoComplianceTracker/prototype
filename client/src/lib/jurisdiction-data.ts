interface Jurisdiction {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
  regulatoryFramework: string;
  keyRegulations: string[];
}

export const jurisdictions: Jurisdiction[] = [
  {
    id: "sg",
    name: "Singapore",
    coordinates: [1.3521, 103.8198],
    description: "Leading crypto hub with clear regulatory framework",
    regulatoryFramework: "Payment Services Act (PSA)",
    keyRegulations: [
      "Mandatory licensing for crypto service providers",
      "Strict AML/CFT requirements",
      "Clear guidelines for token offerings"
    ]
  },
  {
    id: "ch",
    name: "Switzerland",
    coordinates: [46.8182, 8.2275],
    description: "Crypto Valley with progressive regulations",
    regulatoryFramework: "FINMA Guidelines",
    keyRegulations: [
      "Clear classification of token types",
      "Self-regulatory framework",
      "Banking licenses for crypto businesses"
    ]
  },
  {
    id: "mt",
    name: "Malta",
    coordinates: [35.9375, 14.3754],
    description: "Blockchain Island with comprehensive framework",
    regulatoryFramework: "Virtual Financial Assets Act",
    keyRegulations: [
      "Regulatory sandbox for innovations",
      "Three-tier classification system",
      "Mandatory compliance requirements"
    ]
  },
  {
    id: "jp",
    name: "Japan",
    coordinates: [35.6762, 139.6503],
    description: "Pioneer in crypto regulation",
    regulatoryFramework: "Payment Services Act (PSA)",
    keyRegulations: [
      "Licensed cryptocurrency exchanges",
      "Consumer protection measures",
      "Anti-money laundering compliance"
    ]
  },
  {
    id: "ae",
    name: "UAE (Dubai)",
    coordinates: [25.2048, 55.2708],
    description: "Emerging crypto hub with clear regulations",
    regulatoryFramework: "Virtual Asset Regulatory Authority (VARA)",
    keyRegulations: [
      "Comprehensive licensing framework",
      "Clear operational guidelines",
      "Innovation-friendly environment"
    ]
  }
];
