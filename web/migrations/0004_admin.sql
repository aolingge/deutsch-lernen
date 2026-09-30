CREATE TABLE IF NOT EXISTS resource_revisions (
  resource_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  changed_at TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY (resource_id, revision)
);
