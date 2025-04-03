/**
 * Advanced script that adds Estonia jurisdiction data including compliance requirements and reporting obligations
 */
import { db } from '../server/db';
import { 
  jurisdictions, 
  regulatory_bodies, 
  laws, 
  obligations, 
  jurisdiction_tags 
} from '../shared/schema';
import { eq } from 'drizzle-orm';
import seedEstonia from './seed-estonia-core';

/**
 * Add reporting obligations for Estonia
 */
async function addEstoniaReportingObligations(jurisdictionId: number) {
  console.log('Adding Estonia reporting obligations...');
  
  const estoniaObligations = [
    {
      jurisdiction_id: jurisdictionId,
      title: 'Suspicious Transaction Reports (STRs)',
      description: 'File electronically via FIU portal. Required for all high-risk behavior or fraud.',
      frequency: 'As needed',
      obligation_type: 'AML',
      delivery_method: 'Electronic',
      submission_url: 'https://fiu.ee/reporting',
      penalty_type: 'Fine',
      penalty_amount: '400000',
      is_active: true
    },
    {
      jurisdiction_id: jurisdictionId,
      title: 'Annual Compliance Report',
      description: 'Submitted to FIU detailing AML efforts, internal audit, customer classifications.',
      frequency: 'Annually',
      obligation_type: 'Compliance',
      delivery_method: 'Electronic',
      submission_url: 'https://fiu.ee/reporting',
      due_by_day: 31,
      due_months: 'January',
      is_active: true
    },
    {
      jurisdiction_id: jurisdictionId,
      title: 'Annual Financial Audit',
      description: 'Licensed VCSPs must submit audited financial statements.',
      frequency: 'Annually',
      obligation_type: 'Financial',
      delivery_method: 'Electronic',
      due_by_day: 30,
      due_months: 'June',
      is_active: true
    },
    {
      jurisdiction_id: jurisdictionId,
      title: 'Ownership Change Report',
      description: 'Notify FIU of changes in UBOs, directors, or compliance officers.',
      frequency: 'Within 30 days',
      obligation_type: 'Compliance',
      delivery_method: 'Electronic',
      submission_url: 'https://fiu.ee/reporting',
      is_active: true
    }
  ];

  for (const obligation of estoniaObligations) {
    const [inserted] = await db.insert(obligations).values(obligation).returning();
    console.log(`Added reporting obligation: ${obligation.title} with ID: ${inserted.id}`);
  }
}

/**
 * Add jurisdiction tags for Estonia
 */
async function addEstoniaTags(jurisdictionId: number) {
  console.log('Adding Estonia jurisdiction tags...');
  
  const estoniaTags = [
    'Estonia', 'FIU', 'VCSP', 'VASP', 'EU', 'MiCA', 'AML', 'KYC', 
    'Custody', 'Exchange', 'AuditRequired', 'Taxable', 
    'PhysicalPresence', 'LocalCompliance'
  ];

  for (const tag of estoniaTags) {
    const [inserted] = await db.insert(jurisdiction_tags).values({
      jurisdiction_id: jurisdictionId,
      tag
    }).returning();
    console.log(`Added tag: ${tag} for Estonia`);
  }
}

/**
 * Main function to add advanced Estonia data
 */
async function seedEstoniaAdvanced() {
  try {
    console.log('Starting advanced Estonia data seeding process...');
    
    // First seed the core Estonia data
    const success = await seedEstonia();
    
    if (!success) {
      throw new Error('Failed to seed core Estonia data');
    }
    
    // Get the Estonia jurisdiction ID
    const [estonia] = await db.select().from(jurisdictions).where(
      eq(jurisdictions.name, 'Estonia')
    );
    
    if (!estonia) {
      throw new Error('Estonia jurisdiction not found');
    }
    
    // Add reporting obligations
    await addEstoniaReportingObligations(estonia.id);
    
    // Add jurisdiction tags
    await addEstoniaTags(estonia.id);
    
    console.log('✅ Successfully seeded advanced Estonia data');
    return true;
  } catch (error) {
    console.error('Error seeding advanced Estonia data:', error);
    return false;
  }
}

// Export for other modules to use
export default seedEstoniaAdvanced;

// Run if this script is invoked directly
if (import.meta.url.endsWith('seed-estonia-advanced.ts')) {
  seedEstoniaAdvanced()
    .then(() => {
      console.log('Estonia advanced data seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding Estonia advanced data:', error);
      process.exit(1);
    });
}