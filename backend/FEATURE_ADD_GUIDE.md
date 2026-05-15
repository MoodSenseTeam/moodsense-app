# How to Add a New Feature (keeping SWE principles)

This guide explains a pragmatic, disciplined workflow for adding a new feature to this codebase while preserving software engineering (SWE) principles: correctness, maintainability, testability, and safety.

TL;DR: Design first → tests first → implement small, iterative changes → wire into app → run tests and linters → open a small PR with clear description.

## 1. Quick design
- Write a short feature spec (1–2 paragraphs): purpose, user-visible behavior, API shape, data model changes.
- Identify affected layers: domain, application/use-cases, persistence (repositories), infrastructure (DB, external services), and API/controller.

## 2. Safety checks before coding
- Confirm no breaking DB migrations are required; if required, design a backward-compatible migration strategy.
- Check security/privacy implications (input validation, auth, sensitive data storage).

## 3. Tests first
- Add unit tests for domain logic (pure business rules) under `src/domain/...` or `tests/domain/...`.
- Add unit tests for use-cases (application/service layer) using a small in-memory or mocked repository.
- Add contract/integration tests for the HTTP route (controller) if applicable; keep them fast.

Notes:
- Keep tests deterministic and isolated. Use fixtures and in-memory implementations where possible.

## 4. Implement incrementally
1. Implement or extend domain entities / value objects.
2. Implement use-case / service logic that orchestrates domain + repositories.
3. Add or update repository methods (keep interfaces stable). Prefer to adapt repositories rather than leak domain models across unrelated boundaries.
4. Implement controller/route and DTO/validation (e.g., `zod` schemas). Keep controllers thin — delegate logic to use-cases.

Tips:
- Favor small commits that map to steps above (one commit per layer change).
- Prefer composition over changing existing public interfaces where possible.

## 5. Persistence & schema migrations
- If database schema changes are needed, write a migration with a safe, reversible plan.
- Prefer adding new columns with defaults and backfilling in a separate step to avoid downtime.

## 6. Wiring and bootstrap
- Register new repositories / use-cases in the appropriate bootstrap module (`src/bootstrap/*`).
- Keep wiring explicit and centralized; avoid scattering `new` calls across the app.

## 7. Static checks and formatting
- Run TypeScript compiler (`tsc`) and the project's linters/formatters. Fix issues before committing.

## 8. Run full test suite
- Run `pnpm test` (or `npm test`) in the `backend/` folder.
- Ensure all tests pass and there are no new warnings.

## 9. Documentation
- Add or update README, API docs, or change logs describing the feature and any configuration.

## 10. PR & Code Review checklist
- Small PR with focused scope and meaningful title.
- Include: short feature description, design decisions, migration steps, and test plan.
- Ensure CI passes (tests + linters).
- Ask reviewer to focus on: correctness of domain logic, edge cases, security, and migration safety.

## 11. Post-merge
- Monitor logs/telemetry for errors.
- If applicable, run any required backfill or monitoring tasks.

## Example minimal checklist (copy into PR template)
- [ ] Spec written and approved
- [ ] Unit tests added (domain + use-case)
- [ ] Controller/DTO tests added
- [ ] DB migration included (if required)
- [ ] Linter and type checks pass
- [ ] Small, descriptive commits and PR description
