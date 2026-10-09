CREATE TABLE IF NOT EXISTS visit_events (
  event_id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS visit_daily (
  day TEXT PRIMARY KEY,
  page_views INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS visit_totals (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  page_views INTEGER NOT NULL DEFAULT 0,
  since TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
INSERT OR IGNORE INTO visit_totals (id, page_views, since, updated_at) VALUES (1, 0, datetime('now'), datetime('now'));
