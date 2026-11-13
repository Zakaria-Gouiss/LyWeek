# Security Findings

Commit reviewed: `8898579`. Static reading only. See `00-index-and-baseline.md` for limits.

Positive notes: every SELECT/UPDATE/DELETE in the route files filters by `user_id = session userId`, queries are parameterized (no SQL injection found in the files read), passwords are bcrypt-hashed (cost 12), and the session cookie is `httpOnly` and `secure` in production.

Human classification per finding: Confirmed / Partially correct / Incorrect / Irrelevant / Uncertain.

---

### SEC-01: Login writes to the database before authenticating
- **Severity / Confidence:** High / High
- **Location:** `server/routes/authRoutes.js`, `POST /login`
- **Evidence:** After `SELECT ... WHERE email = $1`, the handler runs `INSERT INTO notes (content, user_id) VALUES ('', user.id)` and only afterwards calls `bcrypt.compare`. The insert executes on wrong-password attempts.
- **Impact:** Anyone who knows or guesses a registered email can create unlimited `notes` rows for that user with no credentials (see BUG-01). Combined with SEC-02 there is no throttle.
- **Recommendation:** Remove the insert from login. Create the single notes row at registration (inside the transaction from BUG-03), with a UNIQUE(user_id) constraint.
- **Verification:** On a dev DB, POST `/api/login` three times with a wrong password for a test user, then `SELECT count(*) FROM notes WHERE user_id = <id>`. Expect 0 new rows after the fix.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-02: No rate limiting or lockout on authentication
- **Severity / Confidence:** Medium / High
- **Location:** `server/server.js`; `server/package.json`
- **Evidence:** No rate-limit or helmet middleware is registered, and neither package is a dependency. bcrypt cost 12 on `/login` and `/register`.
- **Impact:** Password guessing is unthrottled; repeated requests also burn server CPU.
- **Recommendation:** Add `express-rate-limit` on `/login` and `/register` (optionally `helmet`).
- **Verification:** Send 50 rapid wrong-password logins; after the fix expect HTTP 429.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-03: Foreign-key ownership not validated
- **Severity / Confidence:** Medium / High that the check is missing, Medium on impact
- **Location:** `assignmentRoutes.js` (POST, PUT: `classId`); `classRoutes.js` (POST, PUT: `semesterId`)
- **Evidence:** The values come straight from `req.body` into the query. Only the row's own `user_id` is checked.
- **Impact:** User A can attach an assignment to user B's `class_id` (ids are likely sequential). If the schema has `ON DELETE CASCADE`, B deleting that class would delete A's assignment. No read leak found, since GETs filter by `user_id`. Impact depends on the schema, which is not in the repo.
- **Recommendation:** Before insert/update, verify `SELECT 1 FROM classes WHERE id=$1 AND user_id=$2` (same for semesters), or use composite FKs `(id, user_id)`.
- **Verification:** As user A, POST an assignment with user B's classId; expect 4xx after the fix.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-04: Unvalidated `onenoteUrl` used for navigation
- **Severity / Confidence:** Low / High on the mechanism, Medium on severity
- **Location:** `src/components/main-content/Class.jsx` (`openOneNote`); `AddClassModal.jsx`, `EditClassModal.jsx`; `classRoutes.js`
- **Evidence:** `window.location.href = onenoteUrl`. The inputs are `type="url"`, which accepts `javascript:` URLs; the server stores the value unchecked. An empty/null value navigates away from the app (the button is always shown).
- **Impact:** Self-XSS (only the owner can set their own URL; no sharing feature found). Becomes Medium if sharing/import is ever added. In Electron, navigation replaces the app window and unsaved notes are lost.
- **Recommendation:** Allowlist `https:` and `onenote:` on client and server; use `window.open(url, "_blank", "noopener")`; hide the button when empty.
- **Verification:** Save a class with `javascript:alert(1)`, click Open in OneNote. Expect rejection after the fix.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-05: Session fixation hardening and cross-site logout
- **Severity / Confidence:** Low / Medium
- **Location:** `authRoutes.js` (`req.session.userId = ...`); `server.js` cookie config
- **Evidence:** No `req.session.regenerate()` on login/register. The production cookie is `sameSite: "none"`; `POST /logout` needs no body, so a cross-site form POST can log a user out. JSON endpoints are protected in practice by CORS preflight and the origin allowlist.
- **Impact:** Minor (forced logout; fixation needs an attacker able to plant a cookie).
- **Recommendation:** Regenerate the session on login/register; optionally check `Origin` on state-changing routes.
- **Verification:** Compare `connect.sid` before/after login.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-06: Unauthenticated dev endpoints
- **Severity / Confidence:** Low / High
- **Location:** `server/server.js` (`GET /test-db`, `GET /`)
- **Evidence:** `/test-db` runs `SELECT NOW()` for any caller and returns DB timing/errors.
- **Impact:** Confirms DB reachability to anyone.
- **Recommendation:** Remove `/test-db` (keep `/api/health`).
- **Verification:** `curl <backend>/test-db` should 404.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-07: UNCERTAIN: Electron package may include `server/.env`
- **Severity / Confidence:** High if true / Low
- **Location:** `forge.config.cjs` (`packagerConfig` has `asar: true` and no `ignore`)
- **Evidence:** `.gitignore` keeps `.env` out of git, but packaging works from the working directory, which contains `server/`. Not verifiable from GitHub (no local files or built artifacts).
- **Impact:** If a local `server/.env` exists, DB credentials and the session secret would ship inside the distributed `app.asar`.
- **Recommendation:** Add a `packagerConfig.ignore` for `server/`, `.env*`, `audit/`, etc.
- **Verification:** `npm run package`, then `npx asar list out/*/resources/app.asar | grep -i -E "env|server"`.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-08: Electron hardening not explicit
- **Severity / Confidence:** Low / Medium
- **Location:** `electron/main.cjs`
- **Evidence:** `BrowserWindow` created without `webPreferences`; no `will-navigate` / `setWindowOpenHandler`; the packaged app loads the remote `https://lyweek.vercel.app`. Electron defaults should be safe, but are not asserted.
- **Impact:** A compromised remote origin or an arbitrary navigation (see SEC-04) happens inside the app window.
- **Recommendation:** Set `contextIsolation: true, nodeIntegration: false, sandbox: true` explicitly; restrict navigation to the app origin; open external links via `shell.openExternal` after a scheme allowlist.
- **Verification:** Inspect `webContents.getLastWebPreferences()` in a dev build.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-09: Informational: account enumeration
- **Severity / Confidence:** Informational / High
- `register` returns 409 "Email is already registered"; `login` does bcrypt work (and the SEC-01 insert) only when the email exists, so timing differs. Common trade-off; decide if it matters for this app.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-10: UNCERTAIN: database TLS
- **Severity / Confidence:** Low / Low
- `server/db.js` sets no `ssl` option. `pg` also reads `PGSSLMODE` from the environment, which may be set in production (not verifiable). Confirm the Render-to-Supabase connection uses TLS.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### SEC-11: Informational: third-party CSS without SRI
- **Severity / Confidence:** Informational / High
- `index.html` loads Font Awesome from cdnjs without an `integrity` attribute. CSS cannot run scripts; low risk.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain
