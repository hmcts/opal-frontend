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
- Accessibility checks run via `yarn test:a11y`; include axe assertions in Cypress where possible.
- Publish coverage with `yarn test:coverage` and confirm major features maintain >80% branch coverage before merging.

### Component / Integration Tests (Cypress Component)
- `cypress/component/**` houses Component Testing specs (`*.cy.ts`) grouped by capability (`manualAccountCreation`, `fineAccountEnquiry`, shared `pages/`). We are moving toward a shared setup that mounts an Angular router outlet (see `cypress/component/fineAccountEnquiry/accountEnquiry/setup`) so specs can register routes, provide shared services, intercept APIs, and navigate to the component under test. When it exists, prefer extending the shared setup rather than reinventing a mount helper per spec so long as it does not introduce regressions.
- Follow the same Page Object Model that powers E2E: instead of calling `cy.get` directly, import the relevant Actions/Flows from `cypress/e2e/functional/opal/actions/**` or `cypress/e2e/functional/opal/flows/**` and exercise their methods against the mounted component. This keeps behaviour in one place and lets component/E2E suites share selectors, intercepts, and helper logic. Older specs that access the DOM directly should be refactored opportunistically toward this pattern.
- Stable selectors come from `cypress/shared/common.locators.ts` and `cypress/shared/selectors/**`. If a component lacks a hook, add a semantic ID/data attribute in `src/app` first, then expose it via the selector modules so Component and E2E tests remain in sync.
- Store API intercept fixtures beside each spec (`<spec-folder>/mocks/**`). Treat existing mock files as reference templates—copy or extend them for new tests rather than importing shared state directly so scenarios stay isolated.
- Scope specs to discrete acceptance criteria, tagging relevant tests (`{ tags: ['@PO-604'] }`) for Jira traceability. Use local intercept helpers (e.g., `<spec-folder>/intercept/**`) together with the router-outlet setup to simulate the user journey end to end without coupling to global fixtures.
- Run an individual component spec (swap the spec path as needed):\
  `yarn cypress run --browser chrome --component --spec 'cypress/component/fineAccountEnquiry/accountEnquiry/AccountEnquiry.cy.ts'`
- If a component spec fails because of a genuine product bug, do **not** change application code to force a pass—skip or mark the test pending when necessary and explain the real failure in your task update.

### End-to-End Tests (Cypress + Cucumber)
- Preferred home: `cypress/e2e/functional/opal`. Feature files live under capability folders (e.g., `features/manualAccountCreation/**`, `features/fineAccountEnquiry/**`) and are tagged (`@functional`, `@smoke`, Jira IDs) so `yarn test:functional`, `yarn test:smoke`, and `yarn test:dev:*` can target them. Legacy suites remain in `cypress/e2e/Old_functional_E2E_Tests`, but new scenarios should follow the `opal` layout.
- Step definitions in `cypress/support/step_definitions/newStyleSteps/**` must be thin shims: each Given/When/Then delegates to a single Action or Flow method to enforce the POM boundary. Shared DB/setup logic belongs in `databaseSteps` or `support/utils`, not in the steps themselves.
- Actions (`cypress/e2e/functional/opal/actions/**`) wrap page interactions, API stubs, and navigation using selectors from `cypress/shared/selectors/**`. Flows (`cypress/e2e/functional/opal/flows/**`) compose those actions into business journeys (e.g., `AccountEnquiryFlow.searchAndClickLatestBySurnameOpenLatestResult`) and expose the verbs that step definitions and component specs should call.
- Selectors are centralised: add or update hooks in the Angular templates, document them in `cypress/shared/selectors/**`, and import the same constants into Actions, Flows, and Component specs. Avoid positional CSS—these selector modules are the single source of truth, even while legacy tests are being migrated.
- Run an individual feature file (point the spec glob at the feature you changed):\
  `yarn cypress run --browser chrome --spec 'cypress/e2e/functional/opal/features/manualAccountCreation/populateAndSubmit/PopulateAndSubmit.feature'`
- Use the same pattern for smoke/functional subsets by supplying the relevant glob or tags. When a feature genuinely fails, do **not** patch application behaviour just to green the test—document the failure, skip/xfail if unavoidable, and report the underlying issue when you wrap up your changes.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit style (`chore(deps): …`, `refactor: …`) optionally prefixed with Jira keys (e.g., `PO-716`); keep the subject ≤72 characters.
- Reference the Jira ticket and linked PR (e.g., `(#1828)`) in the subject or body.
- Pull requests should include a concise summary, testing evidence (command output or UI screenshots), and updated checklists. Attach Cypress artifacts when debugging flakes.

## Local Environment & Tooling
- Use Node `22.20.0` from `.nvmrc` and Yarn `4.10.3`; run `corepack enable` before `yarn install`.
- Copy baseline environment configs from `config/` and avoid committing secrets; prefer `.env.local` over editing tracked files.
- Review `sonar-project.properties` for additional quality gates before triggering pipeline builds.
