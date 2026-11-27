# Extended test runs

Use `@extendedTest` for functional scenarios or Cypress component tests that should run on demand and overnight.
Keep required regression coverage in the default suites. For release folders, feature-flag states, and
release-specific commands, see [Cypress release selection](CYPRESS_RELEASE_SELECTION.md).

Keep this policy guide in sync between `opal-frontend` and `opal-rm-frontend`. Each repository maintains its own
release selection guide.

## When extended tests run

| Run                                               | Selected extended tests |
| ------------------------------------------------- | ----------------------- |
| PR pipeline without the `extendedTests` label     | Excluded                |
| PR pipeline with the `extendedTests` label        | Included                |
| Master pipeline                                   | Excluded                |
| Scheduled or manually started nightly pipeline    | Included                |
| Local package scripts or direct Cypress execution | Included by default     |

The policy applies to functional and component tests. Existing release, Jira, spec, and skip selection still
applies. Smoke selection follows the repository's existing rules.

## Tagging tests

Add `@extendedTest` alongside existing release and Jira tags. Tag the smallest appropriate scope. A feature tag
applies to every scenario and example in that file. Component tests keep their own Jira metadata.

```gherkin
@extendedTest
Scenario: An extended journey
  # Existing steps
```

```ts
it('checks an extended case', { tags: [...existingTags, '@extendedTest'] }, () => {
  // Existing test steps
});
```

## Running extended tests

Add the exact GitHub label `extendedTests` and rerun the PR pipeline to include extended tests in the selected
suites. For a manual Jenkins run, use the nightly job's **Build with Parameters** and select the applicable
component or functional suites and browser.

Run only extended tests locally with the shared package runner:

```sh
corepack yarn test:component --expose=grepTags=@extendedTest
TAGS='@extendedTest and not @skip' corepack yarn test:functional:tags
```

Supply the existing local test environment and the matching feature-flag state. To reproduce the pipeline
exclusion locally:

```sh
EXCLUDE_EXTENDED_TESTS=true corepack yarn test:component
EXCLUDE_EXTENDED_TESTS=true corepack yarn test:functional
```

Direct `cypress run` and `cypress open` use their own selectors and ignore the pipeline exclusion flag.

## Enforcement and verification

CNP sets `EXCLUDE_EXTENDED_TESTS=true` except on PRs carrying the opt-in label. Nightly sets it to `false`.
The shared Cypress runner passes a private marker for functional or component runs that request exclusion.
Both Cypress setup callbacks apply the shared selection helper before their filtering plugins register.

The helper adds the exclusion to the resolved selectors. For E2E it intersects the existing Cucumber
expression with `not @extendedTest`. For components it adds the global grep exclusion `--@extendedTest`.

Run the pipeline and configuration checks with:

```sh
corepack yarn exec node --import tsx --test scripts/extended-test-selection.test.ts
```

When changing the policy, verify inclusion and exclusion for an existing selector on each test type. Check
that direct execution and smoke keep their existing selection, and record live Jenkins results for changes
to the pipeline hooks.
