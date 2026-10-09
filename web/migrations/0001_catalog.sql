CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_original TEXT,
  title_zh TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  how_to_use_zh TEXT NOT NULL,
  primary_category TEXT NOT NULL REFERENCES categories(id),
  tags_json TEXT NOT NULL,
  levels_json TEXT NOT NULL,
  level_basis TEXT NOT NULL,
  skills_json TEXT NOT NULL,
  exams_json TEXT NOT NULL,
  formats_json TEXT NOT NULL,
  price TEXT NOT NULL,
  access TEXT NOT NULL,
  languages_json TEXT NOT NULL,
  source_name TEXT NOT NULL,
  url TEXT NOT NULL,
  canonical_url TEXT NOT NULL UNIQUE,
  rights TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  link_status TEXT NOT NULL DEFAULT 'unchecked',
  last_editorial_checked_at TEXT,
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS resources_category_idx ON resources(primary_category, status);
CREATE INDEX IF NOT EXISTS resources_updated_idx ON resources(updated_at DESC);
