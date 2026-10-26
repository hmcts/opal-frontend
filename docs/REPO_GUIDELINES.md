# Repository Guidelines

This document is the authoritative source for implementation standards in `opal-frontend`.

Apply these standards to new and materially changed code. Improve nearby legacy code when it is necessary to deliver
the ticket safely, but do not expand a change into unrelated remediation.

## Project structure

- Keep Angular features, shared services, and colocated unit specs under `src/app`.
- Keep feature-specific UI state with the feature that owns it.
- Keep features self-contained by default and expose only the integration points their consumers require.
- Use `src/assets` for static assets and `src/styles.scss` for global styling; register new bundled assets in `angular.json` where required.
- Keep deployment configuration under `charts/` and follow the existing Jenkins pipeline entry points.
- Keep SSR and Node server concerns in the existing server entry points and follow nearby route and middleware patterns.
- Match existing file, class, function, route, and test naming. Do not introduce new abbreviations without an established precedent.
- Use explicit file suffixes to show responsibility, such as `.component`, `.service`, `.directive`, `.pipe`,
  `.interface`, `.type`, `.constant`, and `.mock`. Reserve unsuffixed files for pure, framework-agnostic helpers.
- Keep definition files such as `*.interface.ts`, `*.type.ts`, `*.constant.ts`, and `*.mock.ts` isolated and side-effect
  free. Prefer one export per file and do not add re-exports, runtime logic, or framework-specific dependencies. When
  constants are always consumed together, prefer one exported object with an explicit shape over several
  single-constant files.

## Toolchain and commands

Use Corepack and Yarn 4. Treat `.nvmrc` and the `packageManager` field in `package.json` as the authoritative Node and Yarn versions.

- Install dependencies: `yarn`
- Start the Angular development server: `yarn start`
- Check formatting: `yarn prettier`
- Fix formatting on touched files when needed: `corepack yarn exec prettier --write <file...>` (the `prettier:fix` script formats the whole repository)
- Run Angular linting: `yarn lint:ng`
- Run Vitest unit tests once: `yarn test`
- Run unit tests in watch mode: `yarn test:watch`
- Produce unit-test coverage: `yarn test:coverage`
- Create a production bundle: `yarn build`

Use the applicable Cypress guide for component, smoke, functional E2E, and accessibility test commands.
`yarn test:a11y` and `yarn pa11y` are compatibility placeholders: they only print a message and exit successfully.
They do not execute accessibility checks. Run the applicable Cypress accessibility specs instead and record their results.

## Formatting and naming

For consistent journey-specific form identifiers and their reactive-form, DOM, error, selector, and mapper-boundary
mapping, follow [SONAR.md](SONAR.md#form-identifiers).

- Follow `.editorconfig`: UTF-8, spaces, two-space indentation, and trimmed trailing whitespace.
- Follow `.prettierrc`: 120-character line width, single quotes, and semicolons.
- Use `app`-prefixed kebab-case Angular component selectors and `app`-prefixed camelCase directive selectors.
- Use clear, descriptive names. Avoid abbreviations that obscure intent.
- Order TypeScript members consistently with nearby maintained code.
- Use direct imports. Do not add barrel exports or imports.

## Angular and TypeScript

- Follow the Angular version installed by the repository and patterns used in nearby maintained code; do not target unreleased or uninstalled framework features.
- Apply modern Angular features in new and materially changed code when they are supported by the installed version
  and fit the established integration.
- Prefer standalone components, routes, and providers. Do not introduce an `NgModule` unless an existing integration requires one.
- Treat routed data-entry flows as journeys rather than dashboard pages. Apply `PRIMARY_NAV_HIDDEN_ROUTE_DATA` at the
  journey's parent route so every child page inherits hidden primary navigation without duplicated route metadata.
- When adding the first route under a new journey root, update the app shell's initial-URL recognition and tests as well
  as the route data. Direct or refreshed child URLs must start with primary navigation hidden; do not rely only on a
  later `NavigationEnd` event, which can expose the navigation during initial rendering.
- Prefer modern template control flow such as `@if`, `@for`, and `@switch` over legacy structural directives in new
  and changed templates. Track dynamic `@for` collections by a unique, stable item identity; use `$index` only for
  collections that are truly static.
- Use signals for appropriate local state and `computed()` for derived state. Keep computed functions and other state
  transformations pure and predictable.
- Use signal inputs and outputs where they fit the existing component API.
- Use reactive forms for non-trivial forms and keep validation logic out of templates.
- Keep templates declarative. Do not call functions with side effects or perform heavy work such as `.map()` or
  `.filter()` in bindings, and do not introduce impure pipes without a demonstrated need.
- Prefer pure pipes or computed signals over inline operations that allocate new values during change detection. Do
  not bind newly created object or array literals or call allocation-producing helper methods from templates. Store a
  stable field value or compute the value outside the binding instead.
- Favour `OnPush` change detection for new and changed components unless an established integration requires the
  default strategy.
- Use Angular view queries such as `viewChild()` and `viewChildren()`, or the established `@ViewChild` and
  `@ViewChildren` decorators, to access template children. Prefer component or directive references and Angular
  bindings; use `ElementRef` or direct DOM access only when no suitable Angular abstraction exists and keep it narrowly
  scoped.
- Keep strict typing. Avoid `any`; use a precise type or `unknown` with narrowing.
- Use `inject()` and component or directive `host` metadata where consistent with nearby code.
- Preserve SSR safety: do not access browser-only globals without the repository's established platform guards.

## RxJS and asynchronous state

- Choose observable concurrency intentionally: use `switchMap` for latest-only work, `exhaustMap` when a form submit
  must ignore repeats until completion, and `concatMap` when request order must be preserved.
- Prefer the `async` pipe for subscriptions owned by a template instead of subscribing imperatively in the component.
- Do not nest `subscribe()` calls inside observable chains, especially when the outer stream is consumed by the
  template or `async` pipe. Compose the operations into one stream.
- Do not use `tap()` to start dependent HTTP requests. Compose dependent work with `switchMap`, `concatMap`, or
  `exhaustMap` according to its cancellation and ordering needs so completion and failure have one explicit model. Use
  `combineLatest` or `forkJoin` for independent sources or parallel requests, creating them inside the appropriate
  flattening operator when an earlier result determines which sources are required.
- Clear derived state when its source selection, route value, or other input is absent or becomes invalid.
- Keep imperative subscriptions lifecycle-safe. Prefer `takeUntilDestroyed()` for new and changed Angular code; use
  `takeUntil()` with `ngOnDestroy` where an established compatible pattern requires it.
- Clean up timers, event listeners, and other resources when their owner is destroyed.
- Throttle or debounce high-frequency event streams before they trigger requests, expensive work, or repeated state
  updates.

## Code design and maintainability

- Keep changes focused on the ticket Acceptance Criteria.
- Preserve existing behaviour unless the ticket requires a change.
- Avoid unrelated refactoring, speculative abstractions, duplicated logic, and unnecessary dependencies.
- Prefer simple, readable code. Add comments that explain why a non-obvious decision was made rather than restating
  what the code does.
- Add JSDoc to public APIs and methods whose contract, constraints, side effects, error behaviour, or usage cannot be
  understood clearly from their name and types. Do not add comments that merely restate the implementation.
- Keep components and services small, cohesive, and focused on one clear responsibility. Extract helpers when doing so
  makes the behaviour easier to understand or test.
- Prefer small, single-purpose, pure functions. Pass explicit inputs and return data instead of hiding dependencies or
  performing avoidable side effects, and keep cyclomatic complexity low.
- Use the collection method that most directly expresses intent: use `includes()` for value membership and `some()`
  when evaluating a predicate. Do not replace one mechanically where equality semantics or sparse collections affect
  behaviour.
- Separate container and presentational responsibilities when a component's orchestration and rendering concerns have
  grown difficult to understand or test together.
- Do not introduce broad shared providers or shared state when a standalone or feature-scoped provider is sufficient.
- Keep routes modular and integration boundaries explicit.
- Prefer existing shared components and utilities over bespoke replacements.
- Add brief inline documentation when introducing a pattern that other contributors are expected to copy.
- Explain any unavoidable increase in complexity, dependency footprint, or public API surface in the PR.

## Performance and resource efficiency

- Lazy-load routes and large features. Prefer deferrable views for substantial UI that does not need to render
  immediately.
- Avoid unnecessary DOM depth and wrapper elements.
- Avoid long-running synchronous work on the main thread. Move genuinely heavy computation to a Web Worker when the
  added boundary and maintenance cost are justified.
- Prefer native browser and Angular APIs over large third-party libraries for straightforward operations.
- Assess the bundle-size and maintenance impact of a new third-party dependency. Record its size impact and why it is
  needed when introducing a material dependency.
- Consider caching API responses that change infrequently only when reuse is safe. Define freshness, invalidation,
  error behaviour, and user or session boundaries so stale or cross-user data cannot be served.
- Optimise raster images for their rendered size and format, and prefer SVG for icons where appropriate.

## Design system and content

- Use GOV.UK Design System patterns as the baseline for frontend flows.
- Use HMCTS or Ministry of Justice patterns where an established component or pattern exists.
- Prefer repository and shared-library components over bespoke markup and styling.
- Use GOV.UK typography, spacing tokens, colour, and content conventions.
- Shared form-control components commonly render their own `.govuk-form-group`. Do not wrap them in another
  `.govuk-form-group` solely for layout: GOV.UK's nested `:last-of-type` rule can remove the controls' vertical spacing.
- Render checkbox and radio conditional content as a sibling of its controlling component when the shared component
  owns the outer form group. Use GOV.UK spacing utilities when a separate section margin is required; do not compensate
  for incorrect DOM nesting with bespoke SCSS. Follow this structure (and the equivalent shared radio components):

  ```html
  <opal-lib-govuk-checkboxes fieldSetId="show_details_fieldset" legendText="">
    <div
      opal-lib-govuk-checkboxes-item
      labelText="Show details"
      inputId="show_details"
      inputName="show_details"
      ariaControls="detailsConditional-conditional"
      [control]="form.get('show_details')"
    ></div>
  </opal-lib-govuk-checkboxes>
  @if (form.get('show_details')?.value === true) {
  <div opal-lib-govuk-checkboxes-conditional conditionalId="detailsConditional">
    <opal-lib-govuk-text-input
      labelText="Detail"
      inputId="detail"
      inputName="detail"
      [control]="form.get('detail')"
      [errors]="formControlErrorMessages['detail']"
    />
  </div>
  }
  ```

- Keep label emphasis consistent within a section. Add `govuk-label--s` only when the approved design explicitly calls
  for a bold label; omit it when adjacent field labels use the component's regular-weight default.
- Within a journey, centralise repeated derived Date of birth presentation in one reusable component. Bind the source
  `FormControl`, calculate via `DateService` only when the control is valid, clear the derived state for empty or invalid
  values, and do not persist age in form or API data. `DateService.isValidDate()` establishes that a value is a real
  calendar date; it does not replace Date of birth validation such as rejecting today or future dates.
- Add bespoke styling only when no suitable established pattern exists.
- Keep content concise, user-centred, and consistent with the GOV.UK style guide.
- Keep routed placeholder pages structurally representative of their intended completed page. Include the appropriate
  GOV.UK grid wrapper and page-width class, matching the approved adjacent journey page when that is the design
  baseline; do not leave a bare heading that renders at a different width from the eventual screen.
- Use the shared GOV.UK button component by default. For a `govuk-button-group` containing exactly one primary action
  and `opal-lib-govuk-cancel-link`, use a native `<button>` with the standard `govuk-button` classes when the shared
  button component's custom-element host prevents GOV.UK flex alignment. Preserve the correct `type`, accessible text,
  stable ID, spacing class, and shared cancel-link behaviour, and do not generalise this exception to other button
  arrangements.

## Accessibility

Changed UI must meet WCAG 2.2 AA expectations.

- Give form controls and buttons visible labels or appropriate accessible names.
- Give informative images meaningful `alt` text and decorative images empty alternative text.
- Use semantic HTML first and ARIA only when native semantics are insufficient.
- Ensure interactions work with keyboard navigation and retain a visible focus state.
- Preserve logical focus order and move focus deliberately when a flow requires it.
- Associate validation errors with their controls and make error summaries useful to screen-reader and keyboard users.
- Handle loading, empty, error, and validation states clearly.
- Retain sufficient colour contrast and do not rely on colour alone to communicate meaning.

## Testing

For Sonar Quality Gate prevention, New Code duplication, meaningful coverage, prohibited shortcuts, and local
pre-flight, follow [SONAR.md](SONAR.md). This document remains authoritative for repository testing standards.

- Add or update tests for changed logic, validation, state handling, error paths, empty states, and regression-prone behaviour.
- New and materially changed executable code must meet the configured Sonar **Coverage on New Code** Quality Gate of
  80%. Aim for 100% meaningful coverage. Identify and justify any uncovered new code in the PR, including the affected
  behaviour, risk, and reason it is not covered.
- Treat 80% as the enforceable floor, not the engineering target. Business rules, validation, guards, state
  transitions, transformations, and error paths should normally be fully covered.
- Use evidence from the externally configured Sonar Quality Gate to confirm the threshold. Do not treat a local
  coverage report alone as equivalent evidence.
- Add tests that assert meaningful behaviour rather than tests that merely execute lines to increase coverage.
- Keep coverage exclusions narrow. Record each new or expanded exclusion in the PR with its technical reason, the code
  affected, the risk it creates, and any alternative verification. Do not add broad exclusions to make the quality
  gate pass.
- Use the most focused test level that proves the behaviour: Vitest unit, Cypress component, smoke, or functional E2E.
- Name unit specs `*.spec.ts` and colocate them with their source.
- Keep Angular `TestBed` setup focused and mock HTTP or store dependencies at clear boundaries.
- Prefer assertions through user-observable behaviour. Use an existing Angular component Harness where one is
  available, and do not add brittle DOM selectors or test IDs in its place.
- Add route or integration coverage for changed server behaviour where feasible.
- Keep existing relevant tests passing.
- Document manual scenarios when automated coverage does not execute the changed behaviour.
- Treat tests as living documentation; assert observable behaviour rather than implementation details.
- Follow the dedicated Cypress documents for Cypress-specific structure, selectors, metadata, accessibility, and execution.

## Frontend security

- Never add secrets, credentials, tokens, or PII to code, logs, comments, screenshots, fixtures, or tests.
- Keep untrusted data out of HTML, URL, and style injection sinks.
- Avoid `bypassSecurityTrust*`, `[innerHTML]`, `[srcdoc]`, unsafe URLs, and unsafe dynamic styles.
- When one of these mechanisms is unavoidable, scope it narrowly, validate or sanitise the input, add relevant tests, and document the justification and mitigating controls in the PR.
- Do not weaken authentication, authorisation, route guards, security headers, or dependency controls without explicit ticket scope and review evidence.
- Document any suppressed or accepted CVE with its identifier, rationale, and mitigating controls.

## Documentation and delivery

- Update the README or supporting documentation when behaviour, configuration, commands, integration points, or workflows change.
- Update an LLD only when the complete journey or feature is ready and an LLD update is required.
- Identify required configuration and feature flags in the implementation handoff and PR.
