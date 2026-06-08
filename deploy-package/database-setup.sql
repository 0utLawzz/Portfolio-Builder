-- =============================================================
-- OUTLAWZ LABS™ — PostgreSQL Database Setup
-- Run this on your PostgreSQL database (e.g. Neon, Supabase,
-- or any PostgreSQL server on Hostinger VPS)
-- =============================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  problem     TEXT,
  solution    TEXT,
  tech_stack  JSON NOT NULL DEFAULT '[]',
  category    TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  cover_image TEXT,
  gallery     JSON NOT NULL DEFAULT '[]',
  github_url  TEXT,
  live_url    TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optional: seed sample projects (remove if you want to start clean)
INSERT INTO projects (title, slug, description, long_description, problem, solution, tech_stack, category, status, featured)
VALUES
(
  'AI Document OCR Pipeline',
  'ai-document-ocr-pipeline',
  'Automated document parsing system that extracts structured data from PDFs, invoices, and forms using AI-powered OCR.',
  'A production OCR pipeline that processes thousands of documents per day.',
  'A logistics company was manually processing 500+ invoices per day.',
  'Built an AI-powered OCR pipeline that processes documents in under 30 seconds with 98%+ accuracy.',
  '["Python","OpenAI Vision","PostgreSQL","FastAPI","Docker","Redis"]',
  'OCR',
  'active',
  true
),
(
  'Business Workflow Automation Suite',
  'workflow-automation-suite',
  'End-to-end workflow automation platform connecting CRM, email, Slack, and databases.',
  'A comprehensive workflow automation platform that eliminates manual handoffs.',
  'A SaaS company had a 14-step customer onboarding process requiring manual action at every step.',
  'Designed a workflow engine that automates the entire onboarding sequence.',
  '["Node.js","TypeScript","HubSpot API","AWS","Slack API","PostgreSQL"]',
  'Automation',
  'active',
  true
),
(
  'AI Agent for Lead Research',
  'ai-lead-research-agent',
  'Autonomous AI agent that researches leads, scrapes company data, and generates personalized outreach.',
  'An autonomous AI sales research agent that replaces hours of manual research.',
  'Sales teams waste 2-3 hours per day doing manual lead research.',
  'Built a multi-step AI agent using LangChain + Claude that autonomously researches leads.',
  '["Python","Claude","LangChain","Playwright","OpenAI","Supabase"]',
  'AI',
  'active',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Done!
SELECT 'Database setup complete!' AS status;
