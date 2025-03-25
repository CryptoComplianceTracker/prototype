# Database Design Improvements

## Current Issues
1. Separate tables for each registration type leading to:
   - Schema redundancy
   - Complex queries for aggregating data
   - Difficulty in maintaining consistency
2. Lack of versioning and audit trails
3. Inconsistent naming conventions
4. Missing indexes on frequently queried fields
5. No standardized approach to sensitive data

## Proposed Schema Improvements

### 1. Unified Registrations Table
```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    registration_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    version INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    registration_number TEXT,
    jurisdiction TEXT,
    website_url TEXT,
    entity_details JSONB NOT NULL,
    compliance_data JSONB,
    risk_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes for performance
    CONSTRAINT valid_registration_type CHECK (
        registration_type IN ('exchange', 'stablecoin', 'defi', 'nft', 'fund')
    ),
    CONSTRAINT valid_status CHECK (
        status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')
    )
);

-- Indexes for common queries
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_type ON registrations(registration_type);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
```

### 2. Registration Versions Table
```sql
CREATE TABLE registration_versions (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(id),
    version INTEGER NOT NULL,
    entity_details JSONB NOT NULL,
    compliance_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    UNIQUE(registration_id, version)
);

CREATE INDEX idx_registration_versions_reg_id ON registration_versions(registration_id);
```

### 3. Audit Log Table
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id INTEGER REFERENCES users(id),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_action CHECK (
        action IN ('INSERT', 'UPDATE', 'DELETE')
    )
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 4. Audit Trigger Function
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            table_name, record_id, action, new_data, user_id
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            'INSERT',
            row_to_json(NEW),
            current_setting('app.current_user_id')::INTEGER
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            table_name, record_id, action, old_data, new_data, user_id
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            'UPDATE',
            row_to_json(OLD),
            row_to_json(NEW),
            current_setting('app.current_user_id')::INTEGER
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            table_name, record_id, action, old_data, user_id
        ) VALUES (
            TG_TABLE_NAME,
            OLD.id,
            'DELETE',
            row_to_json(OLD),
            current_setting('app.current_user_id')::INTEGER
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Benefits of New Design

1. **Simplified Schema**
   - Single table for all registration types
   - Consistent field naming and structure
   - Easier to maintain and extend

2. **Better Performance**
   - Optimized indexes for common queries
   - Reduced joins for registration queries
   - Efficient filtering and searching

3. **Enhanced Auditing**
   - Complete history of all changes
   - Version control for registrations
   - Compliance-friendly audit trails

4. **Improved Data Integrity**
   - Consistent constraints across all registration types
   - Better referential integrity
   - Type checking for status and registration types

5. **Future-Proof**
   - Easy to add new registration types
   - Flexible JSONB fields for type-specific data
   - Built-in support for soft deletes

## Migration Strategy

1. **Phase 1: Preparation**
   - Create new tables without dropping existing ones
   - Add indexes and constraints
   - Set up audit logging

2. **Phase 2: Data Migration**
   - Migrate existing data to new unified structure
   - Verify data integrity
   - Update application code to use new schema

3. **Phase 3: Cleanup**
   - Archive old tables
   - Remove deprecated code
   - Update documentation

## Implementation Notes

1. **Entity-Specific Validation**
   - Implement application-level validation for JSONB fields
   - Create type-specific schemas using Zod
   - Add API endpoint validation

2. **Performance Considerations**
   - Monitor JSONB query performance
   - Add partial indexes if needed
   - Consider materialized views for complex reports

3. **Security Measures**
   - Implement row-level security
   - Encrypt sensitive fields
   - Add access logging
