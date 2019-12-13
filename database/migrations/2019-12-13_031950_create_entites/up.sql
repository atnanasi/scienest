CREATE TABLE "entries" (
  "path" character varying(255) PRIMARY KEY,
  "body" text NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "is_root" boolean NOT NULL DEFAULT 'FALSE'
);