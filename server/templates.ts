import { Response, Request, NextFunction } from "express";
import { Express } from "express";
import { storage } from "./storage";

export function registerTemplateRoutes(app: Express) {
  // Get all templates
  app.get("/api/templates", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // For now, we'll return mock data for the template studio
    res.json([
      {
        id: "tmpl-1",
        name: "FATF Travel Rule Policy",
        category: "AML",
        region: "Global",
        description: "Standard policy template for implementing the FATF Travel Rule for virtual asset service providers",
        lastUpdated: "2025-03-01",
        status: "approved",
        version: "1.2",
        content: "# FATF Travel Rule Policy\n\n## 1. Overview\nThis policy outlines procedures for compliance with the Financial Action Task Force (FATF) Travel Rule...",
        tags: ["FATF", "Travel Rule", "VASP", "International"],
        useCount: 87,
        createdBy: "Global Compliance Team"
      },
      {
        id: "tmpl-2",
        name: "Customer Due Diligence Procedure",
        category: "KYC",
        region: "Global",
        description: "Comprehensive procedures for customer onboarding and ongoing due diligence",
        lastUpdated: "2025-02-15",
        status: "approved",
        version: "2.1",
        content: "# Customer Due Diligence Procedure\n\n## 1. Purpose\nThis procedure establishes the requirements for customer identification, verification, and risk assessment...",
        tags: ["KYC", "CDD", "Onboarding", "Risk Assessment"],
        useCount: 132,
        createdBy: "Global Compliance Team"
      },
      {
        id: "tmpl-3",
        name: "EU 6AMLD Compliance Framework",
        category: "AML",
        region: "European Union",
        description: "Framework for compliance with the EU's 6th Anti-Money Laundering Directive",
        lastUpdated: "2025-01-20",
        status: "approved",
        version: "1.3",
        content: "# EU 6AMLD Compliance Framework\n\n## 1. Introduction\nThis framework addresses requirements under the 6th Anti-Money Laundering Directive...",
        tags: ["EU", "6AMLD", "Europe"],
        useCount: 43,
        createdBy: "EU Compliance Team"
      },
      {
        id: "tmpl-4",
        name: "Transaction Monitoring Guidelines",
        category: "Monitoring",
        region: "Global",
        description: "Guidelines for implementing effective transaction monitoring systems",
        lastUpdated: "2025-02-28",
        status: "draft",
        version: "0.9",
        content: "# Transaction Monitoring Guidelines\n\n## 1. Objective\nThese guidelines outline best practices for transaction monitoring to detect suspicious activity...",
        tags: ["Monitoring", "Transactions", "Alerts"],
        useCount: 28,
        createdBy: "Risk Operations"
      },
      {
        id: "tmpl-5",
        name: "Crypto Asset Risk Classification Matrix",
        category: "Risk",
        region: "Global",
        description: "Matrix for classifying crypto assets based on risk factors",
        lastUpdated: "2025-03-10",
        status: "approved",
        version: "1.0",
        content: "# Crypto Asset Risk Classification Matrix\n\n## 1. Approach\nThis document provides a standardized approach to classifying crypto assets by risk level...",
        tags: ["Risk", "Classification", "Assets"],
        useCount: 64,
        createdBy: "Risk Management Team"
      },
      {
        id: "tmpl-6",
        name: "Singapore MAS PS-N02 Compliance",
        category: "Regulation",
        region: "Singapore",
        description: "Compliance framework for MAS Payment Services Notice PSN02",
        lastUpdated: "2025-02-05",
        status: "approved",
        version: "1.1",
        content: "# Singapore MAS PS-N02 Compliance\n\n## 1. Scope\nThis document outlines specific requirements for Digital Payment Token services under MAS Notice PSN02...",
        tags: ["Singapore", "MAS", "PSN02", "DPT"],
        useCount: 12,
        createdBy: "APAC Compliance Team"
      },
      {
        id: "tmpl-7",
        name: "Sanctions Screening Procedures",
        category: "Sanctions",
        region: "Global",
        description: "Procedures for effective sanctions screening and compliance",
        lastUpdated: "2025-02-10",
        status: "approved",
        version: "2.0",
        content: "# Sanctions Screening Procedures\n\n## 1. Purpose\nThis document establishes procedures for screening customers against international and domestic sanctions lists...",
        tags: ["Sanctions", "Screening", "OFAC", "UN"],
        useCount: 98,
        createdBy: "Global Compliance Team"
      },
      {
        id: "tmpl-8",
        name: "Suspicious Activity Report Filing Guide",
        category: "Reporting",
        region: "United States",
        description: "Comprehensive guide for filing SARs with FinCEN",
        lastUpdated: "2025-01-15",
        status: "approved",
        version: "1.4",
        content: "# Suspicious Activity Report Filing Guide\n\n## 1. Reporting Requirements\nThis guide outlines the requirements and procedures for filing Suspicious Activity Reports (SARs) with FinCEN...",
        tags: ["SAR", "FinCEN", "US", "Reporting"],
        useCount: 56,
        createdBy: "US Compliance Team"
      }
    ]);
  });

  // Get a specific template by ID
  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = req.params.id;
    
    // For demonstration purposes, we'll return a mock template
    if (id === "tmpl-1") {
      res.json({
        id: "tmpl-1",
        name: "FATF Travel Rule Policy",
        category: "AML",
        region: "Global",
        description: "Standard policy template for implementing the FATF Travel Rule for virtual asset service providers",
        lastUpdated: "2025-03-01",
        status: "approved",
        version: "1.2",
        content: "# FATF Travel Rule Policy\n\n## 1. Overview\nThis policy outlines procedures for compliance with the Financial Action Task Force (FATF) Travel Rule...\n\n## 2. Purpose\nTo establish standards for transmitting required originator and beneficiary information during virtual asset transfers.\n\n## 3. Scope\nThis policy applies to all virtual asset transfers conducted by [ENTITY_NAME] that meet the threshold requirements.\n\n## 4. Regulatory Background\nThe FATF Recommendation 16, known as the 'Travel Rule', requires VASPs and financial institutions to include and transmit originator and beneficiary information during virtual asset transfers.\n\n## 5. Requirements\n- Collect and verify required information for both originators and beneficiaries\n- Securely transmit this information to counterparty VASPs\n- Maintain records of all transmissions\n- Implement screening measures against sanctioned individuals and entities\n\n## 6. Implementation Procedures\n### 6.1 Technical Implementation\n[ENTITY_NAME] will utilize [PROTOCOL_NAME] for secure transmission of Travel Rule data.\n\n### 6.2 Threshold\nTravel Rule requirements apply to all virtual asset transfers valued at USD/EUR 1,000 or more.\n\n### 6.3 Required Information\nFor Originators:\n- Name\n- Account number/wallet address\n- Physical address, national identity number, or date and place of birth\n\nFor Beneficiaries:\n- Name\n- Account number/wallet address\n\n## 7. Compliance Review\nThis policy will be reviewed [REVIEW_FREQUENCY] to ensure alignment with evolving regulatory requirements and industry standards.\n\n## 8. Training\nAll relevant staff will receive training on Travel Rule requirements and implementation procedures.\n\n## 9. Record Keeping\nAll Travel Rule data and transmissions will be securely stored for a minimum of five years.\n\n## 10. Responsibility\n[COMPLIANCE_OFFICER_TITLE] is responsible for overseeing implementation and ongoing compliance with this policy.",
        tags: ["FATF", "Travel Rule", "VASP", "International"],
        useCount: 87,
        createdBy: "Global Compliance Team"
      });
    } else {
      res.status(404).json({ message: "Template not found" });
    }
  });
  
  // Get template categories
  app.get("/api/template-categories", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json([
      { id: "cat-1", name: "AML", description: "Anti-Money Laundering policies and procedures", templateCount: 24 },
      { id: "cat-2", name: "KYC", description: "Know Your Customer and Customer Due Diligence", templateCount: 18 },
      { id: "cat-3", name: "Monitoring", description: "Transaction and activity monitoring", templateCount: 15 },
      { id: "cat-4", name: "Risk", description: "Risk assessment frameworks and methodologies", templateCount: 12 },
      { id: "cat-5", name: "Sanctions", description: "Sanctions compliance and screening", templateCount: 10 },
      { id: "cat-6", name: "Reporting", description: "Regulatory reporting requirements and procedures", templateCount: 14 },
      { id: "cat-7", name: "Regulation", description: "Specific regulatory frameworks and requirements", templateCount: 22 }
    ]);
  });
  
  // Get regions
  app.get("/api/regions", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json([
      { id: "reg-1", name: "Global", description: "Global standards applicable worldwide" },
      { id: "reg-2", name: "United States", description: "US-specific regulatory requirements" },
      { id: "reg-3", name: "European Union", description: "EU-wide regulatory requirements" },
      { id: "reg-4", name: "United Kingdom", description: "UK-specific regulatory requirements" },
      { id: "reg-5", name: "Singapore", description: "Singapore-specific regulatory requirements" },
      { id: "reg-6", name: "Hong Kong", description: "Hong Kong-specific regulatory requirements" },
      { id: "reg-7", name: "Switzerland", description: "Switzerland-specific regulatory requirements" }
    ]);
  });
  
  // Get entities for implementation
  app.get("/api/entities", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json([
      { id: "ent-1", name: "CryptoX Exchange", type: "Exchange", jurisdiction: "Singapore" },
      { id: "ent-2", name: "DeFi Protocol Inc.", type: "DeFi Protocol", jurisdiction: "Switzerland" },
      { id: "ent-3", name: "StableCoin Ltd", type: "Stablecoin Issuer", jurisdiction: "United Kingdom" },
      { id: "ent-4", name: "Crypto Fund Partners", type: "Investment Fund", jurisdiction: "Cayman Islands" },
      { id: "ent-5", name: "NFT Marketplace Global", type: "NFT Marketplace", jurisdiction: "United States" }
    ]);
  });
  
  // Get users for assignment
  app.get("/api/users", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json([
      { id: "usr-1", name: "Sarah Johnson", role: "Compliance Officer", department: "Compliance" },
      { id: "usr-2", name: "Michael Chen", role: "Legal Counsel", department: "Legal" },
      { id: "usr-3", name: "Alex Williams", role: "Compliance Analyst", department: "Compliance" },
      { id: "usr-4", name: "Lisa Rodriguez", role: "Risk Manager", department: "Risk" },
      { id: "usr-5", name: "David Kim", role: "Compliance Director", department: "Compliance" }
    ]);
  });
  
  // Backward compatibility with existing endpoint to avoid breaking changes
  app.get("/api/policy-templates", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json([
      {
        id: "pt-1",
        name: "FATF Travel Rule Implementation",
        description: "Policy template for implementing the FATF Travel Rule for VASPs",
        category: "AML",
        jurisdiction: "Global",
        lastUpdated: "2025-01-15"
      },
      {
        id: "pt-2",
        name: "KYC Onboarding Procedure",
        description: "Standardized customer onboarding process aligned with global best practices",
        category: "KYC",
        jurisdiction: "Global",
        lastUpdated: "2025-02-20"
      },
      {
        id: "pt-3",
        name: "EU 6th AML Directive Compliance",
        description: "Comprehensive policy template for EU 6AMLD compliance",
        category: "AML",
        jurisdiction: "European Union",
        lastUpdated: "2025-03-10"
      }
    ]);
  });

  // Jurisdictions API Endpoints
  
  // Get all jurisdictions
  app.get("/api/jurisdictions", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      console.log('Fetching all jurisdictions from database...');
      const jurisdictions = await storage.getAllJurisdictions();
      console.log(`Successfully retrieved ${jurisdictions.length} jurisdictions`);
      res.json(jurisdictions);
    } catch (error) {
      console.error("Error fetching jurisdictions:", error);
      res.status(500).json({
        message: "Failed to fetch jurisdictions",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get a specific jurisdiction by ID
  // Endpoint for jurisdiction details moved to routes.ts to avoid duplication
  // Original endpoint returned basic jurisdiction data
  // The routes.ts version returns comprehensive data including related entities
  
  // Get regulatory bodies by jurisdiction ID
  app.get("/api/jurisdictions/:id/regulatory-bodies", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/regulatory-bodies');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching regulatory bodies for jurisdiction ID: ${id}`);
      const regulatoryBodies = await storage.getRegulatoryBodiesByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${regulatoryBodies.length} regulatory bodies`);
      res.json(regulatoryBodies);
    } catch (error) {
      console.error("Error fetching regulatory bodies:", error);
      res.status(500).json({
        message: "Failed to fetch regulatory bodies",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get regulations by jurisdiction ID
  app.get("/api/jurisdictions/:id/regulations", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/regulations');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching regulations for jurisdiction ID: ${id}`);
      const regulations = await storage.getRegulationsByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${regulations.length} regulations`);
      res.json(regulations);
    } catch (error) {
      console.error("Error fetching regulations:", error);
      res.status(500).json({
        message: "Failed to fetch regulations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get compliance requirements by jurisdiction ID
  app.get("/api/jurisdictions/:id/compliance-requirements", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/compliance-requirements');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching compliance requirements for jurisdiction ID: ${id}`);
      const complianceRequirements = await storage.getComplianceRequirementsByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${complianceRequirements.length} compliance requirements`);
      res.json(complianceRequirements);
    } catch (error) {
      console.error("Error fetching compliance requirements:", error);
      res.status(500).json({
        message: "Failed to fetch compliance requirements",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get taxation rules by jurisdiction ID
  app.get("/api/jurisdictions/:id/taxation-rules", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/taxation-rules');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching taxation rules for jurisdiction ID: ${id}`);
      const taxationRule = await storage.getTaxationRuleByJurisdictionId(id);
      
      if (!taxationRule) {
        return res.status(404).json({ message: "Taxation rules not found for this jurisdiction" });
      }
      
      console.log(`Successfully retrieved taxation rules for jurisdiction ID: ${id}`);
      res.json(taxationRule);
    } catch (error) {
      console.error("Error fetching taxation rules:", error);
      res.status(500).json({
        message: "Failed to fetch taxation rules",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get reporting obligations by jurisdiction ID
  app.get("/api/jurisdictions/:id/reporting-obligations", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/reporting-obligations');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching reporting obligations for jurisdiction ID: ${id}`);
      const reportingObligations = await storage.getReportingObligationsByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${reportingObligations.length} reporting obligations`);
      res.json(reportingObligations);
    } catch (error) {
      console.error("Error fetching reporting obligations:", error);
      res.status(500).json({
        message: "Failed to fetch reporting obligations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get regulatory updates by jurisdiction ID
  app.get("/api/jurisdictions/:id/regulatory-updates", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/regulatory-updates');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching regulatory updates for jurisdiction ID: ${id}`);
      const regulatoryUpdates = await storage.getRegulatoryUpdatesByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${regulatoryUpdates.length} regulatory updates`);
      res.json(regulatoryUpdates);
    } catch (error) {
      console.error("Error fetching regulatory updates:", error);
      res.status(500).json({
        message: "Failed to fetch regulatory updates",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get policies by jurisdiction ID
  app.get("/api/jurisdictions/:id/policies", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt to /api/jurisdictions/:id/policies');
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid jurisdiction ID" });
      }
      
      console.log(`Fetching policies for jurisdiction ID: ${id}`);
      const policies = await storage.getPoliciesByJurisdictionId(id);
      
      console.log(`Successfully retrieved ${policies.length} policies`);
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({
        message: "Failed to fetch policies",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}