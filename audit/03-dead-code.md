# Dead Code and Unnecessary Files

Nothing here should be deleted without the checks listed (Spec 8). No deletions were made.

| ID | Item | Evidence | Confidence | Check before removing |
|---|---|---|---|---|
| DEAD-01 | Unused imports in `src/App.jsx`: `lyLight`, `lyDark`, `Assignment`, `getWeekInfo`; unused `Assignment` import in `ElectronApp.jsx` | Not referenced in the file bodies read; the logos are imported again where used (`RegisterPage.jsx`) | High | `npm run lint` (`no-unused-vars`) |
| DEAD-02 | `authRoutes` mounted at both `/api/auth` and `/api` | `server.js`; the frontend builds URLs from `VITE_API_PREFIX` | UNCERTAIN | Which prefix production sets in Vercel env |
| DEAD-03 | `id: Date.now()` in the Add Class / Add Assignment payloads | Server POST handlers never read `id` | High | None |
| DEAD-04 | Debug logging: `console.log(navigator.userAgent)` (`main.jsx`), `"REGISTERED USER:"`, `"SEMESTER DATA:"`, `"CURRENT WEEK:"` (`App.jsx`), `"About to start Express..."` (`server.js`) | The register log prints the user's name and email to the browser console | High | None |
| DEAD-05 | `build/lyweek.ico` | Same byte size (370,070) as `src/assets/lyweek.ico`; `main.cjs` and `forge.config.cjs` reference only `src/assets` | Low (UNCERTAIN) | Compare blob SHAs; grep for `build/lyweek` |
| DEAD-06 | `electron-squirrel-startup` dependency | Never required in `electron/main.cjs` (see BUG-12). Likely should be wired in, not removed | High that it is unused | Decide whether to wire it in |
| DEAD-07 | `/test-db`, `/` root route | Dev leftovers (see SEC-06) | High | Confirm no uptime monitor uses `/` |
| DEAD-08 | `server/package.json`: `"main": "index.js"` (file does not exist), placeholder `test` script, empty description/keywords | | High | None |
| DEAD-09 | `seed.js` `hasColorColumn` fallback | API routes assume `color` exists, so the fallback only matters for old schemas | Low | Confirm schema |
| DEAD-10 | Unused `event` params in radio `onChange` handlers (`AddAssignmentModal.jsx`) | | High | Lint |
| DEAD-11 | Redundant prop-to-state `useEffect` in `EditClassModal.jsx` and `SemesterModal.jsx` | Modals are conditionally mounted, so the initial `useState` values already cover it | Medium | Behavior when the parent object identity changes |

Not dead but duplicated: `ElectronApp.jsx` is roughly 90% a copy of `App.jsx` (see CQ-01).
