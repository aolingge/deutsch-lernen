-- Only ciphertext and a capability hash; keys and imported books stay on the device.
CREATE TABLE IF NOT EXISTS reader_sync (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  iv TEXT NOT NULL,
  ciphertext TEXT NOT NULL CHECK (length(ciphertext) <= 700000),
  updated_at TEXT NOT NULL
);
