# Release Notes

## Sprint 3 — PDF Export & Pricing (2026-02-24)

### New Features
- PDF export for CVs:
  - ATS-Safe (plain text), Visual (styled), and Both (combined PDF)
- Role-based gating:
  - Free users: can export ATS-Safe only
  - Pro users: can export all formats
- Frontend Export Modal integrated into builder page with mode selection and upgrade prompts

### Technical
- Backend:
  - New `generatePdf` service using `pdfkit`
  - Route `GET /api/cvs/:id/export-pdf` with role checks
  - Auth responses now include `user.role`
  - Prisma schema adds `role` to `User` (default `free`)
- Frontend:
  - New `ExportModal` component, conditional UI based on role
  - Type augmentation for `User.role` in `frontend/types/auth.d.ts`
- Strict TypeScript builds (backend/frontend) pass

### Migration Notes
- Run `npx prisma generate` and `npx prisma migrate dev` to add `role` column.
- Existing users: set role via DB seed or update manually.

### Known Issues
- None.

## Sprint 2 — Section Editing & Dual-Mode Preview (2026-02-24)

### New Features
- Full section editing for CV builder:
  - Personal Info, Summary, Experience, Education, Skills, Projects
  - Add/Edit/Delete operations for all section types
- Dual-mode preview pane:
  - ATS-Safe (plain text) and Visual (styled) toggle with instant switching
- Autosave improvements:
  - Debounced (2s) autosave for content and title
  - Version conflict detection (409 response)
  - Last saved timestamp display
- Mobile responsive builder layout (sidebar collapses, stacked editor/preview on small screens)
- Template picker modal for creating new CVs from industry templates

### Technical
- Backend:
  - TypeScript strict mode compliance
  - Corrected rate-limiter-flexible import
  - Improved error handling and stability (global unhandled rejection handlers)
  - Autosave endpoint now accepts optional title updates
- Frontend:
  - Centralized AuthProvider in `_app.tsx`
  - New components: `Modal`, `PreviewPane`, forms for each section
  - Strict mode TypeScript clean
  - Unified prop patterns (data/onChange)

### Bug Fixes
- Fixed CORS configuration for localhost:3000
- Fixed useEffect import and dependency patterns
- Fixed autosave debounce to avoid stale closures
- Updated `updatedAt` handling throughout

### Migration Notes
- None: database schema unchanged from Sprint 1.

### Known Issues
- None critical. Version conflict UX is basic (alert) and can be improved in future sprints.
