# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Systemd or Docker

## Environment Variables
Create `.env` file based on `.env.example`:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-key
NODE_ENV=production
SENTRY_DSN=your-sentry-dsn
POSTHOG_API_KEY=your-posthog-key
```

## Building
```bash
npm run build
```

## Running with Systemd
Create `/etc/systemd/system/backend.service`:
```ini
[Unit]
Description=Backend API Service
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/.openclaw/workspace/backend
Environment=NODE_ENV=production
EnvironmentFile=/home/ubuntu/.openclaw/workspace/backend/.env.production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
TimeoutStartSec=30
TimeoutStopSec=30

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/home/ubuntu/.openclaw/workspace/backend/backups

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable backend
sudo systemctl start backend
sudo systemctl status backend
```

## Health Check Endpoints
- **Liveness**: `GET /api/health/liveness` - Basic service check
- **Readiness**: `GET /api/health/readiness` - Database connectivity check

```bash
curl http://localhost:3000/api/health/liveness
curl http://localhost:3000/api/health/readiness
```

## Backup Management
### Backup Script
```bash
./backup.sh
```

### Test Backup Script
```bash
./backup-test.sh
```

### Backup Configuration
- Backup directory: `/home/ubuntu/.openclaw/workspace/backend/backups`
- Retention: 30 days
- Compression: Gzip

## Logs
```bash
# Systemd
journalctl -u backend -f

# Docker
docker logs backend -f
```

## Database Migration
After deployment, run database migrations:
```bash
cd backend
npx prisma migrate deploy
```

## Security Notes
- JWT secret must be changed in production
- Database credentials should use least privilege
- Backup directory permissions should be restricted
- Consider enabling HTTPS in production
