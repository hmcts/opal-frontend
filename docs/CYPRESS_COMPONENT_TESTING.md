# Cypress Component Testing

Use this guide when writing or updating Cypress component specs in `opal-frontend`.

## Start from the required behaviour

- Read the ticket, its Acceptance Criteria, and any approved design or implementation plan before choosing scenarios.
- Inspect the current component, store, routing contracts, shared selectors, component support file, and nearest maintained specs.
- Treat plan code as illustrative unless an exact interface, string, route, or value is part of the approved contract. Reconcile examples with the current code before using them.
- Test observable component responsibilities at this layer. Keep pure store transitions and route-table configuration in focused Vitest specs, and keep multi-page journeys, permissions, and deployed integration in routed integration or E2E tests unless the component-test plan explicitly owns them.
- Do not invent production placeholders, permissions, APIs, feature flags, or business values to make a planned test compile.

## Structure and setup helpers

- Keep release specs under `cypress/component/release1a`, `release1b`, and `release1c`, grouped by capability. Preserve shared setup and existing non-release areas under `cypress/component/**`.
- Keep functional, keyboard, accessibility, and reflow tests for a component together in its owning `.cy.ts` spec.
  Use logical `describe(...)` groups within that file instead of a separate accessibility component spec.
- Reuse the nearest maintained setup helper when it accurately represents the feature boundary.
- For a new feature area without a suitable helper, create one targeted helper under the feature's `setup/` folder rather than repeating `mount(...)` in specs.
- Mount the smallest real parent component that coordinates the behaviour under test. Use the real feature store when store interaction is part of the component contract.
- Allow the helper to seed valid initial state when rehydration is in scope, and expose repeatedly asserted fixtures, stores, or spies through named Cypress aliases.
- Stub only boundaries that are intentionally outside the component test. A router spy is appropriate when asserting a navigation request; use a real router-outlet setup when route rendering, guards, resolvers, or destination rendering are the behaviour under test.
- Do not add a production destination placeholder merely to make a component test navigate.
- Keep scenario choices and assertions in the spec, and keep reusable data definitions under the feature's `mocks/**` or `constants/**` folder. Setup helpers own mounting, providers, representative document-shell setup, initial-state seeding, and reusable aliases.

## Spec style and naming

- Write component specs as readable executable scripts using `cy.get(...)`, shared selectors, and focused local assertion helpers.
- Do not introduce a POM, Action, or Flow layer solely for a component spec. Reuse an existing one only when it already fits and materially improves the test.
- Give every test an Acceptance-Criteria-led name in the form `AC1. should ...`.
- When one test proves more than one criterion, use a clear combined prefix such as `AC1, AC3. should ...`.
- Keep each test focused on one coherent behaviour. Group genuinely different behavioural branches with nested `describe(...)` blocks when that improves readability.
- Split scenarios that require different initial state or have independent failure modes. Do not combine several conditional branches, invalid submission, unsaved-change state, navigation guards, and Cancel confirmation into one large keyboard test.

Example:

```ts
it('AC3. should save the valid selection and request onward navigation', { tags: buildTags() }, () => {
  setupExampleComponent();

  cy.get(ExampleSelectors.option).check();
  cy.get(ExampleSelectors.continueButton).click();

  assertStoredSelection({ option: 'Example' });
  cy.get('@routerNavigate').should('have.been.calledWith', [nextPagePath], {});
});
```

## Jira tags

- Every `it(...)` must own its tag configuration. Do not rely only on tags attached to `describe(...)`.
- Define confirmed work-item and Epic tags once and include them through a local `buildTags(...)` helper. Each test requires exactly one `@JIRA-EPIC` and either `@JIRA-STORY` or `@JIRA-DEFECT`; do not invent identifiers.
- Pass scenario-specific metadata, such as `@JIRA-TEST-KEY`, into `buildTags(...)` when the Jira test key exists. Do not invent a test key or placeholder.
- Preserve any established release or Jira-label tags required by the feature area.

```ts
const STORY_TAG = '@JIRA-STORY:PO-1234';
const EPIC_TAG = '@JIRA-EPIC:PO-1000';
const buildTags = (...tags: string[]): string[] => [...tags, STORY_TAG, EPIC_TAG];

it('AC1. should render the approved choices', { tags: buildTags('@JIRA-TEST-KEY:PO-5678') }, () => {
  // Test steps
});
```

## Selectors and hooks

- Use central selector modules under `cypress/shared/selectors/**` so component and future E2E coverage can share stable hooks.
- Prefer existing semantic application IDs or data attributes. If a stable hook is missing, add it to the Angular component first and then expose it through the relevant selector module.
- Prefer additive selector changes. Do not casually rename selectors shared by other specs.
- Avoid positional selectors, DOM-depth selectors, duplicated raw selector strings, and selectors coupled to incidental styling.
- Import controlled values and types from production constants so setup data does not drift. Assert exact user-facing copy when that copy is part of the Acceptance Criteria.

## Routing and store assertions

- Import route segments from the production routing constants under `src/app/**`; do not duplicate route fragments in Cypress-only constants.
- Compose an expected full path locally when the component contract is the complete URL. A small reusable path helper is appropriate when several scenarios use the same composition.
- Keep router creation or stubbing in the setup helper and navigation assertions in the spec.
- Before using a control shared by the outgoing and destination pages, wait for the destination route and a destination-specific heading.
- When text should change after navigation, use a retrying `.should` assertion. A `.then` snapshot is appropriate only after the required page state is established.
- When a test says that data is saved, assert the real store state rather than inferring success only from navigation.
- Assert relevant lifecycle effects when they are part of the behaviour, such as dirty-state clearing, saved-state flags, stale conditional values being removed, or valid state being rehydrated.
- Before expecting an unsaved-changes confirmation, establish dirty state explicitly and assert it through the real store or component state.
- Prefer mounting saved state and making one representative user change when testing dirty-state navigation. Do not depend on an invalid submission implicitly establishing the dirty-state precondition.

## Mocks and intercepts

- Keep all reusable scenario data beside the feature under `mocks/**`. This includes saved form or store state, expected submitted state, API responses, error responses, and problem-detail bodies, not only HTTP fixtures.
- Name feature-local mock files with the `*.mock.ts` suffix. Do not place large mock objects in specs or setup helpers.
- Keep repeated expected validation and error text under the feature's `constants/**` folder in a suitably named `*.constant.ts` file. Use named properties rather than repeated string literals or positional array indexes.
- Search the parent feature's `mocks/**` and `constants/**` folders before declaring data in a nested spec. Reuse shared feature copy such as error-summary headings and unsaved-change warnings rather than redeclaring it below the feature root.
- Keep reusable intercept wiring under `intercept/**` or `setup/**`.
- Keep intercept helpers focused on request wiring and canned responses. Put request-body, header, call-count, prohibited-request, and navigation assertions in the spec.
- A one-off intercept used by one scenario may remain in that spec when extracting it would hide the behaviour being asserted.
- Narrow negative network assertions to the prohibited endpoint and method. Do not use a catch-all intercept that also captures Cypress, reporting, asset, or unrelated application traffic.
- Reuse existing state, store, and API mocks where they represent the scenario accurately. Setup helpers should import the mocks, seed the requested state, and clone mutable values with `structuredClone(...)` so one test cannot contaminate another.
- Build API and problem-detail fixtures from an implemented contract, an agreed specification, or a maintained application precedent. Include only fields the real boundary supplies; do not invent example URLs, identifiers, permissions, or response properties because an API is unavailable.

## Efficient form setup

- Prefer mounting the component with representative form or store state already populated when the scenario is concerned with rendering, submission, clearing conditional data, network boundaries, accessibility, or reflow.
- Allow the feature setup helper to accept small, typed state overrides instead of populating a large form through the DOM in every scenario.
- Do not populate large forms with repeated `.type()` commands when typing is not the behaviour under test. Do not apply `{ delay: 0 }` as the default workaround; seed the component through its setup helper instead.
- Retain `.type()` only when the scenario needs to prove text entry, input transformation, autocomplete behaviour, validation caused by typing, or a deliberate keyboard interaction.
- Use direct control interactions such as `.check()` and `.select()` only when that interaction or its resulting state is relevant to the scenario.
- Do not seed the same expected state on both sides of a save assertion if that would let the test pass without the submit handler. A submission test must make a relevant UI change or assert an observable submission result that distinguishes successful handling from the initial seed.

## Keyboard interaction and dynamic content

- Use `cy.press(Cypress.Keyboard.Keys.TAB)` to prove native focus movement and `cy.press(Cypress.Keyboard.Keys.SPACE)` to prove checkbox activation. Calling `.focus()` may establish the starting point, but must not replace the keyboard movement being asserted.
- Do not use `.click()` as a substitute when the scenario claims to prove keyboard activation.
- Angular conditional content can be inserted after the key command completes. After revealing a conditional control, wait for the first new control to be visible, assert that the originating control still has focus, then press Tab and assert that focus moves to the revealed control.
- Use element-bound `.type('{enter}')` when a focused button must be activated with Enter and a global `cy.press(ENTER)` does not invoke the button action reliably. This is keyboard activation, not bulk form population.
- For a focused link, prefer `cy.press(Cypress.Keyboard.Keys.ENTER)` and assert the resulting navigation, confirmation, or emitted behaviour.
- Keep keyboard scenarios focused. Prefer separate tests for conditional focus movement, Return or submission behaviour, and Cancel with unsaved changes when those paths need different setup or assertions.

Example for dynamically revealed content:

```ts
cy.get(ExampleSelectors.revealCheckbox).focus();
cy.press(Cypress.Keyboard.Keys.SPACE);
cy.get(ExampleSelectors.revealedInput).should('be.visible');
cy.get(ExampleSelectors.revealCheckbox).should('be.focused');
cy.press(Cypress.Keyboard.Keys.TAB);
cy.get(ExampleSelectors.revealedInput).should('be.focused');
```

## Scenario coverage

Choose applicable scenarios from the approved behaviour rather than applying this list mechanically:

- initial rendering, exact controlled choices, and absence of unintended defaults;
- conditional controls appearing, becoming required, and leaving the keyboard sequence when inapplicable;
- materially different valid branches, including removal of stale conditional data;
- exact inline and summary errors, error-summary focus, and links focusing the associated field;
- rendered behaviour plus store and boundary effects, including rehydration, navigation, and absence of a prohibited request;
- Cancel or secondary navigation when owned by the component;
- keyboard focus order using keyboard events rather than only calling `.focus()` on each control;
- representative Axe scans in valid and validation-error states when accessibility evidence is in scope; and
- viewport or reflow checks at the exact approved boundaries.

A 320 CSS-pixel viewport used as evidence for 400% zoom/reflow must not be reported as general mobile support. Axe and viewport checks are partial evidence; they do not prove complete WCAG 2.2 AA or responsive compliance.

### Grouping validation efficiently

Group fields when they share the same initial state, active branch and submission outcome.
Submit once and assert every expected summary and inline error, its field association,
focus behaviour and relevant saved-state/network effects. Keep different invalid input
classes and mutually exclusive conditional branches separate. A loop creating multiple
tests still performs multiple mounts.

Seed incidental form setup through existing typed feature helpers and cloned synthetic
fixtures. Keep real input and keyboard interactions when they are the behaviour under test.
Every removed test must have an assertion-level mapping to retained coverage; fewer tests
alone is not evidence of improvement. Measure representative before/after spec runs with
the same browser, source conditions, retries and workers, and retain complete raw results.

## Running and verifying tests

Use Yarn 4 through Corepack and the versions declared by the repository.

Component Webpack uses named module IDs to keep references stable as Cypress recompiles changing spec graphs.
Caching remains enabled; preserve the configured isolation and retry policy when comparing runs.
The component path resolver uses the repository root for inherited TypeScript aliases, including fresh-cache runs.

Run a single component spec directly with the Cypress executable:

```bash
corepack yarn exec cypress run --browser chrome --component --spec 'cypress/component/release1b/fineAccountEnquiry/viewAndAmendDefendant/viewAndAmendDefendant.cy.ts'
```

Run the Cypress TypeScript lint and the full or parallel component suite as required by the scope:

```bash
corepack yarn lint:cypress
corepack yarn test:component
corepack yarn test:component:parallel
```

Run `corepack yarn check:jira:test-metadata` for the repository's current Jira metadata policy. Run broader component and unit coverage when shared support, setup helpers, selectors, stores, or application behaviour changed.

Before handoff:

- inspect each changed spec for reusable inline objects, repeated validation or warning text, broad request matchers, and mutable fixtures that are seeded without cloning;
- inspect every `.type()` call and be able to name the input, transformation, validation, or keyboard behaviour it proves; replace setup-only typing with seeded state;
- search explicitly for `{ delay: 0 }` and remove it unless timing itself is the documented behaviour under test;
- confirm nested feature specs reuse applicable parent `mocks/**` and `constants/**` definitions;
- confirm every test owns its Jira tags and every selector uses an existing shared selector unless the selector is deliberately querying a generic semantic contract;
- map each applicable Acceptance Criterion to its test evidence;
- report the exact commands and results;
- distinguish component evidence from unit, E2E, manual, and external verification;
- report warnings, blocked dependencies, and checks not run; and
- apply `docs/FRONTEND_DEFINITION_OF_DONE.md` without claiming human review, QA, CI, deployment, or WCAG completion unless verified.

## Real product defects

- If a component test exposes a real product defect, do not change application behaviour merely to force the test to pass.
- Record the failing scenario and evidence, then fix the product only when that change is within the requested ticket scope.
- Do not report the work as agent-complete while a required test is skipped, pending, or failing.
