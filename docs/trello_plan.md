# Trello Board Plan - CV Creator MVP

**Board Name:** CV Creator MVP  
**Goal:** Ship ATS-first CV builder with core features in 6 sprints (2-week each)  
**Scope:** 12 P0 user stories only; P1/P2 deferred to post-MVP

---

## Board Structure

### Lists (Columns) – Workflow
- Backlog
- To Do (Sprint Planning)
- In Progress
- Review/QA
- Done
- Blocked

### Labels (Color-Coded)
- **P0** (Red) – Must-have for MVP
- **P1** (Orange) – Important, post-MVP
- **P2** (Yellow) – Nice-to-have, post-MVP
- **Epic** subgroups:
  - `Auth` (Blue)
  - `Builder` (Green)
  - `AI` (Purple)
  - `Pricing` (Pink)
  - `UI` (Teal)
- **Frontend** (Indigo)
- **Backend** (Light Blue)
- **Infra/DevOps** (Gray)
- `Blocker` (Black)

---

## Sprint Breakdown (2-week sprints)

### Sprint 0 (Prep) – Infrastructure & Design
- Set up repo (Next.js + Express + PostgreSQL)
- CI/CD pipeline (GitHub Actions)
- Auth0/Custom auth scaffolding
- Design system/component library base
- ATS-safe CSS template foundation

**Cards:**
- [Infra] Initialize fullstack project with Next.js App Router
- [Infra] Configure PostgreSQL (Prisma/Knex)
- [Infra] Set up GitHub Actions (lint, test, build)
- [Design] Create Figma/design system (colors, typography, components)
- [Design] Build base ATS-safe PDF template CSS

---

### Sprint 1 – Auth & Core Builder Shell
Goal: User can sign up, log in, and see empty CV builder.

**Stories:**
- US-01: User Sign-up (Auth, P0)
- US-02: User Login/Logout (Auth, P0)
- US-03: Create CV from Template (Builder, P0) – minimal template picker, one template

**Supporting Tasks:**
- Backend: User model, registration/login endpoints, JWT
- Frontend: Auth pages, protected routes, template picker UI
- Shared: API client, error handling

**Cards:**
- [Backend] Implement /api/auth/register and /login
- [Backend] Email delivery for verification (resend/mailgun)
- [Frontend] Sign-up and login pages with validation
- [Frontend] Dashboard page showing "My CVs" list
- [Frontend] Template picker modal with 1 sample template
- [Frontend] Create CV action (POST) and redirect to builder

---

### Sprint 2 – CV Building Essentials
Goal: User can edit all sections, see live preview, and auto-save.

**Stories:**
- US-04: Edit CV Sections (Builder, P0)
- US-07: Save and Resume CV (Builder, P0)
- US-05: Dual-Mode Preview (Builder, P0)

**Supporting Tasks:**
- Backend: CV CRUD API (sections, auto-save), cloud storage (S3/Cloudinary for images if any)
- Frontend: Section editor components, rich text (simple), preview pane with toggle
- State management: Redux/Context for CV data, sync with backend

**Cards:**
- [Backend] CV API: create, read, update sections, delete
- [Backend] Auto-save endpoint (debounced) and conflict resolution
- [Frontend] Section components: PersonalInfo, Summary, Experience, Education, Skills, Projects
- [Frontend] Add/remove sections, reorder (P1 defer)
- [Frontend] Live preview panel with ATS-safe/Visual toggle
- [Frontend] Auto-save indicator and offline localStorage fallback

---

### Sprint 3 – PDF Export & Pricing
Goal: Paying users can export PDF; free users see upgrade prompt; pricing transparency.

**Stories:**
- US-06: PDF Export (Builder, P0)
- US-08: Transparent Pricing Display (Pricing, P0)
- US-09: Upgrade to Pro (Pricing, P0)
- US-10: Cancel Subscription (Pricing, P0)

**Supporting Tasks:**
- Backend: Payment integration (Stripe/PayPal), subscription webhooks, export quota enforcement
- PDF generation: Puppeteer/Playwright headless Chrome or pdf-lib; ATS-safe CSS vs Visual CSS
- Frontend: Pricing page, upgrade modal, account billing settings

**Cards:**
- [Backend] Stripe integration: checkout, webhook handling, subscription status
- [Backend] PDF generation service (headless Chrome) with both templates
- [Backend] Middleware to enforce export permissions (Pro only)
- [Frontend] Export button with modal (ATS-Safe/Visual/Both)
- [Frontend] Pricing page with clear plans
- [Frontend] Upgrade modal (triggered on export by free users)
- [Frontend] Account settings: billing, cancel subscription
- [Backend] Email receipts and cancellation confirmations

---

### Sprint 4 – AI Tips & Industry Templates
Goal: AI coaching and industry-specific templates integrated.

**Stories:**
- US-11: AI Industry Tips (AI, P0)
- (Template expansion from US-03: add 8-10 verticals)

**Supporting Tasks:**
- AI service: OpenAI/Anthropic API with prompt engineering for tips (not generative fill)
- Backend: Tips endpoint (cached), industry taxonomy
- Frontend: Tips sidebar/popover, industry selector in CV settings

**Cards:**
- [Backend] Design AI tips prompt (industry-specific action verbs, keywords, metrics)
- [Backend] Tips API endpoint (POST /api/ai/tips with industry and section context)
- [Backend] Cache layer for common tips (Redis/in-memory)
- [Frontend] AI Tips panel in builder (icon → sidebar)
- [Frontend] Industry selector (during CV creation and in settings)
- [Backend] Expand template library to 8-10 industries (data-driven)
- [Frontend] Template picker with industry categories

---

### Sprint 5 – Mobile-Responsive & Polish
Goal: Full mobile UX; QA bug fixing; performance optimization.

**Stories:**
- US-12: Mobile-Responsive Builder (UI, P0)

**Supporting Tasks:**
- Frontend: Responsive CSS adjustments, touch-friendly UI, testing on devices
- Backend: Performance profiling, DB indexing, API caching
- QA: Cross-browser testing, ATS validation tests

**Cards:**
- [Frontend] Responsive layout for builder (mobile breakpoints)
- [Frontend] Touch target sizing, keyboard handling, scroll anchoring
- [Frontend] Mobile preview scaling (pinch-zoom)
- [QA] Create cross-device test matrix (iOS Safari, Chrome Android, etc.)
- [Backend] Load testing (concurrent builds)
- [Backend] Optimize PDF generation speed (<5s)
- [QA] ATS validation tests against Workday/Greenhouse samples
- [Frontend] Accessibility audit (WCAG 2.1 AA) and fixes

---

### Sprint 6 – Launch Prep & Soft Release
Goal: Final QA, documentation, monitoring, and limited beta launch.

**Stories:**
- All P0 stories complete; run acceptance tests
- Prepare monitoring, error tracking, analytics
- Deploy to production (staged rollout)

**Cards:**
- [Infra] Configure Sentry/Rollbar, PostHog/Amplitude
- [Infra] Production deployment (Docker/K8s/VM)
- [Backend] Database backups, disaster recovery runbook
- [Frontend] SEO meta tags, manifest for PWA (optional)
- [Docs] User guide/FAQ (basic)
- [QA] End-to-end test suite (Cypress/Playwright)
- [QA] Final regression test against all P0 AC
- [PM] Beta invite system (100 users)
- [PM] Collect feedback and triage P1 bugs

---

## Card Template

Each card should follow:

**Title:** [Epic] Short action-oriented title  
**Description:** 
- As a user, I want... (from story)
- Acceptance Criteria (bullet list from story)
- UX Notes (from story)
- Edge Cases
- Technical notes: API endpoints, DB changes, components

**Labels:** P0, Epic, Frontend/Backend/Infra as appropriate  
**Members:** Assign to role (FE/BE/DevOps/QA)  
**Due:** Sprint end date  
**Checklist:** Break down tasks (subtasks)

---

## Dependencies & Critical Path

1. **Auth** must be done before any save/cloud features.
2. **Builder core** (sections + preview) must precede **PDF Export**.
3. **Pricing/Stripe** must be ready before free users hit export (gate).
4. **AI Tips** depends on builder UI and can be parallelized with PDF work.
5. **Mobile responsive** should be integrated throughout, but dedicated polish sprint last.

**Critical Path:** Auth → Builder → Preview → Export → AI Tips → Mobile Polish → Launch.

---

## Definition of Done (DoD)

- Code reviewed by LeadDev
- Unit tests ≥80% coverage (backend services, frontend components)
- E2E test for user flow (at least one per story)
- AC met and verified by QA
- Documentation updated (API, user-facing if needed)
- Deployed to staging; smoke tests passed
- Monitoring/alerting configured for new endpoints
- No known blockers

---

*End of Trello Plan. Ready to assign development tasks.*
