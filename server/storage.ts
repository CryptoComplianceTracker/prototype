import { 
  users, transactions, exchangeInfo, stablecoinInfo, defiProtocolInfo, nftMarketplaceInfo, cryptoFundInfo,
  registrations, registrationVersions, auditLogs,
  jurisdictions, regulatory_bodies, regulations, compliance_requirements, taxation_rules,
  reporting_obligations, regulatory_updates, jurisdiction_tags, jurisdiction_query_keywords, userJurisdictions,
  policy_templates, policies, policy_versions, policy_obligation_mappings, policy_tags, policy_approvals,
  templates, // Add templates import
  token_registrations, token_registration_documents, token_registration_verifications, token_risk_assessments, token_jurisdiction_approvals,
  type User, type InsertUser, type Transaction, type InsertExchangeInfo, type ExchangeInfo,
  type StablecoinInfo, type InsertStablecoinInfo,
  type DefiProtocolInfo, type InsertDefiProtocolInfo,
  type NftMarketplaceInfo, type InsertNftMarketplaceInfo,
  type CryptoFundInfo, type InsertCryptoFundInfo,
  type Registration, type InsertRegistration, type RegistrationVersion, type AuditLog,
  type Jurisdiction, type InsertJurisdiction,
  type RegulatoryBody, type InsertRegulatoryBody,
  type Regulation, type InsertRegulation,
  type ComplianceRequirement, type InsertComplianceRequirement,
  type TaxationRule, type InsertTaxationRule,
  type ReportingObligation, type InsertReportingObligation,
  type RegulatoryUpdate, type InsertRegulatoryUpdate,
  type JurisdictionTag, type InsertJurisdictionTag,
  type JurisdictionQueryKeyword, type InsertJurisdictionQueryKeyword,
  userJurisdictions as UserJurisdiction, type InsertJurisdiction as InsertUserJurisdiction,
  type PolicyTemplate, type InsertPolicyTemplate,
  type Policy, type InsertPolicy,
  type PolicyVersion, type InsertPolicyVersion,
  type PolicyObligationMapping, type InsertPolicyObligationMapping,
  type PolicyTag, type InsertPolicyTag,
  type PolicyApproval, type InsertPolicyApproval,
  type Template, type InsertTemplate, // Add Template types
  type TokenRegistration, type InsertTokenRegistration,
  type TokenRegistrationDocument, type InsertTokenRegistrationDocument,
  type TokenRegistrationVerification, type TokenRiskAssessment, type TokenJurisdictionApproval
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserKYC(id: number, data: Partial<User>): Promise<void>;

  // Exchange operations
  createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<ExchangeInfo>;
  getExchangeInfo(userId: number): Promise<ExchangeInfo | undefined>;
  getExchangeInfoByUserId(userId: number): Promise<ExchangeInfo[]>;

  // Transaction operations
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction>;

  // Session store
  sessionStore: session.Store;

  // Admin operations
  getAllExchangeInfo(): Promise<ExchangeInfo[]>;
  getAllStablecoinInfo(): Promise<StablecoinInfo[]>;
  getAllDefiProtocolInfo(): Promise<DefiProtocolInfo[]>;
  getAllNftMarketplaceInfo(): Promise<NftMarketplaceInfo[]>;
  getAllCryptoFundInfo(): Promise<CryptoFundInfo[]>;
  
  // Policy admin operations
  getAllPolicies(): Promise<Policy[]>;

  // Stablecoin operations
  createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<StablecoinInfo>;
  getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined>;
  getStablecoinInfoByUserId(userId: number): Promise<StablecoinInfo[]>;

  // DeFi Protocol operations
  createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<DefiProtocolInfo>;
  getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined>;
  getDefiProtocolInfoByUserId(userId: number): Promise<DefiProtocolInfo[]>;

  // NFT Marketplace operations
  createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<NftMarketplaceInfo>;
  getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined>;
  getNftMarketplaceInfoByUserId(userId: number): Promise<NftMarketplaceInfo[]>;

  // Crypto Fund operations
  createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<CryptoFundInfo>;
  getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined>;
  getCryptoFundInfoByUserId(userId: number): Promise<CryptoFundInfo[]>;

  // New unified registration methods
  createRegistration(userId: number, registration: InsertRegistration): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationsByUserId(userId: number): Promise<Registration[]>;
  getRegistrationsByType(type: string): Promise<Registration[]>;
  updateRegistration(id: number, data: Partial<Registration>): Promise<Registration>;

  // Version tracking
  createRegistrationVersion(registrationId: number, version: Partial<RegistrationVersion>): Promise<RegistrationVersion>;
  getRegistrationVersions(registrationId: number): Promise<RegistrationVersion[]>;

  // Audit logging
  createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog>;
  getAuditLogs(tableName: string, recordId: number): Promise<AuditLog[]>;
  
  // Jurisdiction database
  createJurisdiction(data: InsertJurisdiction): Promise<Jurisdiction>;
  getJurisdiction(id: number): Promise<Jurisdiction | undefined>;
  getJurisdictionByName(name: string): Promise<Jurisdiction | undefined>;
  getAllJurisdictions(): Promise<Jurisdiction[]>;
  updateJurisdiction(id: number, data: Partial<Jurisdiction>): Promise<Jurisdiction>;
  
  // Regulatory bodies
  createRegulatoryBody(data: InsertRegulatoryBody): Promise<RegulatoryBody>;
  getRegulatoryBodiesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryBody[]>;
  updateRegulatoryBody(id: number, data: Partial<RegulatoryBody>): Promise<RegulatoryBody>;
  
  // Regulations
  createRegulation(data: InsertRegulation): Promise<Regulation>;
  getRegulationsByJurisdictionId(jurisdictionId: number): Promise<Regulation[]>;
  updateRegulation(id: number, data: Partial<Regulation>): Promise<Regulation>;
  
  // Compliance requirements
  createComplianceRequirement(data: InsertComplianceRequirement): Promise<ComplianceRequirement>;
  getComplianceRequirementsByJurisdictionId(jurisdictionId: number): Promise<ComplianceRequirement[]>;
  updateComplianceRequirement(id: number, data: Partial<ComplianceRequirement>): Promise<ComplianceRequirement>;
  
  // Taxation rules
  createTaxationRule(data: InsertTaxationRule): Promise<TaxationRule>;
  getTaxationRuleByJurisdictionId(jurisdictionId: number): Promise<TaxationRule | undefined>;
  updateTaxationRule(id: number, data: Partial<TaxationRule>): Promise<TaxationRule>;
  
  // Reporting obligations
  createReportingObligation(data: InsertReportingObligation): Promise<ReportingObligation>;
  getReportingObligationsByJurisdictionId(jurisdictionId: number): Promise<ReportingObligation[]>;
  updateReportingObligation(id: number, data: Partial<ReportingObligation>): Promise<ReportingObligation>;
  
  // Regulatory updates
  createRegulatoryUpdate(data: InsertRegulatoryUpdate): Promise<RegulatoryUpdate>;
  getRegulatoryUpdatesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryUpdate[]>;
  updateRegulatoryUpdate(id: number, data: Partial<RegulatoryUpdate>): Promise<RegulatoryUpdate>;
  
  // Tags and keywords
  createJurisdictionTag(data: InsertJurisdictionTag): Promise<JurisdictionTag>;
  getJurisdictionTagsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionTag[]>;
  createJurisdictionQueryKeyword(data: InsertJurisdictionQueryKeyword): Promise<JurisdictionQueryKeyword>;
  getJurisdictionQueryKeywordsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionQueryKeyword[]>;
  
  // User Jurisdictions methods
  getUserJurisdictions(userId: number): Promise<UserJurisdiction[]>;
  getUserJurisdictionWithDetails(userId: number): Promise<any[]>;
  createUserJurisdiction(data: InsertUserJurisdiction): Promise<UserJurisdiction>;
  updateUserJurisdiction(id: number, data: Partial<UserJurisdiction>): Promise<UserJurisdiction>;
  deleteUserJurisdiction(id: number): Promise<void>;
  
  // Policy Framework methods
  createPolicyTemplate(data: InsertPolicyTemplate): Promise<PolicyTemplate>;
  getPolicyTemplate(id: number): Promise<PolicyTemplate | undefined>;
  getPolicyTemplatesByCategory(category: string): Promise<PolicyTemplate[]>;
  getAllPolicyTemplates(): Promise<PolicyTemplate[]>;
  
  // Template Studio methods
  createTemplate(data: InsertTemplate): Promise<Template>;
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getTemplatesByRegion(region: string): Promise<Template[]>;
  getAllTemplates(): Promise<Template[]>;
  updateTemplate(id: number, data: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  incrementTemplateUseCount(id: number): Promise<void>;
  
  createPolicy(userId: number, data: InsertPolicy): Promise<Policy>;
  getPolicy(id: number): Promise<Policy | undefined>;
  getPoliciesByUserId(userId: number): Promise<Policy[]>;
  getPoliciesByJurisdictionId(jurisdictionId: number): Promise<Policy[]>;
  getPoliciesByStatus(status: string): Promise<Policy[]>;
  getPoliciesByType(type: string): Promise<Policy[]>;
  updatePolicy(id: number, data: Partial<Policy>): Promise<Policy>;
  
  createPolicyVersion(policyId: number, userId: number, data: InsertPolicyVersion): Promise<PolicyVersion>;
  getPolicyVersions(policyId: number): Promise<PolicyVersion[]>;
  
  createPolicyTag(data: InsertPolicyTag): Promise<PolicyTag>;
  getPolicyTagsByPolicyId(policyId: number): Promise<PolicyTag[]>;
  
  createPolicyApproval(data: InsertPolicyApproval): Promise<PolicyApproval>;
  getPolicyApprovalsByPolicyId(policyId: number): Promise<PolicyApproval[]>;
  
  createPolicyObligationMapping(data: InsertPolicyObligationMapping): Promise<PolicyObligationMapping>;
  getPolicyObligationMappingsByPolicyId(policyId: number): Promise<PolicyObligationMapping[]>;
  getPolicyObligationMappingsByObligationId(obligationId: number): Promise<PolicyObligationMapping[]>;
  
  // Token Registration methods
  createTokenRegistration(userId: number, data: InsertTokenRegistration): Promise<TokenRegistration>;
  getTokenRegistration(id: number): Promise<TokenRegistration | undefined>;
  getTokenRegistrationsByUserId(userId: number): Promise<TokenRegistration[]>;
  getAllTokenRegistrations(): Promise<TokenRegistration[]>;
  getTokenRegistrationsByCategory(category: string): Promise<TokenRegistration[]>;
  updateTokenRegistration(id: number, data: Partial<TokenRegistration>): Promise<TokenRegistration>;
  
  // Token Registration Documents
  createTokenRegistrationDocument(data: InsertTokenRegistrationDocument): Promise<TokenRegistrationDocument>;
  getTokenRegistrationDocuments(tokenRegistrationId: number): Promise<TokenRegistrationDocument[]>;
  
  // Token Registration Verifications
  createTokenRegistrationVerification(data: Omit<TokenRegistrationVerification, "id" | "verificationDate">): Promise<TokenRegistrationVerification>;
  getTokenRegistrationVerifications(tokenRegistrationId: number): Promise<TokenRegistrationVerification[]>;
  
  // Token Risk Assessments
  createTokenRiskAssessment(data: Omit<TokenRiskAssessment, "id" | "assessmentDate">): Promise<TokenRiskAssessment>;
  getTokenRiskAssessments(tokenRegistrationId: number): Promise<TokenRiskAssessment[]>;
  
  // Token Jurisdiction Approvals
  createTokenJurisdictionApproval(data: Omit<TokenJurisdictionApproval, "id">): Promise<TokenJurisdictionApproval>;
  getTokenJurisdictionApprovals(tokenRegistrationId: number): Promise<TokenJurisdictionApproval[]>;
  getTokenJurisdictionApprovalsByJurisdiction(jurisdictionId: number): Promise<TokenJurisdictionApproval[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }
  
  // Jurisdiction methods
  async createJurisdiction(data: InsertJurisdiction): Promise<Jurisdiction> {
    const [jurisdiction] = await db.insert(jurisdictions).values(data).returning();
    return jurisdiction;
  }

  async getJurisdiction(id: number): Promise<Jurisdiction | undefined> {
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, id));
    return jurisdiction;
  }

  async getJurisdictionByName(name: string): Promise<Jurisdiction | undefined> {
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.name, name));
    return jurisdiction;
  }

  async getAllJurisdictions(): Promise<Jurisdiction[]> {
    const results = await db.select().from(jurisdictions);
    
    // Convert to the expected Jurisdiction type
    return results.map(jurisdiction => ({
      id: jurisdiction.id,
      name: jurisdiction.name,
      region: jurisdiction.region,
      risk_level: jurisdiction.risk_level,
      favorability_score: jurisdiction.favorability_score,
      notes: jurisdiction.notes,
      created_at: jurisdiction.created_at,
      updated_at: jurisdiction.updated_at,
      iso_code: jurisdiction.iso_code,
      currency_code: jurisdiction.currency_code, 
      is_fatf_member: jurisdiction.is_fatf_member,
      legal_system_type: jurisdiction.legal_system_type,
      national_language: jurisdiction.national_language,
      central_bank_url: jurisdiction.central_bank_url,
      financial_licensing_portal: jurisdiction.financial_licensing_portal,
      contact_email: jurisdiction.contact_email,
      last_updated: jurisdiction.last_updated
    }));
  }

  async updateJurisdiction(id: number, data: Partial<Jurisdiction>): Promise<Jurisdiction> {
    // Only set fields that existed in the original schema
    const updateData: any = {
      updated_at: new Date()
    };
    
    if (data.name) updateData.name = data.name;
    if (data.region) updateData.region = data.region;
    if (data.risk_level) updateData.risk_level = data.risk_level;
    if (data.favorability_score) updateData.favorability_score = data.favorability_score;
    if (data.notes) updateData.notes = data.notes;
    
    const [updated] = await db.update(jurisdictions)
      .set(updateData)
      .where(eq(jurisdictions.id, id))
      .returning();
    return updated;
  }

  // Regulatory bodies methods
  async createRegulatoryBody(data: InsertRegulatoryBody): Promise<RegulatoryBody> {
    const [body] = await db.insert(regulatory_bodies).values(data).returning();
    return body;
  }

  async getRegulatoryBodiesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryBody[]> {
    return await db.select()
      .from(regulatory_bodies)
      .where(eq(regulatory_bodies.jurisdiction_id, jurisdictionId));
  }

  async updateRegulatoryBody(id: number, data: Partial<RegulatoryBody>): Promise<RegulatoryBody> {
    const [updated] = await db.update(regulatory_bodies)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulatory_bodies.id, id))
      .returning();
    return updated;
  }

  // Regulations methods
  async createRegulation(data: InsertRegulation): Promise<Regulation> {
    const [regulation] = await db.insert(regulations).values(data).returning();
    return regulation;
  }

  async getRegulationsByJurisdictionId(jurisdictionId: number): Promise<Regulation[]> {
    return await db.select()
      .from(regulations)
      .where(eq(regulations.jurisdiction_id, jurisdictionId));
  }

  async updateRegulation(id: number, data: Partial<Regulation>): Promise<Regulation> {
    const [updated] = await db.update(regulations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulations.id, id))
      .returning();
    return updated;
  }

  // Compliance requirements methods
  async createComplianceRequirement(data: InsertComplianceRequirement): Promise<ComplianceRequirement> {
    const [requirement] = await db.insert(compliance_requirements).values(data).returning();
    return requirement;
  }

  async getComplianceRequirementsByJurisdictionId(jurisdictionId: number): Promise<ComplianceRequirement[]> {
    return await db.select()
      .from(compliance_requirements)
      .where(eq(compliance_requirements.jurisdiction_id, jurisdictionId));
  }

  async updateComplianceRequirement(id: number, data: Partial<ComplianceRequirement>): Promise<ComplianceRequirement> {
    const [updated] = await db.update(compliance_requirements)
      .set({ ...data, updated_at: new Date() })
      .where(eq(compliance_requirements.id, id))
      .returning();
    return updated;
  }

  // Taxation rules methods
  async createTaxationRule(data: InsertTaxationRule): Promise<TaxationRule> {
    const [rule] = await db.insert(taxation_rules).values(data).returning();
    return rule;
  }

  async getTaxationRuleByJurisdictionId(jurisdictionId: number): Promise<TaxationRule | undefined> {
    const [rule] = await db.select()
      .from(taxation_rules)
      .where(eq(taxation_rules.jurisdiction_id, jurisdictionId));
    return rule;
  }

  async updateTaxationRule(id: number, data: Partial<TaxationRule>): Promise<TaxationRule> {
    const [updated] = await db.update(taxation_rules)
      .set({ ...data, updated_at: new Date() })
      .where(eq(taxation_rules.id, id))
      .returning();
    return updated;
  }

  // Reporting obligations methods
  async createReportingObligation(data: InsertReportingObligation): Promise<ReportingObligation> {
    const [obligation] = await db.insert(reporting_obligations).values(data).returning();
    return obligation;
  }

  async getReportingObligationsByJurisdictionId(jurisdictionId: number): Promise<ReportingObligation[]> {
    return await db.select()
      .from(reporting_obligations)
      .where(eq(reporting_obligations.jurisdiction_id, jurisdictionId));
  }

  async updateReportingObligation(id: number, data: Partial<ReportingObligation>): Promise<ReportingObligation> {
    const [updated] = await db.update(reporting_obligations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(reporting_obligations.id, id))
      .returning();
    return updated;
  }

  // Regulatory updates methods
  async createRegulatoryUpdate(data: InsertRegulatoryUpdate): Promise<RegulatoryUpdate> {
    const [update] = await db.insert(regulatory_updates).values(data).returning();
    return update;
  }

  async getRegulatoryUpdatesByJurisdictionId(jurisdictionId: number): Promise<RegulatoryUpdate[]> {
    return await db.select()
      .from(regulatory_updates)
      .where(eq(regulatory_updates.jurisdiction_id, jurisdictionId));
  }

  async updateRegulatoryUpdate(id: number, data: Partial<RegulatoryUpdate>): Promise<RegulatoryUpdate> {
    const [updated] = await db.update(regulatory_updates)
      .set({ ...data, updated_at: new Date() })
      .where(eq(regulatory_updates.id, id))
      .returning();
    return updated;
  }

  // Tags and keywords methods
  async createJurisdictionTag(data: InsertJurisdictionTag): Promise<JurisdictionTag> {
    const [tag] = await db.insert(jurisdiction_tags).values(data).returning();
    return tag;
  }

  async getJurisdictionTagsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionTag[]> {
    return await db.select()
      .from(jurisdiction_tags)
      .where(eq(jurisdiction_tags.jurisdiction_id, jurisdictionId));
  }

  async createJurisdictionQueryKeyword(data: InsertJurisdictionQueryKeyword): Promise<JurisdictionQueryKeyword> {
    const [keyword] = await db.insert(jurisdiction_query_keywords).values(data).returning();
    return keyword;
  }

  async getJurisdictionQueryKeywordsByJurisdictionId(jurisdictionId: number): Promise<JurisdictionQueryKeyword[]> {
    return await db.select()
      .from(jurisdiction_query_keywords)
      .where(eq(jurisdiction_query_keywords.jurisdiction_id, jurisdictionId));
  }
  
  // User Jurisdictions methods implementation
  async getUserJurisdictions(userId: number): Promise<UserJurisdiction[]> {
    return await db.select()
      .from(userJurisdictions)
      .where(eq(userJurisdictions.user_id, userId));
  }
  
  async getUserJurisdictionWithDetails(userId: number): Promise<any[]> {
    return await db.select({
      id: userJurisdictions.id,
      user_id: userJurisdictions.user_id,
      jurisdiction_id: userJurisdictions.jurisdiction_id,
      is_primary: userJurisdictions.is_primary,
      notes: userJurisdictions.notes,
      added_at: userJurisdictions.added_at,
      // Join with jurisdictions to get jurisdiction details
      jurisdiction_name: jurisdictions.name,
      jurisdiction_region: jurisdictions.region,
      jurisdiction_risk_level: jurisdictions.risk_level
    })
    .from(userJurisdictions)
    .innerJoin(jurisdictions, eq(userJurisdictions.jurisdiction_id, jurisdictions.id))
    .where(eq(userJurisdictions.user_id, userId));
  }
  
  async createUserJurisdiction(data: InsertUserJurisdiction): Promise<UserJurisdiction> {
    const [subscription] = await db.insert(userJurisdictions)
      .values({
        ...data,
        added_at: new Date()
      })
      .returning();
    return subscription;
  }
  
  async updateUserJurisdiction(id: number, data: Partial<UserJurisdiction>): Promise<UserJurisdiction> {
    const [updated] = await db.update(userJurisdictions)
      .set(data)
      .where(eq(userJurisdictions.id, id))
      .returning();
    return updated;
  }
  
  async deleteUserJurisdiction(id: number): Promise<void> {
    await db.delete(userJurisdictions)
      .where(eq(userJurisdictions.id, id));
  }
  
  // Policy Framework methods implementation
  async createPolicyTemplate(data: InsertPolicyTemplate): Promise<PolicyTemplate> {
    const [template] = await db.insert(policy_templates).values(data).returning();
    return template;
  }
  
  async getPolicyTemplate(id: number): Promise<PolicyTemplate | undefined> {
    const [template] = await db.select().from(policy_templates).where(eq(policy_templates.id, id));
    return template;
  }
  
  async getPolicyTemplatesByCategory(category: string): Promise<PolicyTemplate[]> {
    return await db.select()
      .from(policy_templates)
      .where(eq(policy_templates.category, category));
  }
  
  async getAllPolicyTemplates(): Promise<PolicyTemplate[]> {
    return await db.select().from(policy_templates);
  }
  
  // Template Studio methods implementation
  async createTemplate(data: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values({
      ...data,
      last_updated: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    return template;
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }
  
  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select()
      .from(templates)
      .where(eq(templates.category, category));
  }
  
  async getTemplatesByRegion(region: string): Promise<Template[]> {
    return await db.select()
      .from(templates)
      .where(eq(templates.region, region));
  }
  
  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }
  
  async updateTemplate(id: number, data: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updated] = await db.update(templates)
      .set({
        ...data,
        last_updated: new Date(),
        updated_at: new Date()
      })
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db.delete(templates)
      .where(eq(templates.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  async incrementTemplateUseCount(id: number): Promise<void> {
    await db.update(templates)
      .set({
        use_count: sql`${templates.use_count} + 1`,
        last_updated: new Date(),
        updated_at: new Date()
      })
      .where(eq(templates.id, id));
  }
  
  async createPolicy(userId: number, data: InsertPolicy): Promise<Policy> {
    // Check if the schema has a description field
    const hasDescription = await this.tableHasColumn('policies', 'description');
    
    if (hasDescription) {
      // Insert with description if the column exists
      const [policy] = await db.insert(policies).values({
        ...data,
        created_by: userId
      }).returning();
      return policy;
    } else {
      // Remove description if the column doesn't exist
      const { description, ...restData } = data as any;
      const [policy] = await db.insert(policies).values({
        ...restData,
        created_by: userId
      }).returning();
      return policy;
    }
  }
  
  // Helper method to check if a table has a specific column
  async tableHasColumn(tableName: string, columnName: string): Promise<boolean> {
    try {
      const result = await db.execute(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' AND column_name = '${columnName}'
      `);
      return result.rows.length > 0;
    } catch (error) {
      console.error(`Error checking if table ${tableName} has column ${columnName}:`, error);
      return false;
    }
  }
  
  async getPolicy(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }
  
  async getPoliciesByUserId(userId: number): Promise<Policy[]> {
    return await db.select().from(policies).where(eq(policies.created_by, userId));
  }
  
  async getPoliciesByJurisdictionId(jurisdictionId: number): Promise<Policy[]> {
    return await db.select().from(policies).where(eq(policies.jurisdiction_id, jurisdictionId));
  }
  
  async getPoliciesByStatus(status: string): Promise<Policy[]> {
    return await db.select().from(policies).where(eq(policies.status, status));
  }
  
  async getPoliciesByType(type: string): Promise<Policy[]> {
    return await db.select().from(policies).where(eq(policies.type, type));
  }
  
  async getAllPolicies(): Promise<Policy[]> {
    return await db.select().from(policies).orderBy(desc(policies.updated_at));
  }
  
  async updatePolicy(id: number, data: Partial<Policy>): Promise<Policy> {
    const [updated] = await db.update(policies)
      .set({ ...data, updated_at: new Date() })
      .where(eq(policies.id, id))
      .returning();
    return updated;
  }
  
  async createPolicyVersion(policyId: number, userId: number, data: InsertPolicyVersion): Promise<PolicyVersion> {
    const [version] = await db.insert(policy_versions).values({
      ...data,
      policy_id: policyId,
      created_by: userId
    }).returning();
    return version;
  }
  
  async getPolicyVersions(policyId: number): Promise<PolicyVersion[]> {
    return await db.select()
      .from(policy_versions)
      .where(eq(policy_versions.policy_id, policyId))
      .orderBy(desc(policy_versions.created_at));
  }
  
  async createPolicyTag(data: InsertPolicyTag): Promise<PolicyTag> {
    const [tag] = await db.insert(policy_tags).values(data).returning();
    return tag;
  }
  
  async getPolicyTagsByPolicyId(policyId: number): Promise<PolicyTag[]> {
    return await db.select()
      .from(policy_tags)
      .where(eq(policy_tags.policy_id, policyId));
  }
  
  async createPolicyApproval(data: InsertPolicyApproval): Promise<PolicyApproval> {
    const [approval] = await db.insert(policy_approvals).values(data).returning();
    return approval;
  }
  
  async getPolicyApprovalsByPolicyId(policyId: number): Promise<PolicyApproval[]> {
    return await db.select()
      .from(policy_approvals)
      .where(eq(policy_approvals.policy_id, policyId))
      .orderBy(desc(policy_approvals.created_at));
  }
  
  async createPolicyObligationMapping(data: InsertPolicyObligationMapping): Promise<PolicyObligationMapping> {
    const [mapping] = await db.insert(policy_obligation_mappings).values(data).returning();
    return mapping;
  }
  
  async getPolicyObligationMappingsByPolicyId(policyId: number): Promise<PolicyObligationMapping[]> {
    return await db.select()
      .from(policy_obligation_mappings)
      .where(eq(policy_obligation_mappings.policy_id, policyId));
  }
  
  async getPolicyObligationMappingsByObligationId(obligationId: number): Promise<PolicyObligationMapping[]> {
    return await db.select()
      .from(policy_obligation_mappings)
      .where(eq(policy_obligation_mappings.obligation_id, obligationId));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserKYC(id: number, data: Partial<User>): Promise<void> {
    await db.update(users)
      .set(data)
      .where(eq(users.id, id));
  }

  async createExchangeInfo(userId: number, info: InsertExchangeInfo): Promise<ExchangeInfo> {
    const [created] = await db.insert(exchangeInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getExchangeInfo(userId: number): Promise<ExchangeInfo | undefined> {
    const [info] = await db.select().from(exchangeInfo).where(eq(exchangeInfo.userId, userId));
    return info;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  }

  async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getAllExchangeInfo(): Promise<ExchangeInfo[]> {
    try {
      const exchanges = await db.select().from(exchangeInfo);
      console.log("Raw exchanges from database:", exchanges);

      // Transform and validate exchange data
      return exchanges.map(exchange => ({
        ...exchange,
        exchangeType: this.validateExchangeType(exchange.exchangeType),
        washTradingDetection: this.parseJsonField(exchange.washTradingDetection),
        custodyArrangements: this.parseJsonField(exchange.custodyArrangements),
        securityMeasures: this.parseJsonField(exchange.securityMeasures),
        riskManagement: this.parseJsonField(exchange.riskManagement),
        kycVerificationMetrics: this.parseJsonField(exchange.kycVerificationMetrics),
        sanctionsCompliance: this.parseJsonField(exchange.sanctionsCompliance),
        insuranceCoverage: this.parseJsonField(exchange.insuranceCoverage),
        supportedBlockchains: this.parseJsonField(exchange.supportedBlockchains),
        blockchainAnalytics: this.parseJsonField(exchange.blockchainAnalytics)
      }));
    } catch (error) {
      console.error("Error in getAllExchangeInfo:", error);
      throw new Error(`Failed to fetch exchange info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getAllStablecoinInfo(): Promise<StablecoinInfo[]> {
    try {
      const stablecoins = await db.select().from(stablecoinInfo);
      console.log(`Retrieved ${stablecoins.length} stablecoin registrations`);
      return stablecoins;
    } catch (error) {
      console.error("Error in getAllStablecoinInfo:", error);
      throw new Error(`Failed to fetch stablecoin info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllDefiProtocolInfo(): Promise<DefiProtocolInfo[]> {
    try {
      const defiProtocols = await db.select().from(defiProtocolInfo);
      console.log(`Retrieved ${defiProtocols.length} DeFi protocol registrations`);
      return defiProtocols;
    } catch (error) {
      console.error("Error in getAllDefiProtocolInfo:", error);
      throw new Error(`Failed to fetch DeFi protocol info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllNftMarketplaceInfo(): Promise<NftMarketplaceInfo[]> {
    try {
      const nftMarketplaces = await db.select().from(nftMarketplaceInfo);
      console.log(`Retrieved ${nftMarketplaces.length} NFT marketplace registrations`);
      return nftMarketplaces;
    } catch (error) {
      console.error("Error in getAllNftMarketplaceInfo:", error);
      throw new Error(`Failed to fetch NFT marketplace info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllCryptoFundInfo(): Promise<CryptoFundInfo[]> {
    try {
      const cryptoFunds = await db.select().from(cryptoFundInfo);
      console.log(`Retrieved ${cryptoFunds.length} crypto fund registrations`);
      return cryptoFunds;
    } catch (error) {
      console.error("Error in getAllCryptoFundInfo:", error);
      throw new Error(`Failed to fetch crypto fund info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper function to validate exchange type
  private validateExchangeType(type: string): "DEX" | "CEX" {
    if (type !== "DEX" && type !== "CEX") {
      console.warn(`Invalid exchange type "${type}" found, defaulting to "CEX"`);
      return "CEX";
    }
    return type;
  }

  private parseJsonField(field: unknown): Record<string, unknown> {
    if (!field) return {};
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return {};
      }
    }
    if (typeof field === 'object') {
      return field as Record<string, unknown>;
    }
    return {};
  }

  async createStablecoinInfo(userId: number, info: InsertStablecoinInfo): Promise<StablecoinInfo> {
    const [created] = await db.insert(stablecoinInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getStablecoinInfo(userId: number): Promise<StablecoinInfo | undefined> {
    const [info] = await db.select().from(stablecoinInfo).where(eq(stablecoinInfo.userId, userId));
    return info;
  }

  async createDefiProtocolInfo(userId: number, info: InsertDefiProtocolInfo): Promise<DefiProtocolInfo> {
    const [created] = await db.insert(defiProtocolInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getDefiProtocolInfo(userId: number): Promise<DefiProtocolInfo | undefined> {
    const [info] = await db.select().from(defiProtocolInfo).where(eq(defiProtocolInfo.userId, userId));
    return info;
  }

  async createNftMarketplaceInfo(userId: number, info: InsertNftMarketplaceInfo): Promise<NftMarketplaceInfo> {
    const [created] = await db.insert(nftMarketplaceInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getNftMarketplaceInfo(userId: number): Promise<NftMarketplaceInfo | undefined> {
    const [info] = await db.select().from(nftMarketplaceInfo).where(eq(nftMarketplaceInfo.userId, userId));
    return info;
  }

  async createCryptoFundInfo(userId: number, info: InsertCryptoFundInfo): Promise<CryptoFundInfo> {
    const [created] = await db.insert(cryptoFundInfo).values({ ...info, userId }).returning();
    return created;
  }

  async getCryptoFundInfo(userId: number): Promise<CryptoFundInfo | undefined> {
    const [info] = await db.select().from(cryptoFundInfo).where(eq(cryptoFundInfo.userId, userId));
    return info;
  }

  async getExchangeInfoByUserId(userId: number): Promise<ExchangeInfo[]> {
    return await db.select().from(exchangeInfo).where(eq(exchangeInfo.userId, userId));
  }

  async getStablecoinInfoByUserId(userId: number): Promise<StablecoinInfo[]> {
    return await db.select().from(stablecoinInfo).where(eq(stablecoinInfo.userId, userId));
  }

  async getDefiProtocolInfoByUserId(userId: number): Promise<DefiProtocolInfo[]> {
    return await db.select().from(defiProtocolInfo).where(eq(defiProtocolInfo.userId, userId));
  }

  async getNftMarketplaceInfoByUserId(userId: number): Promise<NftMarketplaceInfo[]> {
    return await db.select().from(nftMarketplaceInfo).where(eq(nftMarketplaceInfo.userId, userId));
  }

  async getCryptoFundInfoByUserId(userId: number): Promise<CryptoFundInfo[]> {
    return await db.select().from(cryptoFundInfo).where(eq(cryptoFundInfo.userId, userId));
  }

  async createRegistration(userId: number, registration: InsertRegistration): Promise<Registration> {
    const [created] = await db.insert(registrations)
      .values({ ...registration, userId })
      .returning();
    return created;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    const results = await db.select()
      .from(registrations)
      .where(eq(registrations.id, id));
      
    if (results.length === 0) return undefined;
    const registration = results[0];
    
    // Return only if not deleted
    return registration.deletedAt === null ? registration : undefined;
  }

  async getRegistrationsByUserId(userId: number): Promise<Registration[]> {
    const results = await db.select()
      .from(registrations)
      .where(eq(registrations.userId, userId));
      
    // Filter deleted records in memory
    return results.filter(r => r.deletedAt === null);
  }

  async getRegistrationsByType(type: string): Promise<Registration[]> {
    const results = await db.select()
      .from(registrations)
      .where(eq(registrations.registrationType, type));
      
    // Filter deleted records in memory
    return results.filter(r => r.deletedAt === null);
  }

  async updateRegistration(id: number, data: Partial<Registration>): Promise<Registration> {
    const [updated] = await db.update(registrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(registrations.id, id))
      .returning();
    return updated;
  }

  async createRegistrationVersion(
    registrationId: number, 
    versionData: Partial<RegistrationVersion>
  ): Promise<RegistrationVersion> {
    // Create a clean object with only valid fields
    const data: any = {
      registration_id: registrationId,
      version: versionData.version,
      entity_details: versionData.entityDetails,
      created_by: versionData.createdBy
    };
    
    // Add optional fields only if they exist
    if (versionData.complianceData) {
      data.compliance_data = versionData.complianceData;
    }
    
    const [created] = await db.insert(registrationVersions)
      .values(data)
      .returning();
    return created;
  }

  async getRegistrationVersions(registrationId: number): Promise<RegistrationVersion[]> {
    const results = await db.select().from(registrationVersions);
    
    // Filter and sort in memory
    return results
      .filter(v => v.registrationId === registrationId)
      .sort((a, b) => {
        // Sort by version descending
        return (b.version || 0) - (a.version || 0);
      });
  }

  async createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs)
      .values(log)
      .returning();
    return created;
  }

  async getAuditLogs(tableName: string, recordId: number): Promise<AuditLog[]> {
    const results = await db.select().from(auditLogs);
    
    // Filter and sort in memory
    return results
      .filter(log => log.tableName === tableName && log.recordId === recordId)
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  // Token Registration Methods
  async createTokenRegistration(userId: number, data: InsertTokenRegistration): Promise<TokenRegistration> {
    const [tokenRegistration] = await db.insert(token_registrations).values({
      ...data,
      userId,
      updatedAt: new Date()
    }).returning();
    return tokenRegistration;
  }

  async getTokenRegistration(id: number): Promise<TokenRegistration | undefined> {
    const [tokenRegistration] = await db.select().from(token_registrations).where(eq(token_registrations.id, id));
    return tokenRegistration;
  }

  async getTokenRegistrationsByUserId(userId: number): Promise<TokenRegistration[]> {
    return await db.select()
      .from(token_registrations)
      .where(eq(token_registrations.userId, userId))
      .orderBy(desc(token_registrations.updatedAt));
  }

  async getAllTokenRegistrations(): Promise<TokenRegistration[]> {
    return await db.select().from(token_registrations).orderBy(desc(token_registrations.updatedAt));
  }

  async getTokenRegistrationsByCategory(category: string): Promise<TokenRegistration[]> {
    // Use SQL for enum type comparison to fix type error
    return await db.select()
      .from(token_registrations)
      .where(sql`${token_registrations.tokenCategory} = ${category}`)
      .orderBy(desc(token_registrations.updatedAt));
  }

  async updateTokenRegistration(id: number, data: Partial<TokenRegistration>): Promise<TokenRegistration> {
    const [updated] = await db.update(token_registrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(token_registrations.id, id))
      .returning();
    return updated;
  }

  // Token Registration Documents
  async createTokenRegistrationDocument(data: InsertTokenRegistrationDocument): Promise<TokenRegistrationDocument> {
    const [document] = await db.insert(token_registration_documents).values(data).returning();
    return document;
  }

  async getTokenRegistrationDocuments(tokenRegistrationId: number): Promise<TokenRegistrationDocument[]> {
    return await db.select()
      .from(token_registration_documents)
      .where(eq(token_registration_documents.tokenRegistrationId, tokenRegistrationId));
  }

  // Token Registration Verifications
  async createTokenRegistrationVerification(data: Omit<TokenRegistrationVerification, "id" | "verificationDate">): Promise<TokenRegistrationVerification> {
    const [verification] = await db.insert(token_registration_verifications).values({
      ...data,
      verificationDate: new Date()
    }).returning();
    return verification;
  }

  async getTokenRegistrationVerifications(tokenRegistrationId: number): Promise<TokenRegistrationVerification[]> {
    return await db.select()
      .from(token_registration_verifications)
      .where(eq(token_registration_verifications.tokenRegistrationId, tokenRegistrationId))
      .orderBy(desc(token_registration_verifications.verificationDate));
  }

  // Token Risk Assessments
  async createTokenRiskAssessment(data: Omit<TokenRiskAssessment, "id" | "assessmentDate">): Promise<TokenRiskAssessment> {
    const [assessment] = await db.insert(token_risk_assessments).values({
      ...data,
      assessmentDate: new Date()
    }).returning();
    return assessment;
  }

  async getTokenRiskAssessments(tokenRegistrationId: number): Promise<TokenRiskAssessment[]> {
    return await db.select()
      .from(token_risk_assessments)
      .where(eq(token_risk_assessments.tokenRegistrationId, tokenRegistrationId))
      .orderBy(desc(token_risk_assessments.assessmentDate));
  }

  // Token Jurisdiction Approvals
  async createTokenJurisdictionApproval(data: Omit<TokenJurisdictionApproval, "id">): Promise<TokenJurisdictionApproval> {
    const [approval] = await db.insert(token_jurisdiction_approvals).values(data).returning();
    return approval;
  }

  async getTokenJurisdictionApprovals(tokenRegistrationId: number): Promise<TokenJurisdictionApproval[]> {
    return await db.select()
      .from(token_jurisdiction_approvals)
      .where(eq(token_jurisdiction_approvals.tokenRegistrationId, tokenRegistrationId));
  }

  async getTokenJurisdictionApprovalsByJurisdiction(jurisdictionId: number): Promise<TokenJurisdictionApproval[]> {
    return await db.select()
      .from(token_jurisdiction_approvals)
      .where(eq(token_jurisdiction_approvals.jurisdictionId, jurisdictionId));
  }
}

export const storage = new DatabaseStorage();