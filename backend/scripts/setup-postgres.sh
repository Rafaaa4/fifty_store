#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${PGDATABASE:-fifty_store}"
DB_USER="${PGUSER:-postgres}"
DB_PASSWORD="${PGPASSWORD:-postgres}"

echo "Configuring PostgreSQL user '${DB_USER}' and database '${DB_NAME}'..."

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
SELECT 'CREATE DATABASE ${DB_NAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
SQL

echo "PostgreSQL is ready."
