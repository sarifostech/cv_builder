# Launch Checklist

## Pre-Launch
- [ ] All environment variables set in production (`.env.production` or secret manager)
- [ ] Database migrated: `npx prisma migrate deploy` completed
- [ ] Backups configured and tested (`backup.sh` dry-run)
- [ ] Monitoring enabled: Sentry DSN and PostHog API key configured
- [ ] Domain DNS pointed to server; SSL certificates installed and auto‑renewing
- [ ] CDN/static assets versioned (Next.js handles this)
- [ ] CORS origins restricted to production domain(s)
- [ ] Rate limiting tuned for production traffic
- [ ] Health endpoints verified: `/api/health/liveness` and `/api/health/readiness`

## Deploy
- [ ] Backend built and started (systemd or Docker)
- [ ] Frontend built and served (Vercel/Netlify/self‑hosted)
- [ ] Backend logs show `Sentry monitoring: ENABLED` if DSN set
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to backend production URL

## Post‑Deploy Validation
- [ ] Smoke test: signup → build → export → beta invite (see `docs/test_reports/staging-smoke-test.md`)
- [ ] Performance: PDF <5s, API <200ms
- [ ] Error tracking: Sentry shows no critical events post‑deploy
- [ ] Analytics: PostHog receiving events

## Go/No‑Go
- [ ] All items above checked and green
- [ ] Rollback plan documented and tested

If any item fails, address before opening beta invites.
