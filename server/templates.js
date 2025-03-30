// This file provides policy template routes for the application
import express from 'express';

/**
 * Registers template routes for policy templates
 * @param {express.Express} app - Express application instance
 */
export function registerTemplateRoutes(app) {
  // Get all templates
  app.get('/api/templates', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Return a list of available templates
    const templates = [
      {
        id: 1,
        name: "Basic AML Policy",
        description: "Standard Anti-Money Laundering policy template that complies with FATF recommendations.",
        category: "AML",
        jurisdictions: ["Global", "United States", "European Union"],
        lastUpdated: "2025-03-15",
        downloadCount: 427
      },
      {
        id: 2,
        name: "KYC Procedure Manual",
        description: "Comprehensive Know Your Customer procedures for crypto exchanges.",
        category: "KYC",
        jurisdictions: ["Global", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-10",
        downloadCount: 315
      },
      {
        id: 3,
        name: "Stablecoin Risk Assessment",
        description: "Risk assessment framework specifically designed for stablecoin issuers.",
        category: "Risk Assessment",
        jurisdictions: ["United States", "United Kingdom", "European Union"],
        lastUpdated: "2025-03-20",
        downloadCount: 189
      },
      {
        id: 4,
        name: "Travel Rule Compliance",
        description: "Policy template for compliance with the FATF Travel Rule for VASPs.",
        category: "Travel Rule",
        jurisdictions: ["Global", "United States", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-05",
        downloadCount: 256
      },
      {
        id: 5,
        name: "DeFi Governance Framework",
        description: "Governance structure and compliance considerations for decentralized protocols.",
        category: "Governance",
        jurisdictions: ["Global", "European Union"],
        lastUpdated: "2025-02-28",
        downloadCount: 142
      }
    ];
    
    res.json(templates);
  });
  
  // Get template by ID
  app.get('/api/templates/:id', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const templateId = parseInt(req.params.id);
    
    // Mock template content based on ID
    const templateContent = {
      1: {
        id: 1,
        name: "Basic AML Policy",
        description: "Standard Anti-Money Laundering policy template that complies with FATF recommendations.",
        content: `# Anti-Money Laundering Policy
        
## 1. Purpose and Scope
This policy establishes the principles and procedures for preventing money laundering and terrorist financing activities through our platform. It applies to all employees, contractors, and third-party service providers.

## 2. AML Officer Appointment
The company shall designate a qualified AML Compliance Officer responsible for implementing and overseeing the AML program.

## 3. Risk Assessment
3.1. Regular risk assessments shall be conducted to identify, assess, and mitigate money laundering risks.
3.2. Risk factors include customer types, geographic locations, transaction patterns, and service offerings.

## 4. Customer Due Diligence
4.1. Basic KYC procedures shall be applied to all customers.
4.2. Enhanced due diligence shall be conducted for high-risk customers.
4.3. Ongoing monitoring of customer relationships and transactions shall be performed.

## 5. Transaction Monitoring
5.1. Automated systems shall be implemented to detect suspicious activities.
5.2. Manual reviews shall supplement automated monitoring.
5.3. A risk-based approach shall be applied to transaction monitoring.

## 6. Reporting
6.1. Suspicious transactions shall be reported to the appropriate authorities.
6.2. Internal escalation procedures shall be established for potential AML concerns.

## 7. Record Keeping
All customer identification documents, transaction records, and suspicious activity reports shall be maintained for a minimum of five years.

## 8. Training
8.1. All employees shall receive AML training upon hiring and annually thereafter.
8.2. Training shall cover identification of suspicious activities, reporting procedures, and regulatory requirements.

## 9. Policy Review
This policy shall be reviewed and updated annually or when regulatory changes occur.`,
        category: "AML",
        jurisdictions: ["Global", "United States", "European Union"],
        lastUpdated: "2025-03-15",
        downloadCount: 427
      },
      2: {
        id: 2,
        name: "KYC Procedure Manual",
        description: "Comprehensive Know Your Customer procedures for crypto exchanges.",
        content: `# Know Your Customer (KYC) Procedure Manual for Crypto Exchanges

## 1. Introduction
This manual outlines the procedures for customer identification, verification, and ongoing monitoring in compliance with applicable laws and regulations.

## 2. Customer Identification Program
2.1. Customer Type Classification
- Individual Customers
- Corporate Customers
- Institutional Customers
- Fiduciary Arrangements

2.2. Required Information
- For Individuals: Full name, date of birth, address, identification numbers
- For Entities: Legal name, registration number, address, ownership structure, beneficial owners

## 3. Verification Procedures
3.1. Document Verification
- Government-issued photo ID
- Proof of address
- Corporate documents

3.2. Electronic Verification
- Database checks
- Biometric verification
- Digital ID verification

3.3. Enhanced Verification for High-Risk Customers
- Additional documentation
- Video verification
- Certification by trusted third parties

## 4. Risk-Based Approach
4.1. Risk Classification Criteria
- Geographic risk
- Customer risk
- Product/service risk
- Channel risk

4.2. Risk Scoring Methodology
- Initial risk assessment
- Ongoing risk monitoring
- Periodic reassessment

## 5. Customer Acceptance Policy
5.1. Approval Levels
5.2. Rejection Criteria
5.3. Escalation Procedures

## 6. Ongoing Monitoring
6.1. Transaction Monitoring
6.2. Profile Updates
6.3. Periodic Reviews

## 7. Record Keeping
7.1. Documentation Requirements
7.2. Retention Periods
7.3. Access Controls

## 8. Compliance Responsibilities
8.1. Role Designations
8.2. Reporting Chains
8.3. Quality Assurance

## 9. Appendices
9.1. KYC Forms
9.2. Verification Checklists
9.3. Regulatory References`,
        category: "KYC",
        jurisdictions: ["Global", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-10",
        downloadCount: 315
      },
      3: {
        id: 3,
        name: "Stablecoin Risk Assessment",
        description: "Risk assessment framework specifically designed for stablecoin issuers.",
        content: `# Stablecoin Risk Assessment Framework

## 1. Risk Assessment Overview
This framework provides a structured approach to identifying, assessing, and mitigating risks specific to stablecoin issuance and operation.

## 2. Stablecoin Classification
2.1. Fiat-Collateralized Stablecoins
2.2. Crypto-Collateralized Stablecoins
2.3. Algorithmic Stablecoins
2.4. Hybrid Models

## 3. Risk Categories
3.1. Reserve Risk
- Asset quality and liquidity
- Custodial security
- Diversification strategy
- Audit and attestation

3.2. Operational Risk
- Technical infrastructure
- Smart contract security
- Governance mechanisms
- Business continuity

3.3. Compliance Risk
- Regulatory status determination
- Jurisdictional analysis
- Licensing requirements
- Reporting obligations

3.4. Market Risk
- Peg stability mechanisms
- Market volatility impact
- Redemption processes
- Market liquidity

3.5. Legal Risk
- Contractual arrangements
- Liability assessment
- Consumer protection
- Intellectual property

## 4. Risk Assessment Methodology
4.1. Risk Identification
4.2. Risk Analysis
4.3. Risk Evaluation
4.4. Risk Treatment
4.5. Monitoring and Review

## 5. Risk Assessment Process
5.1. Initial Assessment
5.2. Periodic Reassessment
5.3. Event-Triggered Assessment

## 6. Risk Mitigation Strategies
6.1. Reserve Management
6.2. Technical Controls
6.3. Compliance Programs
6.4. Market Stabilization Mechanisms
6.5. Legal Safeguards

## 7. Documentation and Reporting
7.1. Risk Register
7.2. Risk Management Plan
7.3. Board Reporting
7.4. Regulatory Disclosure

## 8. Implementation Guidance
8.1. Roles and Responsibilities
8.2. Assessment Frequency
8.3. Integration with Enterprise Risk Management`,
        category: "Risk Assessment",
        jurisdictions: ["United States", "United Kingdom", "European Union"],
        lastUpdated: "2025-03-20",
        downloadCount: 189
      },
      // Default case for other IDs
      default: {
        id: templateId,
        name: "Template Not Found",
        description: "The requested template could not be found.",
        content: "No content available.",
        category: "Unknown",
        jurisdictions: [],
        lastUpdated: "N/A",
        downloadCount: 0
      }
    };
    
    const template = templateContent[templateId] || templateContent.default;
    res.json(template);
  });
  
  // Get templates by category
  app.get('/api/templates/category/:category', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const category = req.params.category;
    
    // Filter templates by category
    const templates = [
      {
        id: 1,
        name: "Basic AML Policy",
        description: "Standard Anti-Money Laundering policy template that complies with FATF recommendations.",
        category: "AML",
        jurisdictions: ["Global", "United States", "European Union"],
        lastUpdated: "2025-03-15",
        downloadCount: 427
      },
      {
        id: 2,
        name: "KYC Procedure Manual",
        description: "Comprehensive Know Your Customer procedures for crypto exchanges.",
        category: "KYC",
        jurisdictions: ["Global", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-10",
        downloadCount: 315
      },
      {
        id: 3,
        name: "Stablecoin Risk Assessment",
        description: "Risk assessment framework specifically designed for stablecoin issuers.",
        category: "Risk Assessment",
        jurisdictions: ["United States", "United Kingdom", "European Union"],
        lastUpdated: "2025-03-20",
        downloadCount: 189
      },
      {
        id: 4,
        name: "Travel Rule Compliance",
        description: "Policy template for compliance with the FATF Travel Rule for VASPs.",
        category: "Travel Rule",
        jurisdictions: ["Global", "United States", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-05",
        downloadCount: 256
      },
      {
        id: 5,
        name: "DeFi Governance Framework",
        description: "Governance structure and compliance considerations for decentralized protocols.",
        category: "Governance",
        jurisdictions: ["Global", "European Union"],
        lastUpdated: "2025-02-28",
        downloadCount: 142
      }
    ].filter(template => template.category === category);
    
    res.json(templates);
  });
  
  // Get templates by jurisdiction
  app.get('/api/templates/jurisdiction/:jurisdiction', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const jurisdiction = req.params.jurisdiction;
    
    // Filter templates by jurisdiction
    const templates = [
      {
        id: 1,
        name: "Basic AML Policy",
        description: "Standard Anti-Money Laundering policy template that complies with FATF recommendations.",
        category: "AML",
        jurisdictions: ["Global", "United States", "European Union"],
        lastUpdated: "2025-03-15",
        downloadCount: 427
      },
      {
        id: 2,
        name: "KYC Procedure Manual",
        description: "Comprehensive Know Your Customer procedures for crypto exchanges.",
        category: "KYC",
        jurisdictions: ["Global", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-10",
        downloadCount: 315
      },
      {
        id: 3,
        name: "Stablecoin Risk Assessment",
        description: "Risk assessment framework specifically designed for stablecoin issuers.",
        category: "Risk Assessment",
        jurisdictions: ["United States", "United Kingdom", "European Union"],
        lastUpdated: "2025-03-20",
        downloadCount: 189
      },
      {
        id: 4,
        name: "Travel Rule Compliance",
        description: "Policy template for compliance with the FATF Travel Rule for VASPs.",
        category: "Travel Rule",
        jurisdictions: ["Global", "United States", "Singapore", "Switzerland"],
        lastUpdated: "2025-03-05",
        downloadCount: 256
      },
      {
        id: 5,
        name: "DeFi Governance Framework",
        description: "Governance structure and compliance considerations for decentralized protocols.",
        category: "Governance",
        jurisdictions: ["Global", "European Union"],
        lastUpdated: "2025-02-28",
        downloadCount: 142
      }
    ].filter(template => template.jurisdictions.includes(jurisdiction));
    
    res.json(templates);
  });
}