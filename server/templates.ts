import { Response, Request, NextFunction } from "express";
import { Express } from "express";
import { storage } from "./storage";

export function registerTemplateRoutes(app: Express) {
  // Get all templates
  app.get("/api/templates", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      console.log('Fetching all templates from database...');
      const templates = await storage.getAllTemplates();
      console.log(`Successfully retrieved ${templates.length} templates`);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({
        message: "Failed to fetch templates",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific template by ID
  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      console.log(`Fetching template with ID: ${id}`);
      const template = await storage.getTemplate(id);
      
      if (!template) {
        console.log(`Template with ID ${id} not found`);
        return res.status(404).json({ message: "Template not found" });
      }
      
      console.log(`Successfully retrieved template with ID: ${id}`);
      
      // Increment the use count for this template
      await storage.incrementTemplateUseCount(id);
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({
        message: "Failed to fetch template",
        details: error instanceof Error ? error.message : "Unknown error"
      });
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
  
  // Create a new template
  app.post("/api/templates", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      console.log('Creating new template:', req.body);
      
      if (!req.body.name || !req.body.category || !req.body.content) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: "Name, category, and content are required fields" 
        });
      }
      
      // Set default values for optional fields
      const templateData = {
        ...req.body,
        status: req.body.status || "draft",
        version: req.body.version || "1.0",
        use_count: 0,
        created_by: req.user?.id || 0,
        updated_at: new Date(),
        created_at: new Date()
      };
      
      const template = await storage.createTemplate(templateData);
      console.log(`Successfully created template with ID: ${template.id}`);
      
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({
        message: "Failed to create template",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Update an existing template
  app.put("/api/templates/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      console.log(`Updating template with ID: ${id}`);
      
      // Verify the template exists
      const existingTemplate = await storage.getTemplate(id);
      
      if (!existingTemplate) {
        console.log(`Template with ID ${id} not found`);
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Update the template with the provided data
      const templateData = {
        ...req.body,
        updated_at: new Date()
      };
      
      const updatedTemplate = await storage.updateTemplate(id, templateData);
      
      if (!updatedTemplate) {
        return res.status(500).json({ message: "Failed to update template" });
      }
      
      console.log(`Successfully updated template with ID: ${id}`);
      res.json(updatedTemplate);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({
        message: "Failed to update template",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Delete a template
  app.delete("/api/templates/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      console.log(`Deleting template with ID: ${id}`);
      
      // Verify the template exists
      const existingTemplate = await storage.getTemplate(id);
      
      if (!existingTemplate) {
        console.log(`Template with ID ${id} not found`);
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Delete the template
      const success = await storage.deleteTemplate(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete template" });
      }
      
      console.log(`Successfully deleted template with ID: ${id}`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({
        message: "Failed to delete template",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get templates by category
  app.get("/api/templates/category/:category", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const category = req.params.category;
      
      console.log(`Fetching templates for category: ${category}`);
      const templates = await storage.getTemplatesByCategory(category);
      
      console.log(`Successfully retrieved ${templates.length} templates for category: ${category}`);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates by category:", error);
      res.status(500).json({
        message: "Failed to fetch templates by category",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get templates by region
  app.get("/api/templates/region/:region", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const region = req.params.region;
      
      console.log(`Fetching templates for region: ${region}`);
      const templates = await storage.getTemplatesByRegion(region);
      
      console.log(`Successfully retrieved ${templates.length} templates for region: ${region}`);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates by region:", error);
      res.status(500).json({
        message: "Failed to fetch templates by region",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
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