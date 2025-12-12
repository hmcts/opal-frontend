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

- Preferred home: `cypress/e2e/functional/opal`. Feature files live under capability folders (e.g., `features/manualAccountCreation/**`, `features/fineAccountEnquiry/**`) and are tagged (`@functional`, `@smoke`, Jira IDs) so `yarn test:functional`, `yarn test:smoke`, and `yarn test:dev:*` can target them. Accessibility coverage is split into dedicated specs (e.g., `cypress/e2e/functional/opal/features/fineAccountEnquiry/searchAndMatches/searchAndMatchesAccessibility.feature`) that navigate to each page, inject `axe-core`, run scans, and assert there are no violations. Whenever a new page/view is added to a feature, add/update its accessibility spec accordingly. Legacy suites remain in `cypress/e2e/Old_functional_E2E_Tests`, but new scenarios should follow the `opal` layout.
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

# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.

# Review guidelines (for automated code review)

These rules are designed for automated PR reviews (e.g., Codex in GitHub). They prioritise clear, actionable feedback and map to severity levels Codex understands.

## How to use

- Apply these rules to changes in this PR only.
- Prefer specific, line-anchored comments with a short rationale and a concrete fix.
- Treat **P0** and **P1** as blocking; **P2** as advisory.

## Severity definitions

- **P0 (blocker):** Security risk, data loss, broken UX/AX, build/test failure, or architectural violation that will be hard to undo.
- **P1 (high):** Clearly regressions in quality, maintainability, or performance with simple fixes.
- **P2 (advice):** Stylistic or non-critical improvements.

---

## Repo scope

Angular v20+ standalone app using GOV.UK/HMCTS design system. Prefer modern Angular primitives (standalone components, template control flow, signals) and accessibility to WCAG 2.2 AA.

---

## P0 rules (must block)

1. **Security & safety**

- Unsanitised HTML or `bypassSecurityTrust*` without justification and tests.
- Interpolating user data into `[innerHTML]`/`[srcdoc]`/`style`, or unsafe URL handling.
- Credentials, tokens, secrets, or PII in code, logs, comments, or tests.

2. **Accessibility (AX)**

- Interactive elements not reachable by keyboard, `click` handlers on non-interactive elements without proper roles/tabindex.
- Missing visible label/`aria-label` for form controls or buttons; images without meaningful `alt`.

3. **Architecture & build integrity**

- New Angular modules where a **standalone** component/route/provider is appropriate.
- Mixing **signals** and imperative RxJS within the same component in a way that causes side-effects in template evaluation.
- Using **barrel exports** (`index.ts`, `export *`) or importing via barrels. Prefer **direct, specific imports** from the declaring file. Cross-feature imports are allowed when justified; keep features self-contained by default.
- CI/test failures, TypeScript errors, or missing required checks.

---

## P1 rules (high priority)

1. **Angular correctness**

- Prefer `@if`, `@for`, `@switch` over legacy structural directives in new/changed templates.
- Use **computed signals** and **pure functions** for derived state; avoid calling methods with side effects in templates.
- Choose RxJS concurrency intentionally: `switchMap` for latest-only, `exhaustMap` for form submit, `concatMap` when order matters.

2. **Code quality fundamentals**

- Use clear, descriptive names for symbols, inputs/outputs, and tests; avoid abbreviations that obscure intent.
- Keep components and services small and cohesive; extract helpers to keep implementations readable.
- Prefer simple, readable code over cleverness; add comments that explain _why_ decisions were made.
- Apply modern Angular features (standalone components, signals, control flow) in new/changed code.

3. **Performance**

- Avoid heavy work in templates (no `.map()`/`.filter()` or non-pure pipes inside bindings).
- Lazy-load routes and large feature areas; avoid broad shared providers when a **standalone provider** suffices.
- Guard against large third-party dependencies; if introduced, note size and reason.

4. **Testing**

- Add/maintain tests for new logic and error/empty states.
- Prefer Angular Testing Library/Harnesses; avoid brittle DOM selectors/data-testids when a Harness exists.

5. **Function design**

- Prefer **small, single-purpose, pure functions**.
- Keep cyclomatic complexity low.
- Pass explicit inputs and return data rather than performing side effects.

---

## Green coding and efficiency

- Favour **OnPush change detection** to avoid unnecessary re-renders; avoid computing logic inside templates.
- Prefer **async pipe** for subscription management; when subscribing manually, ensure cleanup using `takeUntil()` and `ngOnDestroy`.
- Use Angular’s `@ViewChild` and `@ViewChildren` rather than direct DOM element references to prevent memory leaks.
- Ensure components clean up timers, event listeners, and subscriptions during destruction.
- Prefer **lazy-loaded modules** and deferrable views to reduce initial memory and CPU usage.
- Use **standalone components** to reduce unnecessary dependencies and improve tree-shaking efficiency.
- Apply effective **garbage collection strategies** by avoiding long-lived references and large retained objects.
- Use `track` expressions in `@for` for efficient DOM diffing.
- Cache API/HTTP responses for data that does not change frequently to reduce repeated network and CPU cost.
- Avoid binding to new object/array literals inside templates; compute once in a signal or helper.
- Prefer pure pipes or computed signals over inline operations that allocate new values on each change detection.
- Throttle or debounce high-frequency events (`scroll`, `keyup`, `mousemove`) before updating state.
- Avoid long-running synchronous work on the main thread; offload heavy computation to Web Workers.
- Use native browser and Angular APIs instead of large libraries for simple operations.
- Optimise images (size, format) and prefer SVG icons to reduce asset weight.
- Avoid unnecessary DOM depth and wrapper elements to reduce layout and paint work.

## P2 rules (advisory)

- Prefer container (smart) vs. presentational component separation when complexity grows.
- Keep features **self-contained** by default. **No barrels** (`index.ts`, `export *`) — prefer direct file imports for tree-shaking.
- Provide brief inline docs when introducing patterns others should copy.

---

## What to ignore (unless requested)

- Typos in comments/docs (treat as P2 unless critical).
- Pure formatting churn without semantic change.

---

## Comment style for the reviewer (automated)

Use this shape to keep feedback crisp and useful:

```
[Severity]: <Rule name>
Problem: <what is wrong in one sentence>
Why: <risk/impact>
Fix: <specific change>
Example: <code snippet or link to guideline>
```

### Examples

- **P0: Unsanitised HTML**
  _Problem:_ `[innerHTML]` used with dynamic user content in `case-summary.component.html`.
  _Why:_ XSS risk.
  _Fix:_ Remove `innerHTML`, render via bindings/DOM APIs, or use a trusted, sanitised subset with tests.

- **P1: Template work**
  _Problem:_ Method call `getItems()` used in template; performs filtering.
  _Why:_ Re-runs each change detection; performance risk.
  _Fix:_ Move to computed signal `itemsFiltered = computed(() => …)` and bind to that.

- **P1: Concurrency**
  _Problem:_ Form submit uses `mergeMap`, causing double submits.
  _Why:_ Users can trigger parallel requests.
  _Fix:_ Use `exhaustMap` around submit stream and disable button while pending.

---

## Repo links (for humans & tools)

- Angular style: standalone, signals, control flow
- GOV.UK/HMCTS patterns and accessibility
- Testing: Angular Testing Library & Harnesses

(When Codex is invoked with `@codex review`, apply these rules. Treat P0/P1 as blocking; raise P2 as comments.)
