# CV Creator

A full‑stack web application for building CVs with AI tips, PDF export, and responsive design.

## Quick Start (Development)

1. **Clone and install**
   ```bash
   npm ci --prefix backend
   npm ci --prefix frontend
   ```

2. **Environment**
   - Copy `backend/.env.example` to `backend/.env` and fill values (especially `DATABASE_URL` and `JWT_SECRET`).
   - For frontend, optionally set `NEXT_PUBLIC_API_URL=http://localhost:3001`.

3. **Database**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. **Run**
   ```bash
   # Backend (port 3001)
   npm run dev --prefix backend

   # Frontend (port 3000)
   npm run dev --prefix frontend
   ```

5. **Health check**
   - `GET http://localhost:3001/health`

## Production Build

```bash
# Backend
npm run build --prefix backend
npm start --prefix backend

# Frontend
npm run build --prefix frontend
npm start --prefix frontend
```

See `backend/docs/deployment.md` for systemd/Docker setup and `docs/launch_checklist.md` for pre‑launch steps.

## Features

- Section‑based CV builder (personal info, summary, experience, education, skills, projects)
- Dual‑mode preview (ATS‑safe and Visual)
- AI writing tips with one‑click insert
- PDF export (ATS‑Safe, Visual, Both) with role‑based gating
- Responsive design (mobile friendly)
- Pricing page and beta invite collection

## Documentation

- User guide: `docs/user_guide.md`
- Deployment: `backend/docs/deployment.md`
- Runbook: `backend/docs/runbook.md`
- Launch checklist: `docs/launch_checklist.md`
- Release notes: `docs/release_notes.md`

## Testing

- TypeScript: `npx tsc --noEmit` in both `backend` and `frontend`
- E2E tests: `npm run test:e2e` in `frontend` (Cypress)

## Monitoring

- Sentry (errors) and PostHog (analytics) are optional; set `SENTRY_DSN` and `POSTHOG_API_KEY` in backend env to enable.

## License
[Specify license]
