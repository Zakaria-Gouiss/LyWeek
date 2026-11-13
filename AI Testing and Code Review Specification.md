# AI Testing and Code Review Specification

## 1. Purpose

This document defines the requirements, scope, process, and evaluation criteria for an AI-assisted software testing and code review experiment on the LyWeek application.

The purpose of this experiment is to determine how effectively an AI system can assist with software quality assurance when given access to a real software project. The AI will be used to examine the existing LyWeek codebase, identify potential defects and weaknesses, suggest improvements, generate or improve tests, and, where appropriate, implement changes.

The AI should not be treated as an unquestioned authority. Its findings and modifications must be evaluated by a human developer before they are considered valid. The purpose of this experiment is not to maximize the number of changes made to the repository. The purpose is to determine which types of problems AI can reliably identify or improve, which types of recommendations are incorrect or unnecessary, and where human judgment remains necessary.

The experiment should prioritize correctness, reliability, security, maintainability, and useful documentation over the number of issues discovered.

---

# 2. Project Context

## 2.1 Application

The application being reviewed is LyWeek, a web-based academic planning application.

LyWeek allows users to organize academic information such as:

- Semesters
- Classes
- Assignments
- Assignment due dates
- Assignment completion status
- Assignment priorities
- Notes
- Professor information
- Office hours
- OneNote links
- Weekly academic schedules

The application contains both frontend and backend components and interacts with a database.

## 2.2 Technology

The project currently uses technologies including:

- React
- Vite
- JavaScript
- Express
- Node.js
- PostgreSQL
- Supabase in the production environment
- REST-style API communication
- Git/GitHub
- Vercel for frontend deployment
- Render for backend deployment

The repository should be inspected directly to determine the actual current architecture. Do not assume that this document completely describes the implementation.

The source code and configuration files are the authoritative source for determining how the application currently works.

## 2.3 Experimental Environment

This experiment is being conducted on the `claude-work` development branch.

Changes made during the experiment must not intentionally modify or compromise the production version of LyWeek.

Do not intentionally interact with or modify production infrastructure, production databases, production credentials, deployment configuration, or production data unless explicitly instructed by the human developer.

The experiment should be performed using development/local resources whenever possible.

---

# 3. Role of the AI

The AI is acting as a software testing and code review assistant.

The AI should behave similarly to an additional software engineer reviewing an unfamiliar project.

The AI should:

1. Read and understand the relevant source code before recommending changes.
2. Identify potential bugs and vulnerabilities.
3. Identify unnecessary, unreachable, unused, or obsolete code.
4. Identify missing or inadequate documentation.
5. Identify testing gaps.
6. Generate useful test cases where appropriate.
7. Explain the reasoning behind significant findings.
8. Distinguish confirmed problems from possible problems.
9. Avoid changing code merely for stylistic preference.
10. Clearly identify uncertainty.
11. Preserve existing functionality unless a change is necessary to correct a verified problem.
12. Prefer small, understandable changes over large refactors.

The AI should not assume that an unusual implementation is automatically incorrect.

Before changing behavior, determine what the existing code appears to be intended to do.

---

# 4. Human Oversight Requirements

Human review is mandatory throughout this experiment.

The AI must not assume that its recommendations are correct simply because they appear technically reasonable.

For significant findings, provide:

- The file involved
- The relevant function, component, route, or section
- The suspected problem
- Why it may be a problem
- The expected behavior
- The observed behavior
- The potential impact
- The confidence level
- A recommended solution
- A suggested method for verifying the solution

Use the following confidence categories:

### High Confidence

The problem can be demonstrated directly from the source code, configuration, or reproducible behavior.

### Medium Confidence

The problem appears likely based on the available evidence, but additional testing or clarification is needed.

### Low Confidence

The issue is speculative or depends on assumptions about intended behavior.

Low-confidence findings should not be presented as confirmed defects.

---

# 5. Initial Repository Reconnaissance

Before modifying files, inspect the repository and establish an understanding of the project.

Identify:

- Frontend entry points
- Backend entry points
- API routes
- Database-related code
- Authentication-related code
- Configuration files
- Environment-variable usage
- Components
- Pages/screens
- Utility functions
- Middleware
- Error handling
- Existing tests
- Build scripts
- Deployment configuration
- Documentation
- Unused or apparently abandoned directories/files
- Dependencies in package files
- Scripts defined in package files

Create a high-level description of the current architecture before making major changes.

Do not immediately rewrite or reorganize the project.

The first objective is understanding.

---

# 6. Bug Detection

Search for bugs that may not be obvious from normal use.

Look for problems involving:

## 6.1 Logic

- Incorrect conditions
- Incorrect comparisons
- Incorrect boolean logic
- Incorrect assumptions about values
- Off-by-one errors
- Incorrect date calculations
- Incorrect week calculations
- Incorrect semester boundaries
- Incorrect state transitions
- Incorrect default values
- Race conditions
- Unexpected asynchronous behavior
- Incorrect error handling
- Incorrect API response handling

## 6.2 React/Application Behavior

Inspect for:

- Incorrect state management
- Stale state
- Incorrect `useEffect` dependencies
- Unnecessary or missing effects
- Component lifecycle problems
- Missing cleanup
- Incorrect event handling
- Forms that fail under unusual input
- Components that can enter inconsistent states
- Rendering behavior that differs from intended behavior
- Missing loading states
- Missing error states
- Incorrect conditional rendering
- Problems caused by browser refreshes or navigation

## 6.3 Backend/API

Inspect:

- Route validation
- Request validation
- Response handling
- Error handling
- HTTP status codes
- Authentication checks
- Authorization checks
- Missing checks for required data
- Incorrect assumptions about database responses
- Improper handling of malformed requests
- Unexpected server failures
- Data consistency problems

## 6.4 Database/Data Integrity

Inspect for:

- Missing validation
- Invalid values entering the database
- Null-related problems
- Incorrect database queries
- Incorrect joins
- Missing ownership checks
- Incorrect relationships between tables
- Duplicate records
- Race conditions
- Data that can become inconsistent
- Client-controlled values that should be validated server-side
- Errors that can leave partially completed operations

Pay particular attention to whether users can access or modify another user's data.

## 6.5 Edge Cases

Consider cases such as:

- Empty input
- Missing input
- Extremely long input
- Unexpected characters
- Invalid dates
- Dates at semester boundaries
- Empty semesters
- No classes
- No assignments
- Multiple assignments with the same name
- Multiple classes
- Deleted records
- Refreshing during an operation
- Network failure
- API failure
- Database failure
- Unauthorized requests
- Expired sessions
- Invalid IDs
- Nonexistent resources

Do not create artificial edge cases that are irrelevant to the application's actual behavior.

---

# 7. Security Review

Perform a security-focused review of the application.

The objective is to identify realistic vulnerabilities rather than produce a generic security checklist.

Inspect for:

## 7.1 Authentication

Check:

- Login behavior
- Session handling
- Password handling
- Authentication checks
- Logout behavior
- Session expiration
- Unauthorized access
- Authentication bypass possibilities

## 7.2 Authorization

Determine whether backend routes properly verify that the authenticated user owns or is permitted to access the requested resource.

Pay particular attention to:

- User IDs
- Semester IDs
- Class IDs
- Assignment IDs
- Note IDs
- Direct object references
- API parameters

Look for situations where changing an identifier could allow access to another user's information.

## 7.3 Input Validation

Check whether untrusted input is validated before being used.

Inspect:

- Request bodies
- URL parameters
- Query parameters
- Database queries
- User-provided names
- URLs
- Dates
- IDs
- Authentication inputs

## 7.4 Injection

Look for realistic opportunities for:

- SQL injection
- Cross-site scripting
- Command injection
- Other unsafe interpretation of user-controlled input

Do not claim that a vulnerability exists solely because user input exists. Determine whether the input actually reaches a dangerous operation.

## 7.5 Secrets

Search for accidentally exposed:

- API keys
- Passwords
- Database credentials
- Session secrets
- Access tokens
- Private keys
- Deployment credentials

Do not reveal secret values in the report.

If a secret is discovered, identify the location without reproducing the secret itself.

Do not attempt to use discovered credentials.

## 7.6 Data Exposure

Check whether API responses, frontend code, logs, errors, or configuration files expose information that should not be exposed.

## 7.7 Dependency and Configuration Risks

Inspect package dependencies and configuration for obvious security concerns.

Do not automatically upgrade dependencies simply because newer versions exist.

If an outdated dependency appears relevant to security, explain:

- Current dependency
- Known concern
- Why it matters to this project
- Whether an upgrade is compatible
- What should be tested after upgrading

---

# 8. Dead Code and Unnecessary Files

Inspect the repository for code and files that appear to be unused.

Potential targets include:

- Unused imports
- Unused variables
- Unused functions
- Unused components
- Unused routes
- Unused API endpoints
- Unused CSS
- Duplicate utilities
- Old implementations
- Abandoned components
- Duplicate configuration
- Unused dependencies
- Test files that no longer correspond to the application
- Temporary development files
- Debugging code
- Console logging that should not remain
- Old documentation
- Duplicate assets

However, do not delete something solely because it appears unused.

Before recommending deletion, determine whether it is:

- Imported indirectly
- Used dynamically
- Required by a build process
- Required by deployment
- Referenced by configuration
- Intended for future functionality
- Used by a script
- Required by another part of the application

For every proposed deletion, explain why the file/code appears safe to remove.

---

# 9. Documentation Review

Evaluate the project's documentation.

Look for missing or inadequate documentation concerning:

- Project setup
- Installation
- Environment variables
- Running the frontend
- Running the backend
- Database setup
- API behavior
- Authentication
- Deployment
- Important architectural decisions
- Non-obvious code behavior
- Development workflow
- Testing
- Known limitations

Do not add documentation that merely repeats obvious code.

Documentation should help another developer understand and operate the project.

If documentation is inaccurate, identify the discrepancy between the documentation and the actual implementation.

---

# 10. Testing Review

Determine what testing currently exists.

Identify:

- Unit tests
- Integration tests
- API tests
- Component tests
- End-to-end tests
- Manual testing procedures
- Test scripts
- Test configuration

Determine which important functionality currently lacks automated testing.

Prioritize testing of:

1. Core application logic
2. Authentication
3. Authorization
4. Database interactions
5. API routes
6. Assignment behavior
7. Semester/week calculations
8. Important user interactions
9. Error conditions
10. Security-sensitive behavior

Tests should verify intended behavior rather than simply increase code coverage.

---

# 11. AI-Generated Test Requirements

When generating tests, the AI should explain:

- What behavior the test verifies
- Why the behavior is important
- What input is used
- What output or behavior is expected
- Whether the test represents a normal case, edge case, failure case, or security case
- Why the test would fail if the suspected defect existed

Generated tests must be reviewed before being considered valid.

Do not create tests that merely reproduce the current implementation without verifying the intended behavior.

Avoid tests that are so tightly coupled to implementation details that they would pass even when the application's actual behavior is incorrect.

---

# 12. Test Categories

Where appropriate, consider the following categories.

## Normal Cases

Verify that common valid inputs produce the expected behavior.

## Boundary Cases

Verify behavior at important limits.

Examples include:

- First day of a semester
- Last day of a semester
- Empty collections
- Single-item collections
- Multiple items
- Minimum and maximum expected values

## Invalid Input

Verify that malformed or invalid input is rejected safely.

## Failure Cases

Verify behavior when:

- API requests fail
- Database operations fail
- Authentication fails
- Resources do not exist
- Network connectivity is unavailable

## Security Cases

Verify that:

- Unauthorized users cannot access protected functionality
- Users cannot access other users' data
- Invalid input cannot exploit backend operations
- Sensitive information is not unnecessarily exposed

---

# 13. Code Quality Review

Evaluate code quality, but do not treat personal style preferences as defects.

Look for:

- Excessive duplication
- Difficult-to-understand logic
- Poor separation of responsibilities
- Inconsistent error handling
- Overly complex functions
- Unnecessary state
- Repeated logic
- Misleading names
- Hard-coded values where configuration is more appropriate
- Inconsistent patterns
- Maintainability problems

Do not perform large refactors simply to make the code look cleaner.

A proposed refactor should have a clear benefit such as:

- Correctness
- Security
- Maintainability
- Testability
- Performance
- Reduced duplication

---

# 14. Performance Review

Look for realistic performance problems.

Consider:

- Unnecessary API requests
- Repeated database queries
- Inefficient loops
- Excessive rendering
- Unnecessary network requests
- Large data processing on the client
- Missing pagination where appropriate
- Inefficient database operations

Do not optimize code without evidence that the current implementation creates a meaningful problem.

Avoid premature optimization.

---

# 15. Accessibility and User Experience

Where applicable, inspect the user interface for basic accessibility and usability issues.

Consider:

- Semantic HTML
- Keyboard accessibility
- Form labels
- Button accessibility
- Focus behavior
- Error messages
- Missing alternative text
- Color-dependent information
- Readability
- Clear feedback after actions
- Loading states
- Error states

Only report issues that are relevant to the actual application.

---

# 16. Documentation of Findings

Every significant finding should be categorized.

Use categories such as:

- BUG
- SECURITY
- DATA INTEGRITY
- DEAD CODE
- DOCUMENTATION
- TESTING GAP
- CODE QUALITY
- PERFORMANCE
- ACCESSIBILITY
- UNCERTAIN

Each significant finding should include:

### Finding

A concise description.

### Evidence

The specific code, behavior, or configuration that supports the finding.

### Impact

What could happen if the issue remains unresolved.

### Confidence

High, Medium, or Low.

### Recommendation

What should be changed, if anything.

### Verification

How a human developer can determine whether the recommendation is correct.

---

# 17. Severity

Use the following severity levels:

### Critical

A problem that could cause severe security compromise, major data loss, or catastrophic application failure.

### High

A serious security, data-integrity, or functional problem that could significantly affect users.

### Medium

A meaningful bug, weakness, or maintainability problem that should be addressed but does not represent an immediate severe threat.

### Low

A minor defect, documentation issue, cleanup opportunity, or low-impact improvement.

### Informational

An observation or recommendation that does not represent a defect.

Do not inflate severity.

---

# 18. Change Policy

The AI may recommend changes broadly, but implementation should be conservative.

Do not:

- Rewrite the entire application
- Change the framework without a clear reason
- Replace working architecture without evidence
- Delete files without establishing that they are unnecessary
- Change production configuration
- Remove security controls
- Disable validation
- Remove authentication or authorization
- Introduce unnecessary dependencies
- Make unrelated stylistic changes
- Change behavior solely because another implementation is preferred

When possible, make changes in small, logically separated commits.

Each meaningful change should be explainable.

---

# 19. Before-and-After Verification

For every meaningful code change:

1. Establish what behavior existed before the change.
2. Identify the intended behavior.
3. Make the smallest reasonable change.
4. Run the relevant tests.
5. Run the build if appropriate.
6. Check for regressions.
7. Explain what changed.
8. Explain how the change was verified.

A successful build does not prove that the application is correct.

A passing test does not automatically prove that the test itself is valid.

---

# 20. Human Verification

The human developer will independently evaluate AI findings.

For each significant finding, classify it as:

- Confirmed
- Partially correct
- Incorrect
- Irrelevant
- Uncertain

For AI-generated code or tests, determine whether the output:

- Correctly understands the application's intended behavior
- Introduces new behavior unintentionally
- Fixes the claimed problem
- Creates another problem
- Is unnecessarily complex
- Can be independently verified

The human developer has final authority over whether changes are accepted.

---

# 21. Experiment Baseline

Before substantial AI modifications are made, establish a baseline.

Record:

- Current branch
- Current commit
- Current build status
- Existing tests
- Existing documentation
- Existing known issues
- Existing functionality
- Existing repository structure

The purpose of the baseline is to distinguish problems discovered by the AI from problems introduced by the AI.

Do not modify the baseline solely to make the experiment appear more successful.

---

# 22. Experimental Stages

The experiment should proceed in stages.

## Stage 1: Repository Analysis

The AI examines the project without making substantial changes.

Goals:

- Understand architecture
- Identify bugs
- Identify vulnerabilities
- Identify dead code
- Identify documentation problems
- Identify testing gaps

Output should be a prioritized findings report.

## Stage 2: Test Generation

Based on the findings, the AI proposes and creates appropriate tests.

The human developer evaluates whether the tests actually test intended behavior.

## Stage 3: Controlled Improvements

The AI may implement selected improvements.

Changes should be limited to findings that have sufficient evidence and clear verification methods.

## Stage 4: Verification

Run relevant tests and manually inspect important changes.

Compare the final state against the baseline.

Document:

- Problems discovered
- Problems correctly identified
- False positives
- False negatives discovered through later testing
- Tests created
- Changes implemented
- Changes rejected
- Changes modified by the human developer

---

# 23. False Positives and False Negatives

The experiment should explicitly track incorrect AI conclusions.

A false positive occurs when the AI identifies something as a problem that is not actually a problem.

A false negative occurs when a real problem exists but the AI fails to identify it.

Both are important results.

Do not hide incorrect AI recommendations from the experimental record.

Incorrect recommendations provide evidence about the limitations of AI-assisted software testing.

---

# 24. Human vs. AI Comparison

Where practical, compare AI findings with problems identified through human inspection.

The comparison should consider:

- Number of useful findings
- Number of false positives
- Severity of findings
- Types of defects discovered
- Security issues discovered
- Testing gaps discovered
- Documentation improvements
- Bugs that remained undetected
- Quality of generated tests
- Amount of human verification required

The objective is not to determine which method produces the largest number of findings.

The objective is to determine whether AI provides meaningful additional value.

---

# 25. Important Experimental Principle

The AI should optimize for correctness, not activity.

Finding ten real problems is more valuable than finding fifty questionable problems.

Deleting unnecessary code is not inherently better than keeping it.

Adding more tests is not inherently better than having fewer meaningful tests.

Making more code changes is not inherently better than making fewer correct changes.

The AI should prefer evidence-based recommendations.

---

# 26. Agentic Behavior and Boundaries

This experiment is also intended to explore the implications of increasingly autonomous AI software engineering systems.

However, autonomy should increase gradually.

The AI may inspect the repository, reason about problems, generate tests, and propose changes.

More consequential actions require greater human verification.

The AI should not independently decide that a major architectural change, security-sensitive change, database migration, production deployment, or destructive operation is necessary without human approval.

The experiment should demonstrate the difference between AI assistance and AI authority.

---

# 27. Privacy and Intellectual Property

The repository may contain proprietary or personally relevant software.

Do not expose:

- Passwords
- API keys
- Authentication secrets
- Database credentials
- Private tokens
- Deployment credentials
- Personal information
- Unnecessary private data

Do not reproduce secrets in findings.

Do not attempt to access systems or information outside the authorized project environment.

Only inspect and modify files necessary for the experiment.

---

# 28. Git and Change Tracking

All meaningful experimental changes should be represented through Git.

The `claude-work` branch is the experimental branch.

Use commits to distinguish meaningful stages of the experiment.

Where practical, maintain a progression similar to:

1. Baseline
2. AI analysis
3. AI-generated tests
4. Human corrections
5. Approved fixes
6. Final verification

Do not rewrite Git history solely to hide mistakes made during the experiment.

The Git history is part of the experimental record.

---

# 29. AI Use and Decision Log

Important decisions made during the experiment should be recorded separately from the source code.

Record:

- Date
- AI tool/model used
- Task given to the AI
- Relevant context provided
- AI recommendation
- Human decision
- Reason for accepting, rejecting, or modifying the recommendation
- Verification performed
- Result

Particular attention should be given to situations where the AI is confidently incorrect, where human judgment changes an AI recommendation, and where AI discovers a problem that was previously unnoticed.

---

# 30. Final Evaluation Questions

At the conclusion of the experiment, evaluate the following questions:

1. What types of defects was the AI able to identify?
2. What types of defects did it miss?
3. How often were its findings correct?
4. How often did it produce false positives?
5. Did it identify security issues that were previously unnoticed?
6. Did it identify dead or unnecessary code correctly?
7. Did its generated tests meaningfully improve coverage or validation?
8. Did it misunderstand any important application requirements?
9. How much human verification was required?
10. Did AI assistance meaningfully improve the software?
11. Did the benefits outweigh the risks introduced by AI-assisted development?
12. Which tasks appear appropriate for greater AI autonomy?
13. Which tasks should remain under direct human control?
14. What additional safeguards would be necessary for an AI system that could independently review code, create tests, modify code, and submit pull requests?

---

# 31. Final Principle

The objective of this experiment is not to prove that AI is good or bad at software testing.

The objective is to produce evidence about where AI assistance is useful, where it is unreliable, and where human judgment remains necessary.

A successful experiment may include both successful and unsuccessful AI recommendations.

The most valuable result is an accurate understanding of the boundary between AI assistance and human responsibility in software testing.