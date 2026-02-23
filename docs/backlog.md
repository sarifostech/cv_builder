# Product Backlog - CV Creator MVP

**Project:** CV Creator Webapp  
**Version:** 1.0-MVP  
**Last Updated:** 2026-02-23  

---

## Epic: User Authentication & Account Management

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| AUTH-01 | As a job seeker, I can sign up with email/password so I can access my CVs from any device | P0 | M | - |
| AUTH-02 | As a user, I can log in and log out securely | P0 | S | AUTH-01 |
| AUTH-03 | As a logged-in user, I can reset my password via email | P1 | S | AUTH-02 |
| AUTH-04 | As a user, I can update my profile name/email | P1 | S | AUTH-02 |

---

## Epic: CV Builder Core (ATS-First)

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| BUILDER-01 | As a user, I can create a new CV from a blank canvas | P0 | M | AUTH-01 (for saving) |
| BUILDER-02 | As a user, I can choose from 8-10 industry-specific ATS-friendly templates | P0 | M | BUILDER-01 |
| BUILDER-03 | As a user, I can add/edit/delete standard CV sections (Personal Info, Summary, Experience, Education, Skills, Projects) | P0 | L | BUILDER-01 |
| BUILDER-04 | As a user, I can drag-and-drop to reorder sections | P1 | M | BUILDER-03 |
| BUILDER-05 | As a user, I can see a live preview of my CV in both ATS-safe and visual modes | P0 | L | BUILDER-03 |
| BUILDER-06 | As a user, I can export my CV as a PDF (both safe and visual versions) | P0 | M | BUILDER-05 |
| BUILDER-07 | As a user, I can save my CV draft to cloud and resume later | P0 | M | BUILDER-03, AUTH-02 |
| BUILDER-08 | As a user, I can duplicate an existing CV to create variations | P1 | S | BUILDER-07 |

---

## Epic: AI Assistance (Guided, Non-Generative)

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| AI-01 | As a user, I can receive AI-driven tips tailored to my industry (keywords, action verbs) | P0 | L | BUILDER-03 |
| AI-02 | As a user, I can get suggestions to improve my bullet points (quantify metrics, use STAR) | P0 | L | AI-01 |
| AI-03 | As a user, I can import an existing resume by pasting text, and AI extracts structured data to populate fields | P1 | L | BUILDER-01 |
| AI-04 | As a user, I can see an ATS compatibility score with explanations | P1 | M | BUILDER-05, AI-01 |
| AI-05 | As a user, I can receive contextual prompts to fill empty sections (e.g., "What projects demonstrate your leadership?") | P2 | S | AI-02 |

---

## Epic: Application Tracker

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| TRACKER-01 | As a user, I can log jobs I've applied to (company, title, date, status) | P1 | M | AUTH-02 |
| TRACKER-02 | As a user, I can update the status of an application (Applied, Interview, Offer, Rejected) | P1 | S | TRACKER-01 |
| TRACKER-03 | As a user, I can set follow-up reminders for applications | P2 | M | TRACKER-01 |

---

## Epic: Pricing & Trust

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| PRICING-01 | As a visitor, I can see transparent pricing ($12/mo or $99/yr) without hidden fees | P0 | S | - |
| PRICING-02 | As a free user, I can create a CV but need to upgrade to export PDF | P0 | S | BUILDER-06 |
| PRICING-03 | As a paying user, I have unlimited CV exports and access to all templates | P0 | S | PRICING-02 |
| PRICING-04 | As a user, I can easily cancel my subscription anytime | P0 | S | PRICING-03 |
| PRICING-05 | As a user, I can get a 30-day money-back guarantee | P0 | S | PRICING-03 |

---

## Epic: Responsive UI & UX

| ID | Story | Priority | Est. | Dependencies |
|----|-------|----------|------|--------------|
| UI-01 | As a user, I can use the builder on mobile with a responsive layout | P0 | L | BUILDER-03 |
| UI-02 | As a user, I receive inline validation (required fields, formatting hints) | P1 | M | BUILDER-03 |
| UI-03 | As a user, I can undo/redo changes in the builder | P1 | M | BUILDER-03 |

---

## Non-Functional Requirements

- **Performance:** Page load < 2s; PDF export < 5s
- **Security:** HTTPS, password hashing, rate limiting, SQL injection prevention
- **Accessibility:** WCAG 2.1 AA compliance for core flows
- **Browser Support:** Latest 2 versions of Chrome, Firefox, Safari, Edge
- **ATS Validation:** Tested against major ATS systems (Workday, Greenhouse, Lever, SmartRecruiters)

---

## Out of Scope for MVP

- Full generative AI rewrite (e.g., "write my experience from scratch")
- Multi-language support
- LinkedIn/Indeed job import
- Social sharing
- Advanced analytics dashboard
- Team/enterprise features
- Chrome extension

---

**Total Stories:** 26 (P0: 12, P1: 10, P2: 4) — This exceeds the desired 8-15, so we need to trim.

## Recommended MVP Trim

Keep only these P0 stories (12 total):

**Auth:** AUTH-01, AUTH-02  
**Builder:** BUILDER-01, BUILDER-02, BUILDER-03, BUILDER-05, BUILDER-06, BUILDER-07  
**AI:** AI-01, AI-02  
**Pricing:** PRICING-01, PRICING-02, PRICING-03, PRICING-04, PRICING-05  
**UI:** UI-01  

That's 14 P0 stories. If further reduction needed, defer AI-02 and UI-01 to P1 post-MVP.

---

*Note: Estimates: S=Small (1-3 days), M=Medium (4-7 days), L=Large (8-14 days).*
