-- Fixed-window rate limit counters, shared across serverless instances.
--
-- One row per (caller bucket, time window). `k` is a salted hash of the scope
-- and the caller's IP -- no raw IP is ever stored, matching how `events`
-- handles visitor identity.
--
-- Run once against the Neon database (project cold-lake-50623009).

CREATE TABLE IF NOT EXISTS rate_limits (
  k            text        NOT NULL,
  window_start timestamptz NOT NULL,
  n            integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (k, window_start)
);

-- Supports the periodic sweep of expired windows.
CREATE INDEX IF NOT EXISTS rate_limits_window_idx ON rate_limits (window_start);
