# User Stories - CV Creator MVP

**Project:** CV Creator Webapp  
**Audience:** Development Team, QA, Design  
**Format:** As a [role], I want [goal] so that [benefit]  

---

## P0 Stories (MVP Core)

### US-01: User Sign-up
**As a** job seeker  
**I want to** create an account with email and password  
**So that** I can save my CVs and access them from any device  

**Acceptance Criteria:**
- Given I'm on the homepage, when I click "Sign Up", then I see a form with email, password, confirm password fields
- Given I enter a valid email and matching passwords (8+ chars), when I submit, then I receive a verification email and account is created
- Given I enter an invalid email or mismatched passwords, when I submit, then I see inline validation errors
- Given I try to register with an existing email, when I submit, then I see "Email already in use"

**UX Notes:**
- Keep form minimal; show password requirements inline
- After sign-up, auto-login and redirect to dashboard
- Clear success/error states with friendly copy
- Email verification optional for MVP (soft requirement)

**Edge Cases:**
- Duplicate email registration handled gracefully
- Password strength meter (medium complexity)

---

### US-02: User Login/Logout
**As a** registered user  
**I want to** log in and log out securely  
**So that** I can access my saved CVs and keep my account safe

**Acceptance Criteria:**
- Given I'm on the login page, when I enter correct credentials and click "Log In", then I'm redirected to dashboard
- Given I enter wrong credentials, when I submit, then I see "Invalid email or password" (no hint which)
- Given I'm logged in, when I click my avatar and choose "Log Out", then I'm logged out and redirected to homepage
- Given I'm inactive for 30 minutes, when I next interact, then I'm prompted to log in again

**UX Notes:**
- Remember me checkbox (optional MVP)
- Show loading state during login
- Redirect to originally requested page after login

**Edge Cases:**
- Handle concurrent sessions (last-write-wins)
- Rate limiting on failed attempts

---

### US-03: Create CV from Template
**As a** user  
**I want to** start a new CV using an ATS-friendly template for my industry  
**So that** I don't have to worry about formatting and my CV will parse correctly in ATS systems

**Acceptance Criteria:**
- Given I'm logged in, when I click "Create New CV", then I see a template picker with at least 8 industry categories (Tech, Finance, Creative, Healthcare, Education, Engineering, Sales, Customer Service)
- Given I select a template, when I confirm, then a new CV is created with that template's layout and pre-filled section structure
- Given I choose a template, I can preview both the visual and ATS-safe versions
- The template includes industry-specific keyword suggestions (visible in sidebar)

**UX Notes:**
- Show template thumbnails with labels
- One-click selection; can change template later (defer to P1)
- Highlight "ATS-Approved" badge on templates

**Edge Cases:**
- If user tries to create without account, prompt to sign up (guest mode allowed but save requires login)

---

### US-04: Edit CV Sections
**As a** user  
**I want to** add, edit, and delete standard CV sections and their content (personal info, summary, experience, education, skills, projects)  
**So that** I can build a complete, accurate CV

**Acceptance Criteria:**
- Given I'm editing a CV, when I click "Add Section", then I can choose from the standard section types
- Given I have a section, when I click into any field (e.g., job title, description), then I can type and see auto-save within 2 seconds
- Given I have content, when I click "Delete" on a section, then I'm asked to confirm and the section is removed
- Given I edit a field, auto-save indicator shows; on network failure, local draft persists and retries

**UX Notes:**
- Inline editing preferred over modals for speed
- Rich text formatting limited to bold/italic/links (avoid tables, images in ATS mode)
- Character limits per field (e.g., summary 500 chars, bullet 200 chars)
- Required fields: name, email, at least one experience/education entry before export

**Edge Cases:**
- Concurrent edits (optimistic UI)
- Empty state guidance (e.g., "Add your first job experience")

---

### US-05: Dual-Mode Preview (ATS-Safe + Visual)
**As a** user  
**I want to** toggle between an ATS-safe version and a visually designed version of my CV  
**So that** I can ensure my CV passes automated screening while also having a polished version for interviews

**Acceptance Criteria:**
- Given I'm in the builder, when I click the "Preview" toggle (or switch tabs), then I see two views: "ATS-Safe" and "Visual Design"
- The ATS-safe view strips styling, uses simple bullet points, plain text layout (no columns, tables, headers/footers with graphics)
- The Visual Design view applies the chosen template's styling (colors, fonts, spacing, optional subtle graphics)
- Switching between modes is instant (< 500ms)
- Both views reflect my current content in real time
- When I export, I can choose which version(s) to download

**UX Notes:**
- Clear labels: "ATS-Safe (Plain Text)" vs "Visual (Designed)"
- Show a tooltip explaining why both matter
- Default to Visual view; warn if ATS score is low (see AI-04)

**Edge Cases:**
- Content that doesn't translate to ATS-safe (e.g., multi-column) is flattened with markers (e.g., "Column 1: ...")
- User edits in one mode reflect in both

---

### US-06: PDF Export
**As a** user  
**I want to** export my CV as a high-quality PDF (both ATS-safe and/or visual versions)  
**So that** I can submit it to job applications or share it with employers

**Acceptance Criteria:**
- Given I'm viewing my CV, when I click "Export PDF", then I'm presented with options: "Export ATS-Safe", "Export Visual", "Export Both"
- Given I select an option, when I confirm, then the PDF is generated within 5 seconds and downloads automatically
- The PDF has correct margins (0.5-1 inch), embedded fonts, proper page breaks, and is under 500KB
- Given I haven't upgraded, when I try to export, then I'm prompted to upgrade (see PRICING-02)
- Given I'm a paying user, when I export, then there's no limit and I can download unlimited times

**UX Notes:**
- Show loading spinner during generation
- After export, show "Download started" toast
- For both versions, filename includes "ATS-Safe" or "Visual" for clarity

**Edge Cases:**
- Very long CVs (> 3 pages) should still generate; warn user if > 4 pages (suggest trimming)
- Network timeout during generation: allow retry

---

### US-07: Save and Resume CV
**As a** user  
**I want to** save my CV draft to the cloud and resume editing later from any device  
**So that** I don't lose my work and can continue building my CV over time

**Acceptance Criteria:**
- Given I'm editing a CV, when I make changes, then the draft auto-saves within 2 seconds (indicator shows "Saved")
- Given I'm logged in, when I go to "My CVs", then I see a list of all my saved CVs with titles, last modified dates, and thumbnail previews
- Given I click a CV in the list, then I'm taken back to the builder with all my content restored
- Given I close the browser and return later, when I log in, then my CVs are there

**UX Notes:**
- Auto-save should be silent; only show error if save fails with retry
- Allow manual "Save" button as backup (also shows spinner)
- CV title defaults to "CV - [Current Month Year]" but editable

**Edge Cases:**
- If offline, changes saved to localStorage and synced when online
- Conflict resolution: last write wins with "CV updated on another device" notice

---

### US-08: Transparent Pricing Display
**As a** visitor  
**I want to** see clear, upfront pricing without hidden fees or tricks  
**So that** I can decide if the product is worth my money without surprises

**Acceptance Criteria:**
- Given I'm on the pricing page (or footer "Pricing"), when I view, then I see:
  - Free plan: create CVs, but cannot export PDF
  - Pro plan: $12/month or $99/year (cancel anytime, 30-day money-back guarantee)
  - Explicit statement: "No setup fees, no hidden charges, cancel anytime"
- Given I hover over pricing, then I see a tooltip or link to full terms
- Given I'm on a free plan, when I try to export, then I'm shown an upgrade modal with the same transparent pricing

**UX Notes:**
- Pricing page simple, no complex tables
- Show annual savings (e.g., "Save $45/year vs monthly")
- Display trust badges (SSL, secure payment)

**Edge Cases:**
- Regional pricing? Keep flat USD for MVP; show conversion estimate via Stripe
- Tax inclusive? Display "+ applicable taxes" if needed

---

### US-09: Upgrade to Pro (Export Unlock)
**As a** free user  
**I want to** upgrade to a paid subscription to unlock PDF exports and all templates  
**So that** I can actually use the CV I've built

**Acceptance Criteria:**
- Given I'm on a free plan, when I click "Export PDF", then I see an upgrade modal explaining Pro benefits (PDF export, all templates, unlimited saves)
- Given I choose "Upgrade Now" in the modal, when I'm taken to checkout, then I can pay via credit card (Stripe) or PayPal
- Given payment succeeds, when I return to the app, then my account is Pro and I can export immediately
- Given I upgrade, then I see a confirmation email and my billing date is set
- Given I want to cancel, I can do so in account settings with one click (see US-10)

**UX Notes:**
- Upgrade modal not too intrusive; allow continuing to edit
- After successful upgrade, show celebratory toast: "You're Pro! Export your CV now"
- Billing cycle clearly shown (next billing date)

**Edge Cases:**
- Payment failure: show error, allow retry
- Subscription already exists: handle gracefully

---

### US-10: Cancel Subscription (Anytime)
**As a** paying user  
**I want to** cancel my subscription at any time without penalty  
**So that** I retain trust and control over my spending

**Acceptance Criteria:**
- Given I'm a Pro user, when I go to Account > Billing, then I see my current plan, next billing date, and a "Cancel Subscription" button
- Given I click "Cancel Subscription", when I confirm in a modal, then my subscription is set to end at the current period's end (no immediate loss of access)
- Given I cancel, then I receive an email confirmation with the effective cancellation date
- Given my current period hasn't ended, I retain Pro features until then
- Given I'm on the dashboard after canceling, I see a notice: "Your subscription will end on [date]. You can reactivate anytime."

**UX Notes:**
- Cancel flow: two-step (button + confirmation modal)
- Offer feedback reason (optional) but not required to cancel
- Provide link to "Reactivate" if changed mind before period ends

**Edge Cases:**
- Annual plan: cancellation still valid until period end; no refunds after 30-day guarantee window
- Account deletion separate from subscription cancellation (handle in data deletion policy)

---

### US-11: AI Industry Tips
**As a** user in a specific industry  
**I want to** receive contextual keyword and action verb suggestions for my CV  
**So that** I can tailor my CV to my field and improve ATS matching

**Acceptance Criteria:**
- Given I'm editing a section (e.g., Experience), when I click the AI Tips icon, then I see industry-specific suggestions (e.g., for Tech: "Led", "Architected", "Deployed", "CI/CD", "Scalability")
- Given I select a suggestion, when I click "Insert", then the text is inserted at cursor position (or appended if no cursor)
- Given I change my industry selection in settings, the tips update accordingly
- The tips are displayed in a sidebar panel with categories: Action Verbs, Keywords, Metrics to Quantify
- Tips are based on real job descriptions for that industry (not generic)

**UX Notes:**
- Tips should be concise (1-2 words or short phrases)
- One-click insert; allow multiple inserts
- Show source attribution: "Common in [industry] job postings" (builds trust)

**Edge Cases:**
- User hasn't selected industry: prompt to choose one (default based on first CV section or generic)
- No tips for a niche industry: show fallback generic professional tips

---

### US-12: Mobile-Responsive Builder
**As a** mobile user  
**I want to** build and edit my CV on my phone or tablet  
**So that** I can work on my CV on the go

**Acceptance Criteria:**
- Given I'm on a mobile device (< 768px width), when I open the builder, then the UI adapts with a single-column layout, larger touch targets (min 44px), and sticky action buttons
- Given I'm editing a field, when the keyboard appears, then the field scrolls into view
- Given I'm in preview mode, when I view the CV, then I can pinch-to-zoom and scroll vertically
- All core actions (add section, save, export, AI tips) are accessible via bottom nav or clearly visible buttons

**UX Notes:**
- Use responsive grid; avoid horizontal scrolling
- Simplify template picker to scrollable cards
- Optimize auto-save to avoid battery drain

**Edge Cases:**
- Extremely small screens (< 320px): show alert to use larger device (graceful degradation)
- Orientation change: preserve user input and scroll position

---

## P1 Stories (Important, Post-MVP Candidates)

- US-13: Password Reset (AUTH-03)
- US-14: AI Parsing from Existing Resume (AI-03)
- US-15: Duplicate CV (BUILDER-08)
- US-16: Application Tracker Basic (TRACKER-01, TRACKER-02)
- US-17: Undo/Redo in Builder (UI-03)
- US-18: Inline Validation & Hints (UI-02)
- US-19: ATS Score Display (AI-04)

---

## P2 Stories (Nice-to-Have)

- US-20: AI Contextual Prompts (AI-05)
- US-21: Follow-up Reminders (TRACKER-03)
- US-22: Profile Editing (AUTH-04)
- US-23: Reorder Sections via Drag-and-Drop (BUILDER-04)

---

## Acceptance Criteria & UX Guidelines

- All AC are written in Gherkin-style (Given/When/Then) for testability.
- UX notes are hints for designers/developers; not exhaustive specs.
- Edge cases should be addressed in test plans.
- Stories are independent where possible; dependencies noted.

---

*End of User Stories MVP Selection (12 P0 stories).*
