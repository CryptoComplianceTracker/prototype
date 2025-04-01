import { db } from "../server/db";
import { checklist_categories, checklist_items } from "../shared/checklist-schema";
import { jurisdictions } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * This script seeds the UAE crypto exchange compliance checklists from the UAE official documentation
 * Based on: UAE Crypto Exchange Compliance Operations Checklist
 */
async function seedUaeChecklist() {
  try {
    console.log("Starting UAE checklist seeding...");
    
    // Find the UAE jurisdiction
    const [uae] = await db.select().from(jurisdictions)
      .where(eq(jurisdictions.name, "United Arab Emirates"));
    
    if (!uae) {
      console.error("UAE jurisdiction not found. Please create it first.");
      return;
    }
    
    // Check if categories already exist for this jurisdiction
    const existingCategories = await db.select().from(checklist_categories)
      .where(eq(checklist_categories.jurisdiction_id, uae.id));
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing categories. Skipping seeding.`);
      return;
    }
    
    console.log(`Found UAE jurisdiction with ID ${uae.id}. Starting to seed checklist data...`);
    
    // Define the categories and items
    const categories = [
      // Licensing & Regulatory Requirements
      {
        name: "Licensing & Regulatory Requirements",
        description: "Essential licensing and regulatory steps for setting up a crypto exchange in the UAE",
        sequence: 1,
        items: [
          {
            task: "Obtain a VARA (Virtual Assets Regulatory Authority) license for Dubai operations",
            responsible: "Legal/Compliance Officer",
            notes: "Required for all virtual asset service providers in Dubai",
            sequence: 1
          },
          {
            task: "Register with ADGM (Abu Dhabi Global Market) if operating in Abu Dhabi",
            responsible: "Legal/Compliance Officer",
            notes: "Required for virtual asset businesses in Abu Dhabi",
            sequence: 2
          },
          {
            task: "Obtain a Financial Services Permission (FSP) from the FSRA",
            responsible: "Legal/Compliance Officer",
            notes: "Required for regulated activities within ADGM jurisdiction",
            sequence: 3
          },
          {
            task: "Apply for Central Bank registration if offering fiat on/off ramps",
            responsible: "Legal/Compliance Officer",
            notes: "Mandatory for exchanges facilitating fiat currency transactions",
            sequence: 4
          },
          {
            task: "Secure commercial license from the Department of Economic Development",
            responsible: "Legal/Compliance Officer",
            notes: "Base business license required for operations",
            sequence: 5
          }
        ]
      },
      
      // AML/CTF Compliance
      {
        name: "AML/CTF Compliance",
        description: "Anti-Money Laundering and Counter-Terrorism Financing requirements",
        sequence: 2,
        items: [
          {
            task: "Implement a UAE-compliant AML policy framework",
            responsible: "Compliance Officer",
            notes: "Must align with Federal Decree Law No. (20) of 2018 on Anti-Money Laundering",
            sequence: 1
          },
          {
            task: "Appoint a Money Laundering Reporting Officer (MLRO)",
            responsible: "HR/Board",
            notes: "MLRO must be senior management with appropriate qualifications",
            sequence: 2
          },
          {
            task: "Establish relationships with UAE Financial Intelligence Unit (FIU)",
            responsible: "MLRO",
            notes: "For suspicious transaction reporting and regulatory communications",
            sequence: 3
          },
          {
            task: "Implement real-time transaction monitoring systems",
            responsible: "Technical/Compliance Team",
            notes: "System must be capable of flagging suspicious transactions based on UAE thresholds",
            sequence: 4
          },
          {
            task: "Create procedures for filing Suspicious Transaction Reports (STRs)",
            responsible: "MLRO",
            notes: "Must be filed within specified timeframes according to UAE regulations",
            sequence: 5
          },
          {
            task: "Perform sanctions screening against UAE-specific lists",
            responsible: "Compliance Team",
            notes: "Must include local UAE sanctions lists in addition to international lists",
            sequence: 6
          }
        ]
      },
      
      // KYC & Customer Due Diligence
      {
        name: "KYC & Customer Due Diligence",
        description: "Customer verification and ongoing due diligence requirements",
        sequence: 3,
        items: [
          {
            task: "Implement Emirates ID verification for UAE residents",
            responsible: "KYC Team",
            notes: "Primary ID verification method for UAE residents",
            sequence: 1
          },
          {
            task: "Establish verification procedures for non-UAE customers",
            responsible: "KYC Team",
            notes: "Should include passport verification and address proof methods acceptable in the UAE",
            sequence: 2
          },
          {
            task: "Create enhanced due diligence procedures for high-risk customers",
            responsible: "KYC/Compliance Team",
            notes: "Include specific requirements for Politically Exposed Persons (PEPs) under UAE standards",
            sequence: 3
          },
          {
            task: "Implement face verification compliant with UAE regulatory expectations",
            responsible: "Technical Team",
            notes: "Live verification or certified methods according to UAE standards",
            sequence: 4
          },
          {
            task: "Establish business verification for corporate customers",
            responsible: "KYC Team",
            notes: "Must include UAE trade license verification and beneficial ownership identification",
            sequence: 5
          }
        ]
      },
      
      // Operational Security
      {
        name: "Operational Security",
        description: "Security measures and safeguards for exchange operations",
        sequence: 4,
        items: [
          {
            task: "Implement UAE-compliant data protection measures",
            responsible: "Security Team",
            notes: "Must comply with UAE Federal Decree Law No. 45 of 2021 on Personal Data Protection",
            sequence: 1
          },
          {
            task: "Establish wallet management security protocols",
            responsible: "Security Team",
            notes: "Including cold storage solutions with UAE-based backup options",
            sequence: 2
          },
          {
            task: "Obtain cyber liability insurance with UAE coverage",
            responsible: "Finance Team",
            notes: "Insurance must be issued or recognized by UAE insurance authorities",
            sequence: 3
          },
          {
            task: "Establish an incident response procedure compliant with UAE notification requirements",
            responsible: "Security/Compliance Team",
            notes: "Must include required reporting to UAE authorities in case of breaches",
            sequence: 4
          },
          {
            task: "Implement UAE-compliant backup and recovery procedures",
            responsible: "Technical Team",
            notes: "Consider data localization requirements for sensitive information",
            sequence: 5
          }
        ]
      },
      
      // Financial & Accounting Requirements
      {
        name: "Financial & Accounting Requirements",
        description: "Financial compliance and accounting standards specific to UAE",
        sequence: 5,
        items: [
          {
            task: "Open UAE-based banking relationships",
            responsible: "Finance Team",
            notes: "Required for local operations and compliance with capital requirements",
            sequence: 1
          },
          {
            task: "Implement accounting standards compliant with UAE requirements",
            responsible: "Finance Team",
            notes: "IFRS standards with UAE-specific reporting adaptations",
            sequence: 2
          },
          {
            task: "Register for VAT if applicable (5% standard rate)",
            responsible: "Finance Team",
            notes: "Required for businesses with taxable supplies exceeding AED 375,000",
            sequence: 3
          },
          {
            task: "Establish proof of reserves verification process",
            responsible: "Finance/Compliance Team",
            notes: "Regular attestation of reserves required by UAE regulations",
            sequence: 4
          },
          {
            task: "Prepare for annual financial audits by UAE-approved auditors",
            responsible: "Finance Team",
            notes: "Must use auditors registered with relevant UAE authorities",
            sequence: 5
          }
        ]
      },
      
      // Customer Support & Dispute Resolution
      {
        name: "Customer Support & Dispute Resolution",
        description: "Customer service standards and complaint handling procedures",
        sequence: 6,
        items: [
          {
            task: "Establish Arabic language support capabilities",
            responsible: "Customer Support Team",
            notes: "Required for serving UAE customers according to local regulations",
            sequence: 1
          },
          {
            task: "Create UAE-compliant terms of service and user agreements",
            responsible: "Legal Team",
            notes: "Must include provisions specific to UAE law and jurisdiction",
            sequence: 2
          },
          {
            task: "Implement customer complaint handling procedures compliant with UAE consumer protection laws",
            responsible: "Customer Support/Legal Team",
            notes: "Including record-keeping requirements for UAE regulatory oversight",
            sequence: 3
          },
          {
            task: "Establish dispute resolution mechanisms including UAE arbitration options",
            responsible: "Legal Team",
            notes: "Consider DIFC Courts or Abu Dhabi Global Market Courts as venue options",
            sequence: 4
          }
        ]
      },
      
      // Trading Compliance & Market Integrity
      {
        name: "Trading Compliance & Market Integrity",
        description: "Market surveillance and trading compliance requirements",
        sequence: 7,
        items: [
          {
            task: "Implement market surveillance systems for detecting market manipulation",
            responsible: "Compliance/Technical Team",
            notes: "Required by UAE regulations to maintain market integrity",
            sequence: 1
          },
          {
            task: "Establish token listing review process compliant with UAE standards",
            responsible: "Legal/Compliance Team",
            notes: "Must include security token identification and compliance with securities regulations",
            sequence: 2
          },
          {
            task: "Create trading rules and fair market policies",
            responsible: "Compliance Team",
            notes: "Required documentation outlining market integrity standards",
            sequence: 3
          },
          {
            task: "Implement circuit breakers and volatility controls",
            responsible: "Technical Team",
            notes: "Required safeguards to prevent market disruption",
            sequence: 4
          }
        ]
      },
      
      // Ongoing Compliance & Reporting
      {
        name: "Ongoing Compliance & Reporting",
        description: "Regular reporting and ongoing compliance maintenance",
        sequence: 8,
        items: [
          {
            task: "Establish quarterly compliance reporting to UAE authorities",
            responsible: "Compliance Officer",
            notes: "Submit required reports to VARA, FSRA, or other applicable regulators",
            sequence: 1
          },
          {
            task: "Create a compliance calendar for UAE-specific deadlines",
            responsible: "Compliance Team",
            notes: "Should include all periodic reporting and renewal requirements",
            sequence: 2
          },
          {
            task: "Implement staff training on UAE regulatory requirements",
            responsible: "Compliance/HR Team",
            notes: "Regular training required by UAE regulations with documentation",
            sequence: 3
          },
          {
            task: "Establish annual compliance review process",
            responsible: "Compliance Officer",
            notes: "Comprehensive review of compliance with all UAE requirements",
            sequence: 4
          },
          {
            task: "Create procedures for tracking UAE regulatory changes",
            responsible: "Compliance Team",
            notes: "System to monitor and implement changes to UAE virtual asset regulations",
            sequence: 5
          }
        ]
      }
    ];
    
    // Insert the categories and items
    for (const category of categories) {
      console.log(`Creating category: ${category.name}`);
      
      const [categoryRecord] = await db.insert(checklist_categories)
        .values({
          jurisdiction_id: uae.id,
          name: category.name,
          description: category.description,
          sequence: category.sequence
        })
        .returning();
      
      for (const item of category.items) {
        console.log(`  - Creating item: ${item.task}`);
        
        await db.insert(checklist_items)
          .values({
            category_id: categoryRecord.id,
            task: item.task,
            responsible: item.responsible,
            notes: item.notes,
            sequence: item.sequence
          });
      }
    }
    
    console.log("UAE checklist seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding UAE checklist:", error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
seedUaeChecklist();