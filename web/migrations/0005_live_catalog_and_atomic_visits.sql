CREATE TABLE catalog_entries (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  canonical_url TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','published','archived')),
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)),
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'catalog-seed'
);
CREATE TABLE catalog_audit (
  resource_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  changed_at TEXT NOT NULL,
  actor TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY(resource_id, revision)
);
CREATE TRIGGER catalog_insert_audit AFTER INSERT ON catalog_entries BEGIN
  INSERT INTO catalog_audit VALUES(NEW.id, NEW.revision, NEW.updated_at, NEW.actor, NEW.payload_json);
END;
CREATE TRIGGER catalog_update_audit AFTER UPDATE ON catalog_entries BEGIN
  INSERT INTO catalog_audit VALUES(NEW.id, NEW.revision, NEW.updated_at, NEW.actor, NEW.payload_json);
END;
ALTER TABLE visit_events ADD COLUMN day TEXT;
CREATE TRIGGER count_new_visit AFTER INSERT ON visit_events BEGIN
  INSERT INTO visit_daily(day, page_views) VALUES(COALESCE(NEW.day,date(NEW.created_at,'+8 hours')),1)
    ON CONFLICT(day) DO UPDATE SET page_views=page_views+1;
  UPDATE visit_totals SET page_views=page_views+1, updated_at=NEW.created_at WHERE id=1;
END;
