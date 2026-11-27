# Cypress release selection

Use this guide to choose the release folder, tags, and runner for OPAL Frontend tests. For on-demand and nightly coverage, see [Extended test runs](EXTENDED_TEST_RUNS.md).

## Release folder rules

- Keep release-specific feature files under the matching release folder.
- `features/release1a/**` should contain only `@R1A`, `@R1AOff`, `@R1A1_1`, `@R1A1_1Off`, `@R1A1_2`, `@R1A1_2Off`, `@R1A1_3`, or `@R1A1_3Off` scenarios and examples.
- `features/release1b/**` should contain only `@R1BDrop1`, `@R1BDrop2`, `@R1BDrop3`, `@R1BDrop1UatTechJCDE`, `@R1BDrop1UatTechPreprod`, `@R1BDrop2UatTechJCDE`, `@R1BDrop2UatTechPreprod`, `@R1BDrop3UatTechJCDE`, `@R1BDrop3UatTechPreprod`, or `@R1BOff` scenarios and examples.
- `features/release1c/**` should contain only `@R1C...` scenarios and examples.
- When a feature file mixes release tags, split the scenarios into separate release-specific files rather than keeping cross-release examples in one file.

## Running release suites

Use the release scripts in [package.json](../package.json) and the [README](../README.md#release-scoped-runners). Run enabled and disabled tests against the corresponding feature-flag state. A release or tag selector chooses tests for the environment, while feature flags are configured separately.

### R1B Drop 3 UAT Technical selection

Use `@R1BDrop3UatTechJCDE` and `@R1BDrop3UatTechPreprod` for R1B Drop 3 legacy examples that should run only through explicit UAT Technical selection. Both tags are excluded from default CNP functional runs and the standard nightly functional, legacy, and R1A/R1B demo suites.

In nightly, enable `RunUatTech` and select `UAT_TECHNICAL_SUITE=R1BDrop3`. `LEGACY_URL` selects the JCDE (`DEV`) or pre-prod examples. The existing R1A/R1B suite choices do not include R1B Drop 3 examples.

For local runs, use `yarn test:functional:uat_legacy_r1b_drop3_jcde` or `yarn test:functional:uat_legacy_r1b_drop3_preprod`. For a CNP PR run, use `enable_legacy_mode` with `run_tag:@R1BDrop3UatTechJCDE`; the JCDE override is enabled automatically for that tag.
