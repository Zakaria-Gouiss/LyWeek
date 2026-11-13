# Stage 1 Audit: Index and Baseline

Stage 1 (Repository Analysis) per `AI Testing and Code Review Specification.md`. **Read-only analysis. No application code was modified, no files deleted, no dependencies installed, no fixes implemented.**

## Baseline (Spec 21)

| Item | Value |
|---|---|
| Branch reviewed | `claude-work` |
| Commit reviewed | `8898579fcece89927a8a6904a95c4f0050adf05a` |
| Base (`main`) | `ca6f5ac5d1a5d83396feeef836e7352aa043d34e` |
| Build status | **Not run** (no execution environment; GitHub file access only) |
| Existing tests | None found in `src/`, `server/`, `electron/`; no test framework in either `package.json`; server `test` script is a placeholder |
| CI | No `.github/` directory in the repo root |
| Existing docs | `README.md` only |
| Known issues | None open apart from PR #7 itself (`open_issues_count` of 1 includes PRs) |
| Structure | Vite/React frontend (`src/`), Express/pg backend (`server/`), Electron shell (`electron/`, `forge.config.cjs`) |

## Reports

1. `01-security.md`
2. `02-bugs-and-data-integrity.md`
3. `03-dead-code.md`
4. `04-documentation.md`
5. `05-testing-gaps.md`
6. `06-quality-performance-accessibility.md`

## Method and limits

- Method: read source files via the GitHub API on `claude-work`. Nothing was executed.
- **Not run:** app, build, lint, tests, `npm audit`.
- **Secret scanning tool failed** ("Repository does not have GitHub Advanced Security enabled"). Secrets were checked only by eye in the files read. `.env` files, git history, other branches and deployed environments were not inspected. No secret values were found in the files read.
- **Database schema is not in the repo.** Every statement about column types, FK cascades, unique constraints or indexes is inference and is labelled as such.
- **Files not read:** `LoginPage.jsx`, `EditAssignmentModal.jsx`, `WeekInfo.jsx`, `WeekButton.jsx`, `LogoWelcome.jsx`, `AddButton.jsx`, `src/utils/api/{classes,notes,semesters}.js`, `src/index.css`, `vite.config.js`, lockfiles, PRs 1-6.
- Dependency versions (e.g. Electron 43, Vite 8, ESLint 10) were not assessed for vulnerabilities.
- **Inline code comments were not possible:** PR #7 only changes the spec file, and GitHub only accepts inline comments on lines inside a PR's diff.
- **GitHub write access was denied** (403 / "Resource not accessible by integration") when pushing these files and when creating a PR review, so these reports exist only as local files and nothing was posted to the PR.

## Top findings

| ID | Finding | Severity | Confidence |
|---|---|---|---|
| SEC-01 / BUG-01 | `POST /login` inserts a `notes` row *before* verifying the password (one root cause, two symptoms) | High | High |
| BUG-03 | Registration is non-atomic; bad date leaves an orphan user | Medium | High |
| BUG-02 | New accounts have no notes row; saving notes 404s until next login | Medium | High |
| BUG-09 | In-memory sessions plus no 401 handling cause silent failures after restarts | Medium | High |
| BUG-05 | Checking an assignment permanently deletes it | Medium | High (behavior), Low (intent) |
| SEC-02 | No rate limiting on auth | Medium | High |
| SEC-03 | Foreign-key ownership not validated | Medium | High / Medium |
| SEC-07 | Electron packaging may bundle `server/.env` | UNCERTAIN (High if true) | Low |

## Recommended next steps

1. Human review of every finding using the classification boxes (Spec 20).
2. Fix SEC-01/BUG-01 first (delete the notes insert from login, create the row at registration).
3. Settle SEC-07 with `npx asar list` on a packaged build.
4. Stage 2: write tests for the cases in `05-testing-gaps.md`.
5. Stage 3 only after approval.

## Severity key

Critical / High / Medium / Low / Informational, per Spec 17. UNCERTAIN = not presented as a confirmed defect (Spec 4).
