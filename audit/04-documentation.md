# Documentation Findings

| ID | Finding | Evidence | Severity | Confidence | Recommendation |
|---|---|---|---|---|---|
| DOC-01 | No setup, run, build, deploy or test instructions | `README.md` describes planned features and the stack only | Medium | High | Add install and run steps for frontend, backend and Electron, plus deployment notes (Vercel, Render, Supabase) |
| DOC-02 | Environment variables undocumented; no `.env.example` | Used: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SESSION_SECRET`, `FRONTEND_URL`, `BETTER_STACK_URL`, `NODE_ENV`, `PORT`, `VITE_API_URL`, `VITE_API_PREFIX` | Medium | High | Add `server/.env.example` and a frontend `.env.example` (no real values) |
| DOC-03 | No database schema or migrations in the repo | No `.sql` files in the directories listed. Constraints (UNIQUE email, FK cascades, column types) cannot be verified | Medium | High | Commit a schema file and document it |
| DOC-04 | README seed command typo | `npm run seed --{#}` will not forward the user id; the clear command is written correctly as `-- {#}` | Low | High | Change to `npm run seed -- <userId>`, and warn that `seed` and `clear` delete that user's data in whatever DB `server/.env` points at |
| DOC-05 | Electron wrapper, auth/sessions, notes and semester setup are not documented | README and spec section 2.2 omit Electron/Forge; the packaged app loads `https://lyweek.vercel.app?electron=true` | Low | High | Add an architecture section |
| DOC-06 | No API documentation | Routes, payloads, response shapes and the `/api` vs `/api/auth` prefixes are undocumented | Low | High | Add a short route table |
| DOC-07 | Misleading comment | `handleToggleAssignment`: "Wait 1 second" but the code waits 390 ms; "Visually check the box first" hides that the item is then deleted | Low | High | Fix when BUG-05 is decided |
| DOC-08 | README mixes planned and implemented features | e.g. cross-tool color consistency with Google Calendar/OneNote/Canvas appears to be planned only | Informational | Medium | Mark status per feature |

Human classification (apply per row): [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain
