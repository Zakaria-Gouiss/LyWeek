# Bugs and Data-Integrity Findings

Commit reviewed: `8898579`. Static reading only; nothing was executed. The schema is not in the repo, so DB-behavior statements are inference where marked.

---

### BUG-01: Duplicate notes rows (DATA INTEGRITY)
- **Severity / Confidence:** High / High
- **Location:** `authRoutes.js` login; `notesRoutes.js`; `App.jsx` (`notesData[0]`)
- **Evidence:** Every login inserts a new notes row (SEC-01). `PUT /api/notes` runs `UPDATE notes SET content=$1 WHERE user_id=$2` with no row id, so it overwrites all of a user's rows and returns an arbitrary `rows[0]`. `GET` returns all rows (`SELECT *`), and the app displays only the first.
- **Impact:** Unbounded row growth; notes behavior depends on row count.
- **Recommendation:** One notes row per user (UNIQUE(user_id)); create at registration; make PUT an upsert; select only `id, content`.
- **Verification:** Log in three times, then count notes rows.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-02: New accounts cannot save notes until the next login
- **Severity / Confidence:** Medium / High
- **Location:** `authRoutes.js` register; `notesRoutes.js` PUT; `App.jsx handleSaveNotes`
- **Evidence:** Register never inserts a notes row and auto-logs in. `PUT /notes` returns 404 when none exists; the client only `console.error`s.
- **Impact:** First-session notes appear to save but are not persisted, with no user-visible error.
- **Recommendation:** Create the row at registration; surface save errors in the UI.
- **Verification:** Register, type notes, Save, reload.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-03: Registration is not atomic (DATA INTEGRITY)
- **Severity / Confidence:** Medium / High
- **Location:** `authRoutes.js` register
- **Evidence:** The user row is inserted first; the semester start date is validated afterwards. An invalid date returns 400 after the user exists; a failing semester insert returns 500 with the user already created. No transaction. Email is not trimmed or lower-cased, so case variants may create duplicate accounts unless the DB has a `lower(email)` unique index (unknown). The existence check is a race without a UNIQUE constraint.
- **Impact:** Orphan accounts without a semester (see BUG-04) and an email that is already taken.
- **Recommendation:** Validate first; wrap user + semester + notes inserts in a transaction; normalize email; rely on a UNIQUE constraint and handle error 23505.
- **Verification:** POST `/register` with `semesterStartDate: "not-a-date"`, then check `users`.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-04: `GET /api/semesters` returns one object or an empty body
- **Severity / Confidence:** Medium / High on the code path
- **Location:** `semesterRoutes.js` GET; `App.jsx fetchInitialData`
- **Evidence:** `res.json(result.rows[0])` (no `ORDER BY`); with zero semesters this sends an empty 200 body. The client wraps four calls in `Promise.all`, so one failure leaves classes and assignments unloaded. POST/DELETE for semesters exist, so multiple or zero semesters are possible via the API.
- **Impact:** A user without a semester (e.g. after BUG-03) sees an empty app.
- **Recommendation:** Return a defined shape (array or 404/null) and make the client tolerate a missing semester.
- **Verification:** Delete a test user's semester via the API, reload.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-05: Completing an assignment permanently deletes it
- **Severity / Confidence:** Medium / High on behavior, Low on intent (UNCERTAIN)
- **Location:** `App.jsx` and `ElectronApp.jsx`, `handleToggleAssignment`
- **Evidence:** Sets `completed: true` locally, waits 390 ms (the comment says "Wait 1 second"), then calls the delete API. `completed` is never persisted as true. If the delete fails the item stays checked locally. Two quick clicks send two deletes.
- **Impact:** Data loss if the checkbox is expected to be a reversible toggle.
- **Recommendation:** Decide intent. If completed items should be kept, call `PUT` with `completed: true` and filter in the UI; if deletion is intended, label it and fix the comment and failure path.
- **Verification:** Check an assignment; confirm the row is gone.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-06: Assignments sorted alphabetically by weekday
- **Severity / Confidence:** Medium / Medium (schema inferred)
- **Location:** `assignmentRoutes.js` GET (`ORDER BY due_date`)
- **Evidence:** `due_date` holds weekday names (the Add modal offers Monday to Sunday; `seed.js` inserts weekday strings), so the column must be text. Alphabetical order is Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday.
- **Impact:** Assignments in each class are not in weekday order.
- **Recommendation:** Order by weekday index (`array_position(ARRAY['Monday',...], due_date)`) or sort in the client.
- **Verification:** Create Friday and Monday assignments in one class.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-07: Editing a class nulls `semester_id` (DATA INTEGRITY)
- **Severity / Confidence:** Low-Medium / High on the mechanism
- **Location:** `classRoutes.js` (GET omits `semester_id`; PUT sets it), `Class.jsx` (edit payload omits it), `EditClassModal.jsx`, `AddClassModal.jsx`
- **Evidence:** `semesterId` is never loaded or sent by the UI, so `PUT` binds `undefined`, which `pg` writes as NULL. `AddClassModal` and `seed.js` never set it either.
- **Impact:** No visible symptom today; any future semester scoping would find empty values.
- **Recommendation:** Include `semesterId` in GET and the edit payload, or use partial updates.
- **Verification:** Set a class's `semester_id` in a dev DB, edit it in the UI, re-query.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-08: Semester save failures are hidden; no date validation
- **Severity / Confidence:** Medium / High
- **Location:** `App.jsx handleSaveSemester`; `SemesterModal.jsx`; `dateUtils.js`
- **Evidence:** On API error the catch applies the unsaved semester locally. `updatedSemester.id ?? 1` falls back to id 1. The modal inputs lack `required` and any end-after-start check. An empty date makes Postgres reject it (500); the UI then shows it, and `getSemesterWeek` returns NaN.
- **Impact:** The UI shows "Week NaN" and unsaved data that vanishes on refresh.
- **Recommendation:** Validate client and server, remove the `?? 1` fallback, show an error instead of applying local state.
- **Verification:** Clear the start date and save.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-09: In-memory sessions and no 401 handling
- **Severity / Confidence:** Medium / High on mechanism, Medium on frequency
- **Location:** `server.js` (no `store` option); `App.jsx`
- **Evidence:** `express-session` default MemoryStore (not for production; lost on restart, leaks memory). Auth is checked only on mount; later failures only `console.error`.
- **Impact:** After a Render restart or spin-down the UI still looks signed in and every action fails silently.
- **Recommendation:** Use a persistent store (e.g. `connect-pg-simple`); on a 401 return to the login view.
- **Verification:** Restart the backend with a signed-in tab open, then add an assignment.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-10: Auth forms lose input after a failed attempt
- **Severity / Confidence:** Low / High
- **Location:** `App.jsx` (`if (authLoading) return null`), `LoginPage`/`RegisterPage`
- **Evidence:** `handleLogin`/`handleRegister` set `authLoading`, which unmounts the page. `RegisterPage` keeps form state locally, so it resets. The `loading` prop and the "Creating account..." label can never display.
- **Recommendation:** Use a separate `submitting` flag so the form stays mounted.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-11: PUT/DELETE report success when nothing matched
- **Severity / Confidence:** Low / High
- **Location:** `assignmentRoutes.js`, `classRoutes.js`
- **Evidence:** PUT returns `res.json(result.rows[0])`, which is an empty 200 when not found (`semesterRoutes` correctly returns 404). DELETE always returns "deleted". Every error is a 500, including bad ids and missing fields.
- **Recommendation:** 404 on no match; 400 on invalid input.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-12: Electron startup/packaging issues
- **Severity / Confidence:** Medium / Medium (UNCERTAIN for platform behavior)
- **Location:** `electron/main.cjs`, `package.json`, `forge.config.cjs`
- **Evidence:** `electron-squirrel-startup` is a dependency but never required, so Squirrel install/uninstall events are not handled on Windows. `win.setAppDetails` is, as far as I know, Windows-only, yet Forge builds deb/rpm/darwin targets, so it may throw elsewhere.
- **Verification:** `npm start` on macOS/Linux; run the Windows installer.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-13: Date format inconsistencies and loose parsing
- **Severity / Confidence:** Low / Medium
- **Location:** `semesterRoutes.js` POST and `authRoutes.js` register (raw `start_date`) vs GET/PUT (`TO_CHAR`); `dateUtils.js parseLocalDate`
- **Evidence:** Raw DATE values serialize as ISO timestamps; `parseLocalDate` assumes `YYYY-MM-DD` and gives NaN for timestamps (latent, since the UI doesn't use those responses). The 112-day end date uses local-time `setDate` with UTC `toISOString` (off-by-one risk if the server is not UTC), and `new Date()` accepts many string formats.
- **Recommendation:** Return `TO_CHAR` everywhere; validate `YYYY-MM-DD` strictly.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-14: Minor server robustness
- **Severity / Confidence:** Low / High
- The heartbeat cron runs every 10 minutes even if `BETTER_STACK_URL` is unset (logs an error each time). `app.listen` is called before routes are registered (works, but fragile). No env validation at startup.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-15: Minor form validation gaps
- **Severity / Confidence:** Low / High
- The Edit Class modal lacks `required` on name/code/professor (Add has it), so blank class names can be saved. The color input `pattern="#?[0-9A-Fa-f]{3,6}"` accepts 4-5 digits that `normalizeHexColor` silently drops.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### BUG-16: UNCERTAIN: week navigation and Sunday starts
- **Severity / Confidence:** Low / Low
- Week buttons are unbounded (weeks <= 0 or past the end). `getMonday` treats Sunday as the end of the previous week, so a Sunday start shows week 1 as the preceding Monday. Assignments store only a weekday, so the week selector does not filter anything. May all be intended.
- [ ] Confirmed [ ] Partially correct [ ] Incorrect [ ] Irrelevant [ ] Uncertain

### DI-NOTE: Schema not in repo (UNCERTAIN)
`clear.js` deletes assignments, then classes, then semesters, which hints at FKs without cascade. If so, `DELETE /classes/:id` and `/semesters/:id` may fail with 500 when children exist. Add a schema/migration file and confirm.
