# Implement Change-Aware Cypress Execution in CI

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

There is no `PLANS.md` file in this repository root today, so this plan follows the checked-in skill guidance in `.codex/skills/opal-frontend/opal-frontend-execplan/references/plans.md`.

## Purpose / Big Picture

Today, pull request builds can run the full Cypress functional and component suites even when a change only affects one part of the app. That makes feedback slower as the test estate grows. After this change, CI will automatically detect which functional areas were touched and run only the relevant Cypress suites for that change, while still falling back to full coverage when risk is high or classification is uncertain. You will see this working when a PR touching only one feature (for example `fines-mac`) runs only that feature’s E2E/component specs, and a PR touching shared infrastructure still runs full suites.

## Progress

- [x] (2026-02-18 09:33Z) Analyzed current CI/test wiring in `Jenkinsfile_CNP`, `Jenkinsfile_nightly`, `package.json`, `scripts/run-functional.js`, and Cypress docs.
- [x] (2026-02-18 09:33Z) Drafted a target architecture that reuses existing `TEST_SPECS`/`TAGS` controls instead of replacing them.
- [ ] Implement a change-impact resolver script and mapping config.
- [ ] Integrate resolver output into `Jenkinsfile_CNP` and component/functional scripts.
- [ ] Add tests for the resolver and a dry-run reporting mode.
- [ ] Roll out with a safe observe-first phase, then enforce selective execution.

## Surprises & Discoveries

- Observation: Functional test selection already exists, but only via manual PR labels, not changed-file analysis.
  Evidence: `Jenkinsfile_CNP` `setupTestSpecifications()` sets `env.TEST_SPECS` from labels (`test_mac`, `test_enq`, etc.), defaulting to all specs.

- Observation: Component tests are always full-suite unless explicitly skipped by label.
  Evidence: `Jenkinsfile_CNP` `afterAlways(stageTest)` runs `yarn test:opalComponent` unless `skip_opal_component` is set.

- Observation: Nightly pipeline has toggles for component/smoke/functional but always sets functional specs to all features.
  Evidence: `Jenkinsfile_nightly` sets `env.TEST_SPECS = 'cypress/e2e/functional/opal/**/*.feature'`.

## Decision Log

- Decision: Implement automatic changed-file driven selection in CI as the default path for PR builds, but keep manual labels/tags as explicit overrides.
  Rationale: Existing labels are useful operational controls during incidents and debugging; removing them would reduce operability.
  Date/Author: 2026-02-18 / Codex

- Decision: Keep nightly full coverage unchanged.
  Rationale: Nightly runs are the regression safety net and should remain broad even if PR runs are selective.
  Date/Author: 2026-02-18 / Codex

- Decision: Fail safe to full suites whenever mapping confidence is low.
  Rationale: False negatives (missing tests) are riskier than false positives (extra runtime).
  Date/Author: 2026-02-18 / Codex

- Decision: Keep existing manual PR controls (`test_*`, `run_tag:*`, `skip_opal_component`) as higher-priority overrides than auto-selection.
  Rationale: Confirmed by user; operators need deterministic manual control during triage and targeted verification.
  Date/Author: 2026-02-18 / Codex

- Decision: Treat docs-only changes (`docs/**`, markdown-only updates) as non-functional and skip Cypress functional/component suites by default.
  Rationale: Confirmed by user; these changes do not affect runtime behavior and should not consume functional pipeline time.
  Date/Author: 2026-02-18 / Codex

- Decision: Use `origin/master` as the git diff base for PR change-impact resolution.
  Rationale: Confirmed by user and consistent with existing branch model assumptions in CI.
  Date/Author: 2026-02-18 / Codex

- Decision: Do not treat all `cypress/shared/**` and `cypress/support/**` changes as automatic full-suite triggers; resolve impact by dependency mapping first, and reserve full fallback for truly global files.
  Rationale: These directories change frequently and are structured enough to support targeted selection; full regression should be exception-based.
  Date/Author: 2026-02-18 / Codex

- Decision: Always run a minimum safety-floor smoke subset in PR builds, even when resolver output skips functional/component suites.
  Rationale: Ensures environment, auth, and baseline journey coverage still executes on every PR.
  Date/Author: 2026-02-18 / Codex

- Decision: Build changed-file input from `git diff --name-status` and handle renames/moves explicitly.
  Rationale: Rename-aware detection prevents false ambiguity/fallback and avoids missed mappings during refactors.
  Date/Author: 2026-02-18 / Codex

- Decision: Introduce a resolver confidence threshold; below-threshold selection falls back to full suites.
  Rationale: Makes risk handling deterministic and auditable instead of ad-hoc.
  Date/Author: 2026-02-18 / Codex

- Decision: Track false negatives as a rollout KPI and make enforce-mode contingent on acceptable error rate.
  Rationale: Selection is only safe to enforce when observed misses are demonstrably rare or zero.
  Date/Author: 2026-02-18 / Codex

- Decision: Assign ownership for `test-impact-map` maintenance and require map updates in the same PR when domains/helpers are added or moved.
  Rationale: Prevents mapping drift as the test estate evolves.
  Date/Author: 2026-02-18 / Codex

- Decision: Add a dedicated GitHub label override to force full functional execution (for example `force_full_functional`), with higher priority than automatic resolver output.
  Rationale: Gives reviewers and release managers a fast operational escape hatch without pipeline code changes.
  Date/Author: 2026-02-18 / Codex

- Decision: Track flake-rate impact during observe and enforce phases to ensure selective execution does not mask instability.
  Rationale: Reduced scope can hide intermittently failing tests until nightly runs; this must be measured.
  Date/Author: 2026-02-18 / Codex

- Decision: Preserve downstream CI expectations by emitting consistent report/artifact structure even when suites are skipped.
  Rationale: Jenkins publish/archive steps should remain stable regardless of selected scope.
  Date/Author: 2026-02-18 / Codex

- Decision: Add a CI guard that warns when new app/test domains are present but unmapped in the impact map.
  Rationale: Prevents silent coverage erosion from mapping drift.
  Date/Author: 2026-02-18 / Codex

- Decision: Add contract tests for resolver output keys and value formats consumed by Jenkins.
  Rationale: Prevents integration breakage when resolver internals evolve.
  Date/Author: 2026-02-18 / Codex

- Decision: Make resolver decisions highly visible in PR pipeline logs (and optionally PR summary/comment).
  Rationale: Developers need immediate clarity on why specific suites ran or were skipped.
  Date/Author: 2026-02-18 / Codex

## Outcomes & Retrospective

Initial planning outcome: the repo already has good primitives (`TEST_SPECS`, `TAGS`, parallel weights, modular test folder structure), so the best implementation is to add a deterministic resolver and connect it to those primitives. Main remaining risk is mapping completeness between `src/app` paths and Cypress suites; rollout must include an observe-only phase to tune mappings before strict enforcement.

## Context and Orientation

This repository is an Angular SSR frontend with Jenkins-based CI. Cypress E2E features are under `cypress/e2e/functional/opal/features/**` and Cypress component specs are under `cypress/component/**`. Functional execution is orchestrated by `scripts/run-functional.js` and `package.json` scripts (`test:functionalOpalParallel`, `test:functionalEdgeParallel`, `test:functionalFirefoxParallel`) that already accept the `TEST_SPECS` environment variable. CI behavior is primarily controlled in:

- `Jenkinsfile_CNP` for PR/master pipeline behavior.
- `Jenkinsfile_nightly` for scheduled broad regression runs.
- `package.json` for spec globs and Cypress command wiring.

The app’s functional domains are clearly segmented in both app code and tests:

- Manual account creation: `src/app/flows/fines/fines-mac/**` and `cypress/e2e/functional/opal/features/manualAccountCreation/**`, `cypress/component/manualAccountCreation/**`.
- Account enquiry/search: `src/app/flows/fines/fines-sa/**` and `src/app/flows/fines/fines-acc/**` with `cypress/e2e/functional/opal/features/fineAccountEnquiry/**`, `cypress/component/fineAccountEnquiry/**`.
- Consolidation: `src/app/flows/fines/fines-con/**` with `cypress/e2e/functional/opal/features/consolidation/**`, `cypress/component/fines/consolidation/**`.
- Shared/cross-cutting Cypress layers: `cypress/support/**`, `cypress/shared/**`, `cypress/e2e/functional/opal/actions/**`.

## Plan of Work

Milestone 1 introduces a deterministic resolver that maps changed files to impacted Cypress suites. Add `scripts/resolve-functional-test-scope.js` plus a versioned mapping file `config/test-impact-map.json` (or `scripts/test-impact-map.js` if executable logic is needed). The resolver accepts a changed-file list and returns:

- `RUN_FUNCTIONAL=true|false`
- `RUN_COMPONENT=true|false`
- `TEST_SPECS=<glob(s) for functional>`
- `COMPONENT_SPECS=<glob(s) for component>`
- `SCOPE_REASON=<human-readable reason for selection>`

The resolver algorithm is:

1. Build changed file set from `git diff --name-status <base>...HEAD`.
   In this repository, use `<base>=origin/master` for PR pipelines.
   Treat renames/moves as both old and new paths for mapping purposes.
2. Apply override precedence:
   explicit `run_tag:*` / `test_*` / skip labels / `force_full_functional` label > auto selection.
3. Match changed files to domain rules from impact map.
4. For `cypress/support/**`, `cypress/shared/**`, and `cypress/e2e/functional/opal/actions/**`, resolve impact using a dependency graph:
   changed helper/support/action file -> importing step definitions/actions/flows/specs -> impacted feature/component spec globs.
5. If file belongs to a short allowlist of truly global-risk files (for example `cypress.config.ts`, `package.json`, core Cypress bootstrap files, Jenkinsfiles), force full suites.
6. If no functional paths changed, set `RUN_FUNCTIONAL=false` and/or `RUN_COMPONENT=false` as appropriate.
   For docs-only or markdown-only PRs, skip both by default.
7. Compute selection confidence (for example resolved_changed_files / total_changed_files).
8. If confidence is below threshold (for example `<0.90`) or unresolved files exceed threshold (for example `>2`), force full suites and log why.
9. Independently of resolver output, run a minimum PR smoke floor (small fixed set of smoke scenarios).
10. If classification is ambiguous, force full suites and log why.

Milestone 2 wires resolver output into CI and scripts. In `Jenkinsfile_CNP`, run resolver after checkout and before test stages, export its output to environment variables, and use those variables when invoking Cypress commands. Include label handling so `force_full_functional` bypasses targeted selection. Update `package.json` scripts so component test command uses a variableized spec glob with safe default:

    COMPONENT_SPECS=${COMPONENT_SPECS:-cypress/component/**/**.cy.ts}

and functional default stays:

    TEST_SPECS=${TEST_SPECS:-cypress/e2e/functional/opal/**/*.feature}

Keep nightly behavior unchanged in `Jenkinsfile_nightly` except for optional logging of what resolver would have selected (informational only).

Milestone 3 adds confidence and rollout controls. Add automated tests for resolver mapping cases (positive, dependency-mapped support/shared change, rename/move handling, global-fallback, below-threshold confidence fallback, ambiguous-fallback, no-functional-change). Add an `observe-only` flag in CI that logs selected subsets while still running full suites. Track false negatives explicitly: cases where selected run passes but full run fails due to tests outside selected scope. Track flake-rate trends for selected versus full runs. Only switch PR pipeline to enforce subset execution after at least two weeks of observe-mode data with acceptable false-negative rate (target zero). Keep a manual override (`FORCE_FULL_FUNCTIONAL=true` or `force_full_functional` label) for incident response.

Milestone 4 operationalizes ownership, contracts, and drift prevention. Define ownership for `config/test-impact-map.json` (or equivalent mapping source), add CODEOWNERS coverage if available, and add a PR rule: any new functional domain, renamed folder, or shared helper path change that affects mapping must include corresponding map updates and resolver test updates in the same pull request. Add a guard check that warns/fails when new candidate domain paths are detected without mapping coverage. Add contract tests for resolver output (`RUN_FUNCTIONAL`, `RUN_COMPONENT`, `TEST_SPECS`, `COMPONENT_SPECS`, `SCOPE_REASON`, confidence fields) to keep Jenkins integration stable.

## Concrete Steps

Run from repository root `/Users/cadefaulkner/opal/opal-frontend`.

1. Create resolver and map.

    yarn node scripts/resolve-functional-test-scope.js --base origin/master --head HEAD --write-env .ci/test-scope.env

   Expected output excerpt:

    Changed files: 7
    Selection mode: targeted
    Functional specs: cypress/e2e/functional/opal/features/manualAccountCreation/**/*.feature
    Component specs: cypress/component/manualAccountCreation/**/*.cy.ts
    Reason: matched src/app/flows/fines/fines-mac/**
    Confidence: 1.00 (7/7 changed files resolved)

2. Source the generated environment in Jenkins stage and print decisions.

    set -a
    . .ci/test-scope.env
    set +a
    echo "$RUN_FUNCTIONAL $RUN_COMPONENT $TEST_SPECS $COMPONENT_SPECS"

   Include forced-full visibility when override label/env is present:

    echo "FORCE_FULL_FUNCTIONAL=${FORCE_FULL_FUNCTIONAL:-false}"
    echo "FORCE_FULL_FUNCTIONAL_LABEL=${FORCE_FULL_FUNCTIONAL_LABEL:-false}"

3. Execute minimum smoke floor in every PR build.

    yarn test:smoke

4. Execute only selected suites in PR pipeline when enabled.

    yarn test:functional
    yarn test:opalComponent

5. Add resolver tests and run them.

    yarn vitest scripts/resolve-functional-test-scope.spec.ts --run

6. During observe-only rollout, compare selected subset versus full run outcomes in CI logs and publish mismatch, false-negative, and flake-rate trend metrics.

## Validation and Acceptance

Acceptance is behavioral and must be verified in CI:

- PR touching only `src/app/flows/fines/fines-mac/**` runs only manual-account-creation functional features and manual-account-creation component specs; pipeline duration is materially lower than full-suite baseline.
- PR touching non-global files under `cypress/shared/**` or `cypress/support/**` runs only dependent functional/component subsets when dependency mapping is conclusive.
- PR touching true global-risk paths (`cypress.config.ts`, Cypress bootstrap files, routing core, Jenkinsfiles) runs full functional and component suites.
- PR touching docs-only files (`docs/**`, markdown-only updates) skips functional/component suites unless forced.
- Every PR still runs a minimum smoke floor regardless of resolver decision.
- Nightly pipeline still runs full regression based on existing booleans and remains unchanged in coverage.
- Manual labels/tags still override automatic selection when explicitly provided.
- Applying GitHub label `force_full_functional` forces full functional execution regardless of resolver output.
- Renamed/moved files are classified correctly and do not silently reduce coverage due to path-change ambiguity.
- Enforce mode is only enabled after observe-mode KPI evidence shows acceptable false-negative rate (target zero).
- Skipped suites still leave expected artifact/report structure so archive/publish steps do not fail.
- Resolver output contract tests pass and Jenkins consumes all required keys.
- CI warns (or fails, per policy) when new feature/domain folders are introduced without corresponding impact-map entries.

Validation commands for implementer:

    yarn lint
    yarn test
    yarn test:functional:tags

and at least one PR dry run where resolver output is visible in Jenkins logs.

## Idempotence and Recovery

The resolver is idempotent: running it multiple times on the same commit range must produce the same env file. If resolver execution fails for any reason, Jenkins should default to full functional and component suites (safe fallback). Recovery path is immediate by setting `FORCE_FULL_FUNCTIONAL=true` (or equivalent label) to bypass selection while fixes are applied. No destructive migrations are required.

## Artifacts and Notes

Use these CI artifacts/log lines as evidence:

- Resolver decision log (changed files, matched rules, fallback reason).
- Exported `.ci/test-scope.env`.
- Jenkins console lines showing selected `TEST_SPECS` and `COMPONENT_SPECS`.
- Runtime comparison report between observe-only mode and enforced mode.
- False-negative KPI report with per-build trend (selected-vs-full comparison).
- Flake-rate trend report comparing selected-scope executions with full-suite baseline.
- Resolver decision summary artifact/log block showing matched domains, unresolved paths, confidence, and force-full override status.

Current anchor points from repository analysis:

- `Jenkinsfile_CNP` contains manual functional selection (`setupTestSpecifications`) and always-on component run.
- `Jenkinsfile_nightly` currently pins full functional scope.
- `package.json` functional scripts already consume `$TEST_SPECS`; component scripts need equivalent parameterization.
- `scripts/run-functional.js` is the correct single orchestration point for functional command behavior.

## Interfaces and Dependencies

Define the following script contract in `scripts/resolve-functional-test-scope.js`:

    type ScopeOutput = {
      runFunctional: boolean;
      runComponent: boolean;
      testSpecs: string;
      componentSpecs: string;
      reason: string;
      matchedDomains: string[];
    };

CLI contract:

    node scripts/resolve-functional-test-scope.js \
      --base <git-ref> \
      --head <git-ref> \
      --write-env <path> \
      [--mode observe|enforce]

Dependencies should stay minimal and use existing Node runtime. Prefer built-in modules (`node:fs`, `node:child_process`, `node:path`) to avoid new packages. Impact map should be repository-owned, reviewable, and versioned with code changes.

Resolver output should include confidence telemetry fields for CI/reporting, for example:

    resolvedCount: number;
    changedCount: number;
    confidence: number;
    unresolvedPaths: string[];

The resolver should also emit override telemetry fields:

    forceFullFunctionalEnv: boolean;
    forceFullFunctionalLabel: boolean;

Initial domain mapping to encode:

- `src/app/flows/fines/fines-mac/**` -> `cypress/e2e/functional/opal/features/manualAccountCreation/**/*.feature` and `cypress/component/manualAccountCreation/**/*.cy.ts`
- `src/app/flows/fines/fines-sa/**` or `src/app/flows/fines/fines-acc/**` -> `cypress/e2e/functional/opal/features/fineAccountEnquiry/**/*.feature` and `cypress/component/fineAccountEnquiry/**/*.cy.ts`
- `src/app/flows/fines/fines-con/**` -> `cypress/e2e/functional/opal/features/consolidation/**/*.feature` and `cypress/component/fines/consolidation/**/*.cy.ts`
- `src/app/pages/dashboard/**` -> `cypress/component/pages/Dashboard/**/*.cy.ts` (and full functional only if no narrow E2E coverage exists)
- `cypress.config.ts`, `package.json`, `Jenkinsfile_*`, `cypress/support/e2e.ts`, `cypress/support/component.ts` -> full functional + full component
- `cypress/shared/**`, `cypress/support/step_definitions/**`, `cypress/e2e/functional/opal/actions/**` -> dependency-mapped subsets first, full fallback only on unresolved/ambiguous impact

Revision note: Created this initial ExecPlan to move from full-suite Cypress execution on every build to change-aware functional/component execution while preserving safety fallbacks and nightly full regression coverage.

Revision note (2026-02-18): Updated plan to include five implementation safeguards requested during review: mandatory PR smoke safety floor, rename-aware diffing via `--name-status`, confidence-threshold fallback rules, false-negative KPI rollout gate, and explicit ownership/update policy for the impact map.

Revision note (2026-02-18): Extended the plan with additional operational safeguards: explicit GitHub label override (`force_full_functional`), flake-rate monitoring, artifact/report consistency requirements for skipped suites, mapping-drift detection for new domains, resolver output contract testing, and higher visibility of resolver decisions in PR pipeline output.
