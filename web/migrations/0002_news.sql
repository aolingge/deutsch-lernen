CREATE TABLE IF NOT EXISTS news_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'unchecked',
  last_checked_at TEXT
);
CREATE TABLE IF NOT EXISTS news_items (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES news_sources(id),
  guid TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TEXT,
  fetched_at TEXT NOT NULL,
  UNIQUE(source_id, guid)
);
