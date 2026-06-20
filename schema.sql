-- Cloudflare D1 schema for the LexLoop waitlist (replaces n8n + Railway Postgres).
-- Apply with: wrangler d1 execute lexloop-waitlist --file=./schema.sql --remote
-- Mirrors the previous Google Sheet's two tabs: Registrations + Events.

CREATE TABLE IF NOT EXISTS waitlist_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  -- lifecycle: email_confirmation_pending -> email_confirmed -> meeting_booked
  status TEXT NOT NULL DEFAULT 'email_confirmation_pending',
  slack_ts TEXT,                       -- Slack message ts, for threading follow-ups
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT,
  confirmation_email_sent_at TEXT,
  email_confirmed_at TEXT,
  meeting_booked_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_token ON waitlist_registrations(token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_registrations(email);

CREATE TABLE IF NOT EXISTS waitlist_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_external_id TEXT,
  registration_email TEXT,
  -- registration.created | confirmation_email.sent | email.confirmed | meeting.booked
  event_type TEXT NOT NULL,
  details TEXT,
  timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_events_extid ON waitlist_events(registration_external_id);
