-- D1 Database Schema for RadReport Templates
-- Version: 1.0.0
-- Date: 2026-03-31

-- =====================================================
-- TABLES
-- =====================================================

-- Templates table - main template storage
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    modality TEXT NOT NULL,
    body_region TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    version TEXT DEFAULT '1.0.0',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_templates_modality ON templates(modality);
CREATE INDEX IF NOT EXISTS idx_templates_body_region ON templates(body_region);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_updated_at ON templates(updated_at DESC);

-- RADS classifications table
CREATE TABLE IF NOT EXISTS rads_classifications (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    description TEXT,
    categories TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rads_abbreviation ON rads_classifications(abbreviation);

-- Template versions history
CREATE TABLE IF NOT EXISTS template_versions (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    changelog TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON template_versions(template_id DESC);

-- User contributions / submissions
CREATE TABLE IF NOT EXISTS contributions (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    submission_type TEXT NOT NULL,
    content TEXT NOT NULL,
    notes TEXT,
    reviewed_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);

-- API usage analytics
CREATE TABLE IF NOT EXISTS api_analytics (
    id TEXT PRIMARY KEY NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    user_agent TEXT,
    ip_hash TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_analytics_endpoint ON api_analytics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_analytics_created_at ON api_analytics(created_at DESC);

-- Follow-up recommendations tracking
CREATE TABLE IF NOT EXISTS followup_recommendations (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    template_id TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_followup_patient_id ON followup_recommendations(patient_id);
CREATE INDEX IF NOT EXISTS idx_followup_due_date ON followup_recommendations(due_date);
CREATE INDEX IF NOT EXISTS idx_followup_status ON followup_recommendations(status);

-- Quality metrics
CREATE TABLE IF NOT EXISTS quality_metrics (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    metric_type TEXT NOT NULL,
    metric_value REAL NOT NULL,
    period_start TEXT NOT NULL,
    period_end TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quality_metrics_template_id ON quality_metrics(template_id);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_period ON quality_metrics(period_start, period_end);

-- =====================================================
-- VIEWS
-- =====================================================

-- View for recent templates
CREATE VIEW IF NOT EXISTS v_recent_templates AS
SELECT 
    t.id,
    t.name,
    t.modality,
    t.body_region,
    t.category,
    t.version,
    t.updated_at
FROM templates t
ORDER BY t.updated_at DESC
LIMIT 50;

-- View for template count by modality
CREATE VIEW IF NOT EXISTS v_templates_by_modality AS
SELECT 
    modality,
    COUNT(*) as count
FROM templates
GROUP BY modality;

-- View for API usage summary
CREATE VIEW IF NOT EXISTS v_api_usage_summary AS
SELECT 
    endpoint,
    method,
    COUNT(*) as request_count,
    AVG(response_time_ms) as avg_response_time,
    MAX(response_time_ms) as max_response_time,
    MIN(response_time_ms) as min_response_time
FROM api_analytics
WHERE created_at > datetime('now', '-24 hours')
GROUP BY endpoint, method;

-- =====================================================
-- TRIGGERS (using D1's approach via application logic)
-- =====================================================

-- Note: D1 doesn't support traditional triggers.
-- Use application-level logic to:
-- 1. Update updated_at timestamp on template changes
-- 2. Log API analytics on each request
-- 3. Auto-create version entries on template updates
