# CV Creator Backend

Setup:
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection.
4. `npx prisma generate`
5. `npx prisma migrate dev --name init` (after ensuring DB is reachable)
6. `npm run dev` to start server (http://localhost:3001)

API:
- POST   /api/auth/register   { email, password, name? }
- POST   /api/auth/login      { email, password }
- POST   /api/auth/logout     (returns 200)
- GET    /api/cvs             (list CVs for user)
- POST   /api/cvs             { title, templateId, content? }
- GET    /api/cvs/:id
- PUT    /api/cvs/:id         { title, templateId, content? }
- DELETE /api/cvs/:id
- POST   /api/cvs/:id/autosave { content, version? }

Auth: Include header `Authorization: Bearer <jwt>` for protected routes.
