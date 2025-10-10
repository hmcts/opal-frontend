# Repository Guidelines

## Project Structure & Module Organization
- `src/app` holds Angular feature modules, shared services, and `.spec.ts` unit tests; keep UI state colocated with feature directories.
- `src/assets` and `src/styles.scss` cover static assets and global styling; reference new assets in `angular.json` if bundling is required.
- Cypress suites live in `cypress/e2e` (smoke, functional) and `cypress/component`; adjust parallel weights in `cypress/parallel/weights/*.json` when adding specs.
- Deployment and infra logic sits under `infrastructure/` and `charts/`, while SSR helpers are in `server.ts` and `server-setup.ts`.

## Build, Test, and Development Commands
- `yarn start` runs `ng serve` at `http://localhost:4200/` with live reload.
- `yarn ng lint` executes the Angular ESLint builder across `src/**/*.ts` and `src/**/*.html`.
- `yarn build` creates a production bundle in `dist/`.
- `yarn test` runs Karma/Jasmine once; `yarn test:coverage` outputs lcov to `coverage/`.
- `yarn test:functional` and `yarn test:smoke` drive Cypress in parallel against configured stages; use `yarn test:dev:*` variants when pointing at a local `TEST_URL`.
- `yarn test:opalComponent` covers component-level Cypress tests and publishes Mochawesome reports.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, spaces, 2-space indent, trimmed trailing whitespace, single quotes in `.ts` files.
- Prettier (`.prettierrc`) enforces 120 character width, single quotes, and semicolons; run `npx prettier --write` on touched files before committing when formatting drifts.
- ESLint rules require Angular selectors to use the `app` prefix (`app-example`) and TypeScript members ordered by visibility; keep directive selectors camelCase.

## Testing Guidelines
- Name Jasmine specs as `*.spec.ts` alongside source; prefer shallow `TestBed` setups and mock HTTP/Store dependencies.
- Cypress `.feature` files live under `cypress/e2e/**`; tag specs with `@smoke` or `@functional` for selective runs via `TEST_STAGE` variables.
- Accessibility checks run via `yarn test:a11y`; include axe assertions in Cypress where possible.
- Publish coverage with `yarn test:coverage` and confirm major features maintain >80% branch coverage before merging.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit style (`chore(deps): …`, `refactor: …`) optionally prefixed with Jira keys (e.g., `PO-716`); keep the subject ≤72 characters.
- Reference the Jira ticket and linked PR (e.g., `(#1828)`) in the subject or body.
- Pull requests should include a concise summary, testing evidence (command output or UI screenshots), and updated checklists. Attach Cypress artifacts when debugging flakes.

## Local Environment & Tooling
- Use Node `22.20.0` from `.nvmrc` and Yarn `4.10.3`; run `corepack enable` before `yarn install`.
- Copy baseline environment configs from `config/` and avoid committing secrets; prefer `.env.local` over editing tracked files.
- Review `sonar-project.properties` for additional quality gates before triggering pipeline builds.
