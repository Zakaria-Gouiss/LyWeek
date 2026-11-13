# Testing Gaps

## Current state (static inspection)

- No test files in `src/`, `server/` or `electron/` as listed; no test framework in either `package.json` (root has no `test` script; server `test` is `echo "Error: no test specified"`).
- No `.github/` directory, so no CI.
- `eslint.config.js` applies `globals.browser` to `**/*.{js,jsx}`, which also matches the CommonJS files in `server/` (`require`, `module`, `process`). `npm run lint` would likely report `no-undef` there. **Not run;** inferred from the config. The configured rules would also flag the unused imports in DEAD-01.

## Proposed tests (Stage 2 candidates, none written yet)

Suggested tooling (not installed): Vitest + React Testing Library for the frontend; Vitest or `node:test` + `supertest` against a disposable Postgres for the API.

| # | Behavior | Input | Expected | Type | Why it fails today / value |
|---|---|---|---|---|---|
| T1 | `getSemesterWeek` boundaries | start day, day before start, last day of week 1, Monday of week 2, Sunday start, DST-change week | 1, <=0, 1, 2, per intended Sunday rule, no off-by-one | boundary | Pure function; guards the week math |
| T2 | `getSemesterWeek` invalid input | `""`, `"2026-08-24T00:00:00.000Z"`, `null` | A defined error or fallback, not `NaN` | invalid | Fails today (BUG-08, BUG-13) |
| T3 | Failed login creates no data | wrong password for an existing user | 401 and notes row count unchanged | security | Fails today (SEC-01) |
| T4 | Register atomicity | valid user, invalid start date | 400 and no `users` row | failure | Fails today (BUG-03) |
| T5 | Register then save notes | new account, `PUT /notes` | 200 and one notes row | normal | Fails today (BUG-02) |
| T6 | Cross-user access | user A on B's assignment/class/semester id (GET/PUT/DELETE) | 404 and B's data unchanged | security | Should pass; guards the existing good behavior |
| T7 | FK ownership | A creates an assignment with B's `classId` | 4xx | security | Fails today (SEC-03) |
| T8 | PUT on a missing id | `PUT /assignments/999999` | 404 | failure | Fails today (BUG-11) |
| T9 | Weekday ordering | Friday and Monday assignments | Monday before Friday | normal | Fails today (BUG-06) |
| T10 | Class edit preserves `semesterId` | edit name only | `semester_id` unchanged | normal | Fails today (BUG-07) |
| T11 | Login/register forms keep input after a failed attempt | wrong password | fields still filled | component | Fails today (BUG-10) |
| T12 | OneNote link scheme | `javascript:alert(1)` | rejected; button hidden when empty | security | Fails today (SEC-04) |
| T13 | Completing an assignment | click checkbox | behavior matches the decision made on BUG-05 | component | Needs a human decision first |
| T14 | Electron smoke test | launch on Windows/macOS/Linux | window opens without throwing | manual | BUG-12 |

Tests T3 to T12 must assert the *intended* behavior, not the current one. The "fails today" column is predicted from code reading, not from running them.
