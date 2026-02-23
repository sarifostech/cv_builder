# CV Creator Webapp - Project Brief

## Overview
A web application that helps job seekers create professional, ATS-compatible CVs with intelligent assistance.

## Target Users
Job seekers across various industries and experience levels, including students and professionals.

## Core Problem
- Formatting struggles: Users find it difficult to create well-structured CVs
- ATS compatibility: Many CVs fail applicant tracking systems due to poor formatting
- Position matching: Users need help tailoring CVs to specific job postings

## Platform
Mobile-responsive web application (progressive web app potential)

## Stack Preference
Fullstack JavaScript (likely MERN or Next.js stack)

## MVP Must-Have Features (Prioritized)
1. **Templates** - A selection of professional, ATS-friendly templates
2. **PDF Export** - High-quality PDF generation with proper formatting
3. **Save/Resume** - Account system with cloud storage to save and edit CVs later
4. **AI Parsing** - Parse existing CV/resume (upload or paste) using AI to extract structured data
5. **AI Tips** - Contextual suggestions to improve CV content and ATS score

*Note: Multilanguage support may be deferred post-MVP due to scope.*

## Auth Requirements
- Users must create an account to save/resume CVs
- Guest mode: users can create a CV but must sign up to save it

## Data Storage
Cloud database (PostgreSQL/MongoDB) for user accounts and CV data

## Success Metrics
- Export count (primary): Number of PDF CVs generated
- Adoption: User signups and active users
- Retention: Users returning to edit/create new CVs

## Constraints
- No immediate budget constraints specified
- Fullstack JS required
- ATS compatibility testing needed

## Open Questions / Assumptions
- Which AI service/API to use for parsing and tips? (OpenAI, Anthropic, or open source?)
- Multi-tenant or single organization? Probably individual users
- Template customization: limited colors/sections or full editor?
- Export formats: PDF only or also DOCX, TXT?
- Social sharing? LinkedIn import?

---

Created: 2026-02-23
Owner: Orchestrator
Status: Draft
