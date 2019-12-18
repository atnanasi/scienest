CREATE TABLE "users" (
  "id" character varying(255) PRIMARY KEY,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "admin" boolean NOT NULL DEFAULT 'FALSE'
);