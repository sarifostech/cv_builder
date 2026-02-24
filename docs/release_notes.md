# Release Notes

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
