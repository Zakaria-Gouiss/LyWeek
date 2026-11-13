# Code Quality, Performance and Accessibility

## Code quality

| ID | Finding | Severity | Confidence |
|---|---|---|---|
| CQ-01 | `ElectronApp.jsx` duplicates most of `App.jsx` (all handlers), so fixes such as BUG-05 must be applied twice. A shared hook would remove the duplication, but is only worth doing alongside a correctness fix. | Low | High |
| CQ-02 | `requireAuth` is copy-pasted in four route files; every error path returns 500 | Low | High |
| CQ-03 | `normalizeHexColor` is duplicated in the Add/Edit class modals; the pattern and regex disagree (BUG-15) | Low | High |
| CQ-04 | Magic numbers: 112-day semester length, 390 ms delay, 7-day cookie, bcrypt cost 12 | Low | High |
| CQ-05 | API helper files repeat `API_URL`/`API_PREFIX` and handle errors inconsistently (`login` parses the error body, `register` does not, so non-JSON errors surface as parse errors; the others discard the body) | Low | High |
| CQ-06 | Mixed indentation and no formatter config (`auth.js`, login handler) | Low | High |
| CQ-07 | `?electron=true` in any browser selects `ElectronApp` | Informational | High |

## Performance

| ID | Finding | Severity | Confidence |
|---|---|---|---|
| PERF-01 | `index.html` requests 18 Kanit weight/italic variants from Google Fonts; only a few are likely used (`index.css` not inspected) | Low | Low (UNCERTAIN) |
| PERF-02 | No indexes are verifiable (schema not in repo); queries filter by `user_id` and `class_id` | Informational | Low |

No other meaningful performance problem was found. Unpaginated GETs are reasonable for a personal planner.

## Accessibility

| ID | Finding | Location | Severity | Confidence |
|---|---|---|---|---|
| A11Y-01 | Assignment checkbox has no accessible name | `Assignment.jsx` | Medium | High |
| A11Y-02 | Notes textarea has only a placeholder, no label | `NoteText.jsx` | Low | High |
| A11Y-03 | Priority is shown only by the ★ glyph, no text alternative | `Assignment.jsx` | Low | High |
| A11Y-04 | Form errors are plain `<p>`, not announced (`role="alert"` / `aria-live`) | `RegisterPage.jsx` (`LoginPage.jsx` not read) | Low | High |
| A11Y-05 | Priority radio group labelled via `<label htmlFor>` pointing at a `<div>`; should be `fieldset`/`legend` | `AddAssignmentModal.jsx` | Low | High |
| A11Y-06 | Expand/collapse buttons lack `aria-expanded` | `Class.jsx` | Low | High |
| A11Y-07 | Modals have `role="dialog"`, `aria-modal` and `aria-labelledby` (good), but no focus trap, initial focus, Escape-to-close or focus restore in the files read | all modals except `EditAssignmentModal` (not read) | Low | Medium |
| A11Y-08 | Add/save/delete failures only `console.error`; no visible error, loading or success state | `App.jsx` | Medium | High |
