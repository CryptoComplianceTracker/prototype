import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function migrateJurisdictionsSchema() {
  console.log('Starting jurisdiction schema migration...');

  try {
    // 1. Backup existing data from jurisdictions and related tables
    console.log('Backing up existing data...');
    // Use raw SQL to fetch only columns that exist in the current schema
    const existingJurisdictions = await db.execute(sql`SELECT id, name, region, risk_level, favorability_score, notes, created_at, updated_at FROM jurisdictions`);
    
    // Safely query other tables
    let existingRegulatoryBodies = [];
    let existingRegulations = [];
    let existingComplianceRequirements = [];
    let existingTaxationRules = [];
    let existingReportingObligations = [];
    let existingRegulatoryUpdates = [];
    let existingTags = [];
    let existingKeywords = [];
    
    try {
      existingRegulatoryBodies = await db.query.regulatory_bodies.findMany();
    } catch (e) {
      console.log('No regulatory bodies found or table does not exist');
    }
    
    try {
      existingRegulations = await db.query.regulations.findMany();
    } catch (e) {
      console.log('No regulations found or table does not exist');
    }
    
    try {
      existingComplianceRequirements = await db.query.compliance_requirements.findMany();
    } catch (e) {
      console.log('No compliance requirements found or table does not exist');
    }
    
    try {
      existingTaxationRules = await db.query.taxation_rules.findMany();
    } catch (e) {
      console.log('No taxation rules found or table does not exist');
    }
    
    try {
      existingReportingObligations = await db.query.reporting_obligations.findMany();
    } catch (e) {
      console.log('No reporting obligations found or table does not exist');
    }
    
    try {
      existingRegulatoryUpdates = await db.query.regulatory_updates.findMany();
    } catch (e) {
      console.log('No regulatory updates found or table does not exist');
    }
    
    try {
      existingTags = await db.query.jurisdiction_tags.findMany();
    } catch (e) {
      console.log('No jurisdiction tags found or table does not exist');
    }
    
    try {
      existingKeywords = await db.query.jurisdiction_query_keywords.findMany();
    } catch (e) {
      console.log('No jurisdiction query keywords found or table does not exist');
    }

    console.log(`Backed up ${existingJurisdictions.rows ? existingJurisdictions.rows.length : 0} jurisdictions and related data`);

    // 2. Alter the jurisdictions table to add new columns
    console.log('Altering jurisdictions table...');
    await db.execute(sql`
      ALTER TABLE "jurisdictions" 
      ADD COLUMN IF NOT EXISTS "iso_code" CHAR(2),
      ADD COLUMN IF NOT EXISTS "currency_code" CHAR(3),
      ADD COLUMN IF NOT EXISTS "is_fatf_member" BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS "legal_system_type" VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "national_language" VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "central_bank_url" TEXT,
      ADD COLUMN IF NOT EXISTS "financial_licensing_portal" TEXT,
      ADD COLUMN IF NOT EXISTS "contact_email" TEXT,
      ADD COLUMN IF NOT EXISTS "last_updated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // 3. Alter the regulatory_bodies table
    console.log('Altering regulatory_bodies table...');
    await db.execute(sql`
      ALTER TABLE "regulatory_bodies" 
      ADD COLUMN IF NOT EXISTS "contact_email" TEXT,
      ADD COLUMN IF NOT EXISTS "phone_number" TEXT,
      ADD COLUMN IF NOT EXISTS "crypto_scope" TEXT,
      ADD COLUMN IF NOT EXISTS "authority_level" TEXT,
      ADD COLUMN IF NOT EXISTS "reporting_api_available" BOOLEAN DEFAULT FALSE
    `);

    // 4. Create laws table (replacing regulations with enhanced structure)
    console.log('Creating laws table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "laws" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "abbreviation" VARCHAR(50),
        "law_type" VARCHAR(100),
        "jurisdiction_id" INT REFERENCES "jurisdictions"("id") ON DELETE CASCADE,
        "regulatory_body_id" INT REFERENCES "regulatory_bodies"("id"),
        "effective_date" DATE,
        "last_updated" DATE,
        "legal_category" VARCHAR(100),
        "description" TEXT,
        "applicability" TEXT,
        "full_text_link" TEXT,
        "source_url" TEXT,
        "source_language" VARCHAR(100),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Create obligations table (replacing compliance_requirements with enhanced structure)
    console.log('Creating obligations table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "obligations" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "law_id" INT REFERENCES "laws"("id"),
        "jurisdiction_id" INT REFERENCES "jurisdictions"("id") ON DELETE CASCADE,
        "obligation_type" VARCHAR(100),
        "frequency" VARCHAR(100),
        "due_by_day" INT,
        "due_months" TEXT,
        "format" VARCHAR(100),
        "delivery_method" VARCHAR(100),
        "submission_url" TEXT,
        "escalation_policy" TEXT,
        "penalty_type" VARCHAR(100),
        "penalty_amount" DECIMAL(12,2),
        "threshold_condition" TEXT,
        "dependent_on" INT REFERENCES "obligations"("id"),
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Create organizations table
    console.log('Creating organizations table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "organizations" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "incorporation_country" VARCHAR(100),
        "main_exchange_token" VARCHAR(50),
        "regulatory_classification" VARCHAR(100),
        "onboarding_date" DATE,
        "website_url" TEXT,
        "contact_email" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Create reports table
    console.log('Creating reports table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "reports" (
        "id" SERIAL PRIMARY KEY,
        "obligation_id" INT REFERENCES "obligations"("id"),
        "organization_id" INT REFERENCES "organizations"("id"),
        "jurisdiction_id" INT REFERENCES "jurisdictions"("id"),
        "submitted_by" INT REFERENCES "users"("id"),
        "status" VARCHAR(50),
        "file_link" TEXT,
        "submission_hash" TEXT,
        "submission_signature" TEXT,
        "blockchain_anchor_tx" TEXT,
        "submitted_to" TEXT,
        "submission_date" TIMESTAMP,
        "verified_by" INT REFERENCES "users"("id"),
        "verification_notes" TEXT,
        "response_code" VARCHAR(50),
        "response_message" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Create obligation_assignments table
    console.log('Creating obligation_assignments table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "obligation_assignments" (
        "id" SERIAL PRIMARY KEY,
        "obligation_id" INT REFERENCES "obligations"("id"),
        "user_id" INT REFERENCES "users"("id"),
        "team_role" VARCHAR(100),
        "status" VARCHAR(50),
        "due_date" DATE,
        "actual_completion_date" DATE,
        "is_blocking" BOOLEAN DEFAULT FALSE,
        "sla_hours" INT,
        "priority_level" VARCHAR(50),
        "completion_notes" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Create regulatory_keywords_index table
    console.log('Creating regulatory_keywords_index table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "regulatory_keywords_index" (
        "id" SERIAL PRIMARY KEY,
        "keyword" TEXT NOT NULL,
        "law_id" INT REFERENCES "laws"("id"),
        "jurisdiction_id" INT REFERENCES "jurisdictions"("id"),
        "match_score" DECIMAL(5,2),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. Create indexes for optimized search and performance
    console.log('Creating indexes...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "idx_jurisdiction_risk_favorability" ON "jurisdictions" ("risk_level", "favorability_score");
      CREATE INDEX IF NOT EXISTS "idx_laws_by_type_and_category" ON "laws" ("law_type", "legal_category");
      CREATE INDEX IF NOT EXISTS "idx_regulatory_keywords" ON "regulatory_keywords_index" ("keyword");
    `);
    
    // Create index on obligations
    try {
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS "idx_obligations_due_by" ON "obligations" ("due_by_day");
      `);
    } catch (error) {
      console.log('Could not create obligation index, continuing:', error);
    }

    // 11. Migrate data from regulations to laws
    if (existingRegulations && existingRegulations.length > 0) {
      console.log('Migrating regulations to laws...');
      try {
        for (const regulation of existingRegulations) {
          if (regulation && regulation.title && regulation.jurisdiction_id) {
            await db.execute(sql`
              INSERT INTO "laws" ("title", "law_type", "jurisdiction_id", "description", "source_url", "effective_date", "last_updated")
              VALUES (
                ${regulation.title}, 
                ${regulation.type || 'Generic'}, 
                ${regulation.jurisdiction_id}, 
                ${regulation.description || null}, 
                ${regulation.compliance_url || null}, 
                ${regulation.effective_date || null}, 
                ${regulation.last_updated || null}
              )
            `);
          }
        }
      } catch (e) {
        console.log('Error migrating regulations to laws:', e);
      }
    }

    // 12. Migrate compliance requirements to obligations
    if (existingComplianceRequirements && existingComplianceRequirements.length > 0) {
      console.log('Migrating compliance requirements to obligations...');
      try {
        for (const req of existingComplianceRequirements) {
          if (req && req.requirement_type && req.jurisdiction_id) {
            await db.execute(sql`
              INSERT INTO "obligations" ("title", "description", "jurisdiction_id", "obligation_type")
              VALUES (
                ${req.requirement_type}, 
                ${req.summary || null}, 
                ${req.jurisdiction_id}, 
                ${req.requirement_type}
              )
            `);
          }
        }
      } catch (e) {
        console.log('Error migrating compliance requirements to obligations:', e);
      }
    }

    console.log('Migration completed successfully!');
    
    return {
      success: true,
      message: 'Schema migration completed successfully',
      jurisdictionCount: existingJurisdictions.rows ? existingJurisdictions.rows.length : 0
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed: ' + (error as Error).message
    };
  }
}

// Execute if this script is run directly
// For ESM compatibility
/* 
if (require.main === module) {
  migrateJurisdictionsSchema()
    .then(result => {
      console.log(result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Unhandled error during migration:', err);
      process.exit(1);
    });
}
*/

// Auto-execute for ESM module
migrateJurisdictionsSchema()
  .then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error during migration:', err);
    process.exit(1);
  });

export { migrateJurisdictionsSchema };