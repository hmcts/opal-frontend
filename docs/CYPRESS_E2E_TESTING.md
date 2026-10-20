# Cypress E2E Testing

Use this guide when writing or updating Cypress E2E tests and Cucumber feature files in opal-frontend.

## Required References

Read this guide's Feature Layout and Tags, Accessibility Coverage, Step Definitions, Actions, Flows, and Selectors,
and execution sections together with [AGENTS.md](../AGENTS.md), [REPO_GUIDELINES.md](REPO_GUIDELINES.md),
[SONAR.md](SONAR.md), and [CONTRIBUTING.md](CONTRIBUTING.md). These repository-contained rules are authoritative and require no installed skills.

## Feature Layout and Tags

- Preferred home is `cypress/e2e/functional/opal`.
- Feature files live under capability folders (for example, `features/release1a/manualAccountCreation/**`, `features/release1b/fineAccountEnquiry/**`).
- Tag scenarios with `@functional`, `@smoke`, and Jira IDs so suites can target subsets.
- New scenarios belong in the `opal` layout. The historical `Old_functional_E2E_Tests` path remains excluded by Cypress; do not recreate it for new coverage.

### Release Folder Rules

- Keep release-specific feature files under the matching release folder.
- `features/release1a/**` should contain only `@R1A`, `@R1AOff`, `@R1A1_1`, `@R1A1_1Off`, `@R1A1_2`, or `@R1A1_2Off` scenarios and examples.
- `features/release1b/**` should contain only `@R1BDrop1`, `@R1BDrop2`, `@R1BDrop1UatTechJCDE`, `@R1BDrop1UatTechPreprod`, `@R1BDrop2UatTechJCDE`, `@R1BDrop2UatTechPreprod`, or `@R1BOff` scenarios and examples.
- `features/release1c/**` should contain only `@R1C...` scenarios and examples.
- When a feature file mixes release tags, split the scenarios into separate release-specific files rather than keeping cross-release examples in one file.

### Journey-Based Organisation

- Keep each feature file focused on one user journey or closely related behaviour. Do not combine unrelated account types or user journeys solely because they use the same screen.
- For account enquiry coverage, group scenarios by the account journey where practical, such as adult/youth defendant, parent/guardian-to-pay defendant, company defendant, minor creditor, and major creditor.
- Keep scenarios that intentionally exercise more than one journey in a clearly named shared feature rather than assigning them to one journey arbitrarily.
- Keep search-form validation, shared state behaviour, business-unit filters, and feature-toggle coverage separate from end-to-end journey features unless the scenario is specifically proving that journey.

For example, Release 1B Search and Matches journeys are organised as:

```
cypress/e2e/functional/opal/features/release1b/searchAndMatches/
  defendant/adult-youth/
  defendant/company/
  defendant/shared/
  minor-creditor/
  legacy-data/
```

### Legacy Data Scenarios

- Keep scenarios tagged `@LegacyData` together in a dedicated `legacy-data` feature file within the relevant capability.
- Retain the `@skip` and `@LegacyData` tags until the required seeded data is available.
- `@LegacyData` scenarios remain under `functional/opal`; they are distinct from the historical excluded legacy-suite path.

### Feature File Size and Execution

- Cypress executes and schedules work at the feature-file level. Split large, mixed feature files into focused journey files when doing so preserves clear behaviour boundaries.
- Focused feature files make test intent easier to locate and allow the execution environment to distribute independent journeys across workers more effectively.
- Do not split a feature merely by scenario count. Keep setup, assertions, and business intent coherent, and preserve scenario content when performing a structural reorganisation.

## Accessibility Coverage

- Accessibility specs live alongside features and should navigate to each page, inject `axe-core`, run scans, and assert no violations.
- When a new page or view is added to a feature, add or update its accessibility spec.

## Step Definitions

- Step definitions in `cypress/support/step_definitions/**` must be thin shims.
- Each Given, When, Then should delegate to a single Action or Flow method.
- Shared DB or setup logic belongs in `databaseSteps` or `support/utils`, not in steps.

## Actions, Flows, and Selectors

- Actions in `cypress/e2e/functional/opal/actions/**` wrap interactions, API stubs, and navigation using selectors from `cypress/shared/selectors/**`.
- Flows in `cypress/e2e/functional/opal/flows/**` compose actions into business journeys and are the verbs exposed to steps. Component specs use the direct script/helper style in the component-testing guide.
- Selectors are centralized. Add hooks in Angular templates and document them in `cypress/shared/selectors/**`. Avoid positional CSS.

## Reusing feature-file steps

Apply this sequence when adding or modifying steps; existing unrelated features do not need a rewrite.
Component specs retain their direct script/helper style.

1. Search the step catalogue/source, Flows and Actions for the process and its synonyms. Start with the shared
   [authentication](../cypress/support/step_definitions/auth.steps.ts),
   [accessibility](../cypress/support/step_definitions/accessibility/accessibility.steps.ts) and
   [common assertions](../cypress/support/step_definitions/common.steps.ts).
2. Reuse an existing phrase when its preconditions, interaction and observable outcome match. Common heading, text
   and URL phrases already accept business values; do not add a feature-specific equivalent. Preserve business
   assertions that also check retained data, permissions, store state or API requests.
3. Parameterise varying business values with constrained expressions or validated DataTables. Reject unknown choices
   and columns rather than silently ignoring them. Keep scenario-specific input visible when it matters to the AC.
4. Share an existing Action/Flow when similar steps have different business intent. Add a phrase only for a different
   responsibility or outcome. Keep reuse local to the capability until multiple maintained capabilities need it.
5. Keep one delegate per binding. Flows own business orchestration and table interpretation; Actions own UI, network
   and confirmation details. Keep selectors out of Gherkin and do not infer page context from an available element.
   When changing a shared common assertion, move its existing body unchanged into a CommonActions method, retaining
   its logging, match strictness, selector and timeout; leave untouched assertions alone.
6. Before removing a binding, migrate every caller and check for undefined or ambiguous matches across the loaded
   registry. Cucumber matches text across Given/When/Then, so changing a keyword does not prevent ambiguity. Preserve
   scenario names, tags, Examples rows, Zephyr identity and independent setup.
7. Run browser journeys for every affected caller group and compare expanded scenario names, counts and tags before
   and after. Keep live and controlled data sources and keyboard interactions intact. Fewer bindings do not mean
   fewer tests or faster execution. Discovery/dry runs prove selection and binding only.

For changes to shared bindings, inventory every functional, accessibility, and smoke caller group. Compare selection
and run actual affected browser journeys before and after, using their configured prerequisites; do not substitute
mocks for unavailable live data. Preserve keyboard, confirmation, retained-state and no-write assertions.
Also run `corepack yarn lint:cypress`, `corepack yarn exec tsc --project e2e.tsconfig.json --noEmit`,
`corepack yarn check:jira:test-metadata`, and `corepack yarn find:duplicate:scenarios`.
Search all Cypress callers for removed phrases. Duplicate-scenario scanning supplements discovery; it does not prove
expression unambiguity. Preserve raw evidence before a runner resets its outputs.

### Keeping regression growth proportionate

Use component tests for exhaustive form-state rendering and validation, and retain E2E
coverage for complete journeys and meaningful integration boundaries. Before removing an
apparently duplicated scenario, map its assertions, data source, tags and external identity
to retained coverage. Mocked responses and live-service evidence are different contracts.

Reuse existing Steps, Flows and Actions, while giving each scenario independent mutable
state. Use focused spec/Story selections for development feedback without reducing required
full regressions. Report expanded examples, failures, retries, missing cases and wall time;
a successful runner exit alone does not prove a complete passing suite.

## Running a feature and accessibility checks

Run an existing accessibility feature through the configured runner:

```bash
corepack yarn test:functional:serial --browser=chrome --spec 'cypress/e2e/functional/opal/features/release1b/searchAndMatches/searchAndMatchesAccessibility.feature'
```

Select other functional, accessibility, release-on/off, or smoke scenarios with the existing scripts in `package.json`
and release configuration documented in the README. Preserve their tag selection. Supply the configured test target
and authorised test accounts through the existing environment; never put credentials in documentation or evidence.
Record browser version, safe environment alias, command, selected/expanded scenario count, passes, failures, retries,
and skipped or pending cases. Zero executed scenarios or a successful discovery run is not passing browser evidence.

`test:a11y` and `pa11y` only print a message. They do not validate accessibility. Run the relevant accessibility features
and component checks; Axe is partial evidence, supplemented by keyboard/focus, screen-reader and native-browser checks
where applicable. Do not claim full WCAG 2.2 AA compliance from automated scans alone.

Every covered functional scenario requires exactly one `@JIRA-EPIC` and at least one `@JIRA-STORY`, `@JIRA-NFR`, or
`@JIRA-DEFECT`. Run `corepack yarn check:jira:test-metadata`; smoke and the configured dummy-feature exemption retain
their existing policy. Preserve Zephyr identities and do not invent tags to make the check pass.

## Confirmation and native leave-site dialogs

Application `window.confirm` and a browser's native `beforeunload` prompt are different boundaries. For application
confirmation tests, register the handler before triggering the action, assert its warning and invocation, and verify
the resulting route and retained state. A handler that was never called must not allow a false pass. Clean Cancel
paths must assert that no confirmation occurs. Keep native leave-site verification separate; `window:confirm` does
not prove native Leave/Cancel behaviour, and clearing `onbeforeunload` does not remove registered event listeners.

Cypress-launched Chromium browsers disable `DeprecateUnload` so Cypress can clean up and reinstall its window handlers
across navigation. Existing launch flags are preserved. Fully relaunch the browser after changing launch settings;
reassess this compatibility setting on a Cypress upgrade. Production confirmation and guard behaviour is unchanged.
Do not introduce global unload suppression into component tests or claim that suppressed native prompts were tested.

## Handling real product defects

- Record the failing scenario and evidence. Fix application behaviour only when that change is within the requested scope.
- Do not weaken assertions or skip required coverage merely to obtain a passing run.
- Report unavailable live prerequisites and required skipped, pending, or failing tests as incomplete verification.
- Apply the frontend Definition of Done; never claim agent completion while an applicable required check remains unmet.
