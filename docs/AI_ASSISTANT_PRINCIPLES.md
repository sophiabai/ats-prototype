# AI Assistant — PRD alignment (prototype)

This doc summarizes the Rippling AI Assistant PRD so the prototype and future work stay aligned.

## Objective (Q4 2025 Beta)

- **(1)** Answer >90% of employee questions about HRIS, Benefits, Payroll, Time, ATS, Helpcenter, Reports  
- **(2)** Take routine actions in these apps on their behalf  
- **(3)** Expose more complex answers, actions, and advice to admins and managers  
- **(4)** Enable product teams to extend the AI via a common AI platform  

## User personas

| Persona | Pain points (same categories, different scope) |
|--------|-------------------------------------------------|
| **App Owners** | Discoverability, learnability, decision difficulty, tediousness, usability |
| **Employees / App Users** | Same, at a simpler scale (e.g. “How do I submit W4?”) |
| **People managers / Admins** | Same as employees with slightly expanded scope (e.g. team data, approvals) |
| **Product teams** | Want to use AI without deep-diving into AI |

## High-level solution

- **Answers** from app data (usability, discoverability, tediousness)  
- **Actions** (automation) to reduce tediousness and improve usability  
- **Advice / decision support** (e.g. setup recommendations, follow-up questions)  

Scope: HRIS, Benefits, Payroll, Time, ATS, Helpcenter, Reports. Prototype personas: Super Admin, Recruiting Admin, Employee, Manager.

## Product principles

- **Concise and professional** — to-the-point, structured, informative  
- **Context aware** — who, what, where, when, history  
- **Secure** — respect user permissions; never leak data  
- **Explainable** — explain reasoning and intended actions  
- **Auditable** — log actions, allow reversal, cite sources  
- **Non-intrusive** — don’t change main view without buy-in or a way to reverse  
- **Judicious** — ask follow-ups only when assumptions aren’t safe  
- **Transparent** — when creating something, show the object so user can verify and edit  
- **Product-aligned** — anything doable in AI can be done in the product UI  

## Chat UI (requirements reflected in prototype)

- **Entry point** — Easy access (e.g. top nav sparkle); open/minimize; persistent across navigation  
- **Empty state** — Suggestions for questions to ask; “New chat” to reset  
- **Suggestions** — Hard-coded or smart (contextual, page, jobs-to-be-done)  
- **Asking questions** — Type and get an answer; unknown → say so; errors → “Something went wrong”  
- **Loading / thinking** — “Getting started”, “Looking up information”, “Finalizing” (and later, tool visibility)  
- **User feedback** — Thumbs up/down; optional reason for negative feedback  
- **Citations** — Link to help center, reports, object graph / product pages  
- **Actions** — Draft first; link to open draft; no auto-navigate or auto-apply without user step  

## Context (for implementation)

- User: name, role id, title, start date, work location, company id; later department, manager, employment type  
- Company: products/SKUs, countries, PEO/EOR  
- Permissions: read and edit; scope (e.g. full company vs org)  
- Page context: app and page; later detailed entities on page and recent history  

## Prototype scope

- **In scope:** AI panel empty state, suggestions, two flows (Resolve payroll issues, Burn through to-do list) that open modals or navigate; persona gating; principles reflected in copy (citations, drafts, permissions).  
- **Out of scope for prototype:** Real retrieval, RQL, evals, streaming, full @mentions/chips, multi-turn chat backend, prompt registry, AI Kit.  

Use this file when adding or changing AI panel behavior so it stays consistent with the PRD.
