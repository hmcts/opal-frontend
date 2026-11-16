# Extended test runs

`@extendedTest` marks functional scenarios or component tests that should run on demand and overnight, while staying out of unlabelled PR and master pipeline executions.

## Pipeline execution

| Run | Entry point | Component selection | Functional selection | Extended tests |
| --- | --- | --- | --- | --- |
| PR / dev environment without `extendedTests` | `Jenkinsfile_CNP` / shared `withPipeline` | `test:component` after the test stage, unless `skip_opal_component` or a release selector skips it | Shared dev functional stage; default tags, `run_tag:<expression>` or `run_release:<suite>`; optional folder labels | Excluded |
| PR with `extendedTests` | `Jenkinsfile_CNP` / shared `withPipeline` | Same component hook and selectors | Same functional selection and selectors | Included in selected suites |
| Master / staging environment | `Jenkinsfile_CNP` / shared `withPipeline` | Same component hook | Shared staging functional stage; all functional folders by default | Excluded |
| Scheduled nightly | `Jenkinsfile_nightly` / shared `withNightlyPipeline` | `Component` enabled by default; `test:component` | `Functional` enabled by default; `test:functional` against staging | Included in selected suites |
| Manually started nightly job | Same nightly entry point | Choose `Component` | Choose `Functional`, or the existing release / legacy selections | Included in selected suites |
| Local manual run | Package scripts / shared Cypress runner | `test:component` | `test:functional` or `test:functional:tags` | Included in selected suites |
| Direct Cypress run | `cypress open` / `cypress run` | Existing component config and grep selections | Existing Cucumber selections | Included, even when `EXCLUDE_EXTENDED_TESTS=true` |

These are the paths visible in this repository. The Infrastructure Jenkins library owns the underlying dev/staging stage orchestration; live Jenkins configuration and build history were not inspected.

Before this change, neither Jenkinsfile treated `@extendedTest` specially. CNP already sets functional `TAGS` / `CYPRESS_TAGS`, supports release and tag labels, and selects functional folders using `TEST_SPECS`. Functional defaults exclude `@skip`, UAT-Technical suites and selected feature-flag-off scenarios. Component tests use `@cypress/grep`, registered by the component support file. Browser selection and parallel execution are handled by the shared `@hmcts/opal-frontend-common-cypress` runner; component execution is serial by default and uses three workers when parallel execution is requested. Existing reports and parallel weights are reused by both jobs.

The nightly schedule is `H 07 * * 1-5`: weekdays during the 07:00 hour in the Jenkins scheduler's timezone. Component, Smoke and Functional default to enabled. Release/legacy suites remain controlled by their existing parameters; the extended tag does not override those selections or `@skip`.

## Tagging tests

Add `@extendedTest` alongside existing Jira and release tags. Keep all required metadata.

For a functional scenario, put the tag immediately above the scenario or scenario outline. A feature-level tag applies to every scenario in that feature.

```gherkin
@extendedTest
Scenario: An extended journey
  # Existing steps
```

For component tests, add the tag to the existing options array:

```ts
it('checks an extended case', { tags: [...existingTags, '@extendedTest'] }, () => {
  // Existing test steps
});
```

A `describe` block can carry the same tag in its options to mark every nested test. Choose the smallest appropriate scope. This change tags five account-details page-change performance component tests and ten manual account creation page feature files. Feature-level tags apply to every scenario and example in those files.

## Manual execution

Developers and testers can start the existing nightly Jenkins job with **Build with Parameters**, select **Component** and/or **Functional**, and choose the existing browser and suite options. This includes extended tests without needing a PR label. To include extended tests in a PR pipeline, add the GitHub label **`extendedTests`** and rerun the pipeline. The label includes extended tests alongside ordinary tests in both component and functional suites, while preserving existing release, tag, folder and skip selectors. Removing the label restores the default exclusion on the next run. Master CNP runs continue to exclude extended tests.

Local runs also include extended tests by default:

```sh
corepack yarn test:component
corepack yarn test:functional
```

To run only extended tests locally:

```sh
corepack yarn test:component --expose=grepTags=@extendedTest
TAGS='@extendedTest and not @skip' corepack yarn test:functional:tags
```

Supply the usual local test environment and credentials through the existing secure configuration. Add release tags to these expressions when a particular release or feature-flag state is required.

Direct `cypress open` and `cypress run` commands always include extended tests unless an explicit user selector or skip excludes them. They do not interpret `EXCLUDE_EXTENDED_TESTS`.

To reproduce the PR/master exclusion locally, use the shared runner through package scripts:

```sh
EXCLUDE_EXTENDED_TESTS=true corepack yarn test:component
EXCLUDE_EXTENDED_TESTS=true corepack yarn test:functional
```

## Enforcement and validation

CNP sets `EXCLUDE_EXTENDED_TESTS=true` by default. A PR carrying the exact GitHub label `extendedTests` sets it to `false`; the opt-in requires a PR, so master runs keep excluding extended tests. Nightly explicitly sets it to `false`.

The shared `@hmcts/opal-frontend-common-cypress` runner passes a private CLI marker when launching a serial Cypress child. Parallel scheduling passes the original selection and exclusion flag to the runner-backed leaf scripts. The library `applyExtendedTestSelection(config)` helper is called at the start of both frontend `setupNodeEvents` callbacks, before filtering plugins register. It composes the policy with Cypress’s resolved selectors, including selectors defined in the consumer config. The runner does not modify the calling shell.

Functional selection becomes `(<existing expression>) and not @extendedTest`, respecting explicit CLI tag selection over environment defaults. Component selection adds the global grep exclusion `--@extendedTest` through the resolved Cypress `expose` settings, preserving existing OR branches and unrelated options. Component spec prefiltering is disabled for this negative filter; browser filtering handles inherited and dynamically built tags, and filtered tests are omitted from reports. Smoke-suite selection is unchanged.

The frontend hook only acts on the private runner marker and removes it after applying the policy. It never reads `EXCLUDE_EXTENDED_TESTS` directly, so direct Cypress commands continue to include extended tests even if the pipeline flag is present. Later CLI selector aliases and explicit empty overrides win; both functional selector spellings are rewritten to prevent an inherited alias bypassing the policy. Component filtering requires the existing `@cypress/grep` v6 registration in the component support file.

Run the frontend pipeline/config checks with:

```sh
corepack yarn exec node --import tsx --test scripts/extended-test-selection.test.ts
```

Run runner regression tests and type checks in `opal-frontend-common-cypress-lib` with `corepack yarn test` and `corepack yarn typecheck`. They cover tag precedence, OR expressions, option preservation, local/nightly inclusion, exclusion in CI, parent-environment isolation, and parallel-to-serial handoff. Live Jenkins execution is still needed to verify shared infrastructure stage orchestration end to end.

### Verification completed

- Shared library: 34 regression tests passed, covering runner preparation and resolved-config application; type checks, build, and package-shape validation passed.
- Frontend: 2 pipeline/config checks and both Cypress/scripts TypeScript checks passed.
- Nine Chrome fixture checks passed with configured release selectors: direct functional execution included both selected cases with the exclusion flag present; runner exclusion retained only the ordinary selected case; opted-in inclusion kept both. Later lowercase aliases and empty overrides selected the intended suites. Component-style grep fixtures likewise preserved configured selectors and included extended, inherited and dynamically built tags in direct runs, while runner-marker filtering excluded them and honoured later/empty CLI aliases.
- Full component runs passed with 1,677 tests normally and 1,672 with exclusion enabled. The affected account-details spec was separately verified at 26 tests normally and 21 with exclusion. The first full comparison contained a zero-test finance spec; a subsequent full run and standalone check executed its 11 ordinary tests.
- Functional validation used isolated policy fixtures; the full functional suite and live Jenkins jobs were not executed.

## Published library integration

The frontend now consumes published `@hmcts/opal-frontend-common-cypress` version **0.0.5** from npm. `package.json` and `yarn.lock` no longer depend on a sibling local tarball, so Jenkins can install the same version.

The installed filtering module and public exports were checked against the validated local library build and match. Version 0.0.5 includes the resolved-config helper and alias fixes missing from published 0.0.4. Both frontend `setupNodeEvents` callbacks call the exported helper before registering filtering plugins.

For future library development, build and pack `opal-frontend-common-cypress-lib`, then use the existing local-package workflow for integration testing. Switch back to a published version before submitting frontend changes for Jenkins.
