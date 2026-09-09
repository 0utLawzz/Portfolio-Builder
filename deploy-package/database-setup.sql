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
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed: Brandex Drive Parser only (as requested)
INSERT INTO projects (title, slug, description, long_description, problem, solution, tech_stack, category, status, cover_image, github_url, live_url, featured)
VALUES
(
  'Brandex Drive Parser',
  'brandex-drive-parser',
  'A smart Google Drive folder parser that extracts, categorizes, and exports trademark case data to Google Sheets or local Excel/CSV files.',
  'Drive-Data is a Python CLI + GUI tool built for trademark legal teams. It recursively scans client/consultant folders, classifies documents with 13+ regex rules (TM-1, TM-48, EXAM, ACK, OPPO, NTN…), and exports clean records to Google Sheets or local Excel/CSV — with no duplicate filtering so every file is captured.',
  'Trademark teams were manually sorting hundreds of case folders and updating Sheets by hand, leading to missed documents and hours of repetitive work.',
  'Built a single-script automation with interactive CLI, deep/fast scanning modes, dynamic rules manager, and dual export (local + Sheets) that turns a multi-hour process into a few minutes.',
  '["Python","pandas","gspread","openpyxl","regex","Google Sheets API","Google Drive API"]',
  'Automation',
  'active',
  'https://0utlawzz.github.io/Brandex-Drive-Parser/',
  'https://github.com/0utLawzz/Brandex-Drive-Parser',
  'https://0utlawzz.github.io/Brandex-Drive-Parser/',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Done!
SELECT 'Database setup complete!' AS status;
