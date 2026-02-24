#!/usr/bin/env bash
set -euo pipefail

# Backup script for PostgreSQL database
# Requires DATABASE_URL in environment or .env

# Config
BACKUP_DIR="$(dirname "$0")/backups"
RETENTION_DAYS=30
DATE="$(date +%Y-%m-%d_%H%M%S)"
DUMP_FILE="$BACKUP_DIR/dump-$DATE.sql.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Load .env if present
if [ -f "$(dirname "$0")/.env" ]; then
  export "$(cat "$(dirname "$0")/.env" | xargs)"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set"
  exit 1
fi

# Parse connection details from DATABASE_URL (expected format: postgresql://USER:PASS@HOST:PORT/DB)
# Use pg_dump with the full URL
echo "Creating backup: $DUMP_FILE"
pg_dump "$DATABASE_URL" | gzip > "$DUMP_FILE"

echo "Backup completed: $DUMP_FILE"

# Prune old backups
echo "Pruning backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "dump-*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete

echo "Backup rotation complete."
