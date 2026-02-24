# Disaster Recovery Runbook – CV Creator

## 1. Database Backup Procedure

### Automated Daily Backups
- Use the provided `backend/backup.sh` script.
- Cron job (recommended):
  ```
  0 2 * * * cd /path/to/backend && npm run backup >> backup.log 2>&1
  ```
  This runs daily at 2 AM.

### Retention
- Keep last 30 daily backups.
- Script deletes older files automatically.

### Storage
- Backups stored in `backend/backups/` (local). For production, configure off‑site copy (S3, B2, etc.).

## 2. Restore Procedure

### Full Restore Steps
1. Stop the application (systemctl stop cv-creator or equivalent).
2. Identify backup file: `backups/dump-YYYY-MM-DD.sql.gz`.
3. Restore with:
   ```
   gunzip -c backups/dump-YYYY-MM-DD.sql.gz | psql -U <user> -d <dbname>
   ```
4. Start the application.
5. Verify health: `curl http://localhost:3001/health`.

### Partial Restore (single table)
- Use `pg_restore` with `-t` flag. Not typical; prefer full restore.

## 3. Secrets Management
- Environment variables via `.env` files (never commit secrets).
- Use strong, randomly generated values for:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `SENTRY_DSN` (if used)
  - `POSTHOG_API_KEY` (if used)
- Rotate keys periodically.

## 4. Deployment Checklist
- [ ] Build frontend: `cd frontend && npm ci --omit=dev && npm run build`
- [ ] Build backend: `cd backend && npm ci --omit=dev && npx tsc`
- [ ] Run migrations: `cd backend && npx prisma migrate deploy`
- [ ] Ensure `backend/.env` present with production values.
- [ ] Start services (systemd or Docker).
- [ ] Verify health endpoint: `curl http://localhost:3001/health` returns `{ status: 'ok' }`.
- [ ] Check logs for errors.

## 5. Monitoring & Alerts
- Health check: `/health` should return 200 quickly.
- Set up external ping (UptimeRobot, etc.) to monitor.
- Alerts on:
  - Health check failures
  - Disk space < 20%
  - Database connection errors

## 6. Contacts
- DevOps: [contact]
- On-call: [phone/email]

---

Last updated: 2026-02-24
