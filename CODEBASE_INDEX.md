# ATS Prototype — Codebase Index

High-level map of the project structure, entry points, and data flow. Use this for onboarding and AI context.

---

## Tech stack

| Layer      | Tech |
|-----------|------|
| Frontend  | React 19, TypeScript, Vite 7, React Router 7 |
| Styling   | Tailwind CSS 4, Radix UI, Lucide icons |
| Backend   | Express (local dev), Vercel serverless (production) |
| AI / Chat | OpenAI API via `/api/chat` |
| Hosting   | Vercel (SPA + API routes) |

---

## Entry points

| File | Purpose |
|------|--------|
| `index.html` | HTML shell |
| `src/main.tsx` | React root; mounts `RouterProvider` and global `Toaster` |
| `src/routes/index.tsx` | Route config: `HomeLayout` vs `Layout`, all paths |
| `src/index.css` | Global styles (Tailwind) |

---

## Routing

- **Default:** `/` → redirects to `/home`.
- **Home shell** (`HomeLayout`): `/home` — landing-style layout with top/bottom nav.
- **App shell** (`Layout`): sidebar + main content for:
  - **Jobs:** `/jobs`
  - **Candidates:** `/candidates`, `/candidates/all`, `/candidates/search`, `/candidates/messaged`, `/candidates/replied`, `/candidates/interviewing`, `/candidates/hired-rejected`, `/candidates/not-interested`, `/candidate/:id`
  - **Interviews:** `/interviews`
  - **Analytics:** `/analytics`
  - **Settings:** `/settings`
  - **Components (dev):** `/components`

Both shells wrap children in `CandidatePoolsProvider`, `MessagedCandidatesProvider`, and `ChatbotPanelProvider`.

---

## Key directories

### `src/pages/`
Route-level pages. Exported from `src/pages/index.ts`. Main ones: `Home`, `Jobs`, `Candidates`, `AllCandidates`, `CandidateSearchResults`, `CandidateDetail`, pipeline tabs (`Messaged`, `Replied`, `Interviewing`, `HiredRejected`, `NotInterested`), `Interviews`, `Analytics`, `Settings`, `Components`.

### `src/components/`
- **Layout/nav:** `Layout.tsx`, `HomeLayout.tsx`, `Sidebar.tsx`, `SiteNav.tsx`
- **Candidate:** `CandidateProfilePanel.tsx`, `CandidatePipelineTabs.tsx`, `CandidateMessageTable.tsx`
- **Chat:** `Chatbot.tsx`, `ChatbotPanel.tsx`
- **UI:** `src/components/ui/` — shared primitives (button, card, dialog, table, tabs, chat-container, markdown, etc.)

### `src/lib/`
- **api.ts** — `chat()` calls `POST /api/chat`; types: `ChatMessage`, `ChatRequest`, `ChatResponse`, `ChatError`
- **candidatePoolsContext.tsx** — candidate pipeline / pool state
- **messagedCandidatesContext.tsx** — messaged candidates state
- **candidateSearch.ts** — search helpers
- **utils.ts** — e.g. `cn()` (classnames)

### `src/data/`
- **candidates.ts** — mock/sample candidate data
- **resumes/** — placeholder (e.g. `.gitkeep`)

### `src/hooks/`
- **use-mobile.tsx** — mobile breakpoint / layout hook

---

## Backend / API

| Location | Role |
|----------|------|
| `api/chat.ts` | Vercel serverless handler: POST body `{ messages, model?, temperature? }`, calls OpenAI, returns `{ message, usage }`. Requires `OPENAI_API_KEY`. |
| `server/index.js` | Local Express server: `POST /api/chat` (same contract), `GET /api/health`. Port 3001. |

**Local dev:** Vite proxies `/api` → `http://localhost:3001` (run `npm run dev:server` for the API).

**Production:** Vercel serves `api/chat.ts` as serverless; `vercel.json` rewrites all other routes to `index.html` (SPA).

---

## Environment

- **.env.example:** `OPENAI_API_KEY=sk-your-api-key-here`
- Copy to `.env` or `.env.local` and set `OPENAI_API_KEY` for chat/AI features.

---

## Scripts (package.json)

| Script | Command | Purpose |
|--------|---------|--------|
| `dev` | `vite` | Frontend dev server |
| `dev:server` | `node --env-file=.env.local server/index.js` | Local API server (port 3001) |
| `build` | `tsc -b && vite build` | TypeScript + production build |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Lint |

---

## Import alias

- `@/` → `src/` (see `vite.config.ts` and TS configs).

---

*Last indexed: 2025-02-12*
