# Sonar quality guidance

Use this guide for new or materially changed frontend journeys and when remediating Sonar findings. It supplements
the repository standards in [REPO_GUIDELINES.md](REPO_GUIDELINES.md); the externally configured Sonar analysis is the
definitive source for Quality Gate status.

## Quality gates

- Duplicated lines on New Code must be strictly below 3%.
- Coverage on New Code must meet the shared 80% Quality Gate requirement. Verify the externally configured gate;
  any mismatch is an alignment gap to resolve, not permission to lower the engineering requirement.
- Target 100% meaningful line and condition coverage on New Code before handoff. The configured Quality Gate is a
  minimum, not the completion target. A request for 100% is not satisfied by meeting the gate threshold.
- Overall metrics are improvement signals, not permission to refactor unrelated code.

Meaningful coverage proves observable behaviour and important paths, including business rules, validation, state
transitions, transformations, and error handling. Do not add tests that merely execute lines to improve a metric.

## Preventing maintainability findings

Review the complete changed functions before running checks:

- Keep cognitive complexity at or below 15 per function. Split metadata parsing, validation and value conversion into
  cohesive helpers with explicit inputs and outcomes. Keep rejection rules and error precedence intact. Do not merely
  move branches into another oversized function or replace clear logic with opaque expressions.
- Do not nest ternary expressions, including ternaries inside template literals or constructor arguments. Name the
  intermediate decision or use an early return.
- Use optional chaining for a nullable receiver when it preserves the original guard's behaviour. Check subsequent
  property access remains safe, particularly when both compared values can be absent.
- Use `includes()` for value membership and `some()` for predicates. Keep type narrowing honest; do not cast away a
  potentially absent or invalid value to satisfy the type checker.
- Use concise equivalent regular-expression classes (for example `\w` for `[A-Za-z0-9_]`). Preserve separate leading
  character restrictions and validate accepted and rejected input examples.
- Prefer semantic test assertions such as `expect(collection).toHaveLength(3)` over asserting its numeric `.length`.
- Extract repeated union types into a named domain type alias. Keep reusable aliases in a dedicated `.type.ts` file
  and import them directly wherever the same concept is used.

Passing ESLint does not prove these Sonar rules pass: the tools do not necessarily enable the same rules. Where a
local Sonar-compatible analyser is available, check the changed functions with the configured complexity limit.
Otherwise explicitly record that limitation and inspect the next external analysis before marking findings resolved.
Documentation and manual review supplement automated checks; neither guarantees a clean scan.

## Closing coverage gaps

Inspect both line and branch/condition coverage in a freshly generated report. Zero uncovered lines can still leave
uncovered conditions and a New Code coverage percentage below 100%. Check each affected file rather than relying on
an aggregate rounded percentage.

For every uncovered outcome, identify the behaviour it protects and add an assertion that would fail if that behaviour
regressed. Cover applicable defaults and empty collections, optional inputs, stale selections, missing drafts, rejected
store updates, cancelled navigation, retry paths and error handling. Exercise injectable services through Angular DI
when that is how the application constructs them. Do not call generated framework factories solely for coverage.

If duplicated state makes a branch impossible, first establish and simplify the invariant with regression coverage;
do not remove a protective guard just to remove an uncovered branch. Refactoring must preserve existing behaviour.

After the final edit, regenerate coverage and inspect `coverage/lcov.info` and the HTML report (including conditions).
Compare changed executable lines against the PR's actual base, especially for stacked branches. Record the base,
commands and uncovered line/condition counts. Local whole-file coverage supports the assessment, but does not replace
Sonar's New Code calculation. Recheck the external analysis for the pushed commit; a result for an earlier SHA is stale.

## Stacked pull request analysis

`Jenkinsfile_CNP` fetches the actual PR target (`CHANGE_TARGET`) in a PR-only `before('sonarscan')` hook. The target is
stored as a named remote-tracking ref, and shallow checkouts are expanded before verifying the merge base. This lets
Sonar calculate changed lines when a PR targets another feature branch. The checked-out source commit is preserved.

If a scan reports `Could not find ref`, or reports zero new lines for a PR with executable changes, inspect the Git
checkout before changing coverage settings. Confirm that the target ref and merge base are present in the scanner's
workspace and that the scan matches the current PR head. After a correction, rerun CI and verify that Sonar reports
new executable lines and evaluates the new-code coverage condition. A green gate without those measurements does not
prove that new-code coverage passed. For server-side issue comparisons, keep the target branch analysis current.

## Form identifiers

Use the owning fines journey's established field identifier consistently for the reactive-form key, DOM ID/name,
error-map key, error-summary target, and automated selector. Keep saved domain models independently named and map
between form and domain data at the boundary.

For example, the [Court Details form](../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details-form/fines-mac-court-details-form.component.html)
uses `fm_court_details_prosecutor_case_reference` for its input ID/name and form control. Preserve that alignment when
adding validation or selectors, and follow the owning journey's naming convention for new fields.

## Preventing duplication

Extract repeated domain sections, pure mapping, and cohesive typed parameter objects. Keep GOV.UK markup explicit.
Favour a journey-local extraction over a broad shared abstraction unless there is a stable, demonstrated reuse
boundary.

### Cohesive mapper parameters

Do not pass each address field positionally. Pass one typed address-source object to a pure address mapper so call sites
name every value and changes to the address contract happen once.

### Form-section extraction

When two journey pages repeat a GOV.UK section with the same control order and behaviour, create a journey-local nested
form component. Pass the parent form, errors, typed field names, and section-specific options. Keep validation,
submission, persistence, and navigation in the parent.

## Prohibited shortcuts

Do not change thresholds, add broad exclusions, suppress valid findings, cosmetically reorder code, or add
assertion-free tests. Do not weaken or avoid measurement to make a gate pass; fix the underlying maintainability,
duplication, or behaviour-coverage issue instead. Never game Sonar metrics. Any narrowly justified exclusion or
remaining coverage gap must be recorded in the PR with its affected behaviour or code, risk, rationale, and
alternative verification.

## Verification

Run formatting, lint, unit tests, coverage, component tests, and build locally. Treat the external Sonar scan as
definitive. Follow [CYPRESS_COMPONENT_TESTING.md](CYPRESS_COMPONENT_TESTING.md) for component-test workflow and
execution details.

### Local pre-flight

Run:
`corepack yarn prettier`
`corepack yarn lint:ng`
`corepack yarn lint:cypress`
`corepack yarn test`
`corepack yarn test:coverage`
`corepack yarn test:component`
`corepack yarn build`

Inspect `coverage/index.html` for uncovered behaviour. A local pass does not prove the external Sonar Quality Gate;
record the branch analysis result separately.
