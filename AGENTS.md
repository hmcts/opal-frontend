# Repository Guidelines

This file is the entrypoint. It stays brief and points to skills for detailed guidance.

## Skills Map
- `skills/opal-frontend/opal-frontend-repo-guidelines` for repo structure, build/test commands, style rules, and local tooling.
- `skills/opal-frontend/opal-frontend-review-guidelines` for code review severity rules and comment format.
- `skills/opal-frontend/opal-frontend-cypress-component` for Cypress component testing guidance.
- `skills/opal-frontend/opal-frontend-cypress-e2e` for Cypress E2E and Cucumber guidance.
- `skills/opal-frontend/opal-flow-lld` for creating low-level design documents for Opal flows.

## Always-Apply Guardrails
- Do not add secrets, tokens, or PII to code, logs, comments, or tests.
- Prefer standalone components/routes/providers; avoid creating Angular modules by default.
- Avoid barrel exports and barrel imports; use direct imports.
