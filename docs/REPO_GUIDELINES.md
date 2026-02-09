# Repo Guidelines

This document captures repo structure, commands, and coding conventions for opal-frontend.

## Project Structure
- Keep Angular feature modules, shared services, and unit specs in `src/app`; colocate UI state with feature directories.
- Use `src/assets` and `src/styles.scss` for static assets and global styling; add new bundled assets to `angular.json`.
- Keep deployment and infra logic under `infrastructure/` and `charts/`; keep SSR helpers in `server.ts` and `server-setup.ts`.

## Build, Test, and Development Commands
- Run `yarn start` for `ng serve` at `http://localhost:4200/` with live reload.
- Run `yarn lint:ng` for Angular ESLint across `src/**/*.ts` and `src/**/*.html`.
- Run `yarn build` for a production bundle in `dist/`.
- Run `yarn test` for Karma/Jasmine once; use `yarn test:coverage` for lcov in `coverage/`.
- Run `yarn test:a11y` for accessibility checks.

## Coding Style and Naming
- Follow `.editorconfig`: UTF-8, spaces, 2-space indent, trimmed trailing whitespace, single quotes in `.ts`.
- Follow `.prettierrc`: 120 character width, single quotes, and semicolons; run `yarn prettier:fix` on touched files if formatting drifts.
- Use Angular selectors with the `app` prefix (`app-example`) and order TypeScript members by visibility; keep directive selectors camelCase.
- Prefer standalone components/routes/providers; avoid creating Angular modules by default.
- Avoid barrel exports and barrel imports; use direct imports.

## Code Quality Is Non-Negotiable
- Changes must be maintainable: avoid new duplication, keep cognitive load flat, use idiomatic TypeScript and modern Angular, keep routes modular, and ship GOV.UK/MoJ-compliant UI.
- Linting, formatting, and type errors block merge; behavior changes require tests (unit, component, or E2E as appropriate).
- Use existing naming patterns: match file, class, function, and route names to nearby modules; avoid new abbreviations unless already established.

## Design System and Content Standards
- GOV.UK Design System patterns are the baseline for every flow.
- Ministry of Justice Design System patterns are used where MoJ components exist.
- Pages use GOV.UK typography, spacing tokens, and colour palette. Bespoke styling is only allowed when no pattern exists.
- Content follows the GOV.UK style guide and interactive states retain WCAG AA contrast.

## Testing Basics
- Name Jasmine specs as `*.spec.ts` alongside sources.
- Prefer shallow `TestBed` setups and mock HTTP/Store dependencies.
- Keep major features above 80% branch coverage before merging.

## Tests Define Release Readiness
- Every feature ships with unit tests (Karma/Jasmine) that cover edge cases and error paths.
- Server/Express route changes include route or integration tests where feasible.
- Automated accessibility coverage is required via Cypress + axe (see `docs/CYPRESS_E2E_TESTING.md`).
- Smoke tests cover unmocked happy paths using the Cypress smoke suites.
- Tests act as living documentation for intended behavior.

## Local Environment and Tooling
- Use Node `24.13.0` from `.nvmrc` and Yarn `4.12.0`; run `corepack enable` before `yarn install`.
- Copy baseline env configs from `config/`; prefer `.env.local` and avoid committing secrets.
- Review `sonar-project.properties` before pipeline builds.
