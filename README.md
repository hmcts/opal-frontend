# OPAL Frontend

This is an [Angular SSR](https://angular.dev/guide/ssr) application. There are two main reasons for this:

- the web server for when the app is deployed in Kubernetes.

- to proxy API requests to internally-facing backend API services, such as the [opal-fines-service](https://github.com/hmcts/opal-fines-service).

## Contents

- [Getting Started](#getting-started)
- [Shared Codex Skills](#shared-codex-skills)
- [Local Development Strategy](#local-development-strategy)
- [Production Server](#5-production-server)
- [Running Unit Tests](#running-unit-tests)
- [Running End-to-End Tests](#running-end-to-end-tests)
- [Accessibility Tests](#running-accessibility-tests)
- [Switching Between Local and Published Common Libraries](#switching-between-local-and-published-common-libraries)
- [OpenAPI reference models](#openapi-reference-models)
- [OpenAPI docs](#openapi-docs)

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) `^20.19.0` or `^22.12.0` or `>=24.0.0` (use `.nvmrc`, currently `24.13.0`).

- [yarn](https://yarnpkg.com/) v4

- [Docker](https://www.docker.com)

### Install Dependencies

Install dependencies by executing the following command:

```bash

yarn

```

### Shared Codex Skills

Shared Codex skills for Opal frontend work live in the sibling `opal-dev-agent-skills` repository. After cloning or updating this repository, run:

```bash
cd ../opal-dev-agent-skills
./scripts/frontend/sync-codex-skills.sh
```

This pulls the latest shared skills and installs Codex-only symlinks for the shared `frontend` and `general` skill folders into `.codex/skills/` for both `opal-frontend` and `opal-rm-frontend`, including `opal-frontend-vitest-guard` for Angular/Vitest unit-test work. The `.codex/skills/` directory is gitignored so developers can also keep local-only skills without pushing them to GitHub.

### Local Development Strategy

#### 1. Clone Backend Repositories

**IMPORTANT:** All repositories must be cloned into the same parent directory. For example, if you have a `GitHub` folder in your `Documents` directory, all of the following repositories should be cloned directly inside that `GitHub` folder:

```
Documents/
└── GitHub/
  ├── opal-shared-infrastructure/
  ├── opal-fines-service/
  ├── opal-user-service/
  ├── opal-logging-service/
  └── opal-frontend/
```

Clone the [opal-shared-infrastructure](https://github.com/hmcts/opal-shared-infrastructure) repository and follow the instructions in there to get it up and running. This is required for the below repositories:
Clone the [opal-fines-service](https://github.com/hmcts/opal-fines-service) repository and follow the instructions in there to get it up and running. This is required by the front end to make local Fines API requests.
Clone the [opal-user-service](https://github.com/hmcts/opal-user-service) repository and follow the instructions in there to get it up and running. This is required by the front end to make local User API requests.
Clone the [opal-logging-service](https://github.com/hmcts/opal-logging-service) repository and follow the instructions in there to get it up and running. This is required by the opal-fines-service to make local Logging API requests.

#### 2. Clone opal-frontend-common-ui-lib

Clone the [opal-frontend-common-ui-lib](https://github.com/hmcts/opal-frontend-common-ui-lib) repository and run:

```bash
yarn
yarn pack:local
```

This is required if you want to develop the frontend against the local version of the UI library using `yarn dev:local-lib:ssr`. It generates a local `.tgz` package in the repository root.

#### 3. Clone opal-frontend-common-node-lib

Clone the [opal-frontend-common-node-lib](https://github.com/hmcts/opal-frontend-common-node-lib) repository and run:

```bash
yarn
yarn pack:local
```

This is required if you want to develop the frontend against the local version of the Node library using `yarn dev:local-lib:ssr`. It generates a local `.tgz` package in the repository root.

#### 4. Development server

There are two ways to run the Angular SSR application depending on whether you are developing against local or published versions of the common libraries:

- To use the **published** versions of the libraries:

  ```bash
  yarn dev:ssr
  ```

  This starts the SSR dev server using the versions pinned in your `package.json`/`yarn.lock`. No packages are reinstalled.

- To use **local** versions of the libraries:

  First, ensure you've run `yarn pack:local` in both libraries and set the environment variables:

  ```bash
  export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB REPOSITORY ROOT]"
  export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB REPOSITORY ROOT]"
  ```

  **Ensure you've run `yarn pack:local` in both libraries and exported the environment variables before running this command.**

  Then run:

  ```bash
  yarn dev:local-lib:ssr
  ```

  This will install local `.tgz` packages and start the SSR dev server with those versions.

The application's home page will be available at **http://localhost:4200**.

**Note** this is running the [Angular SSR](https://angular.dev/guide/ssr) application and expects the [opal-fines-service](https://github.com/hmcts/opal-fines-service) to also be running locally to function correctly.

#### 5. Production server

There are two options depending on whether you're working with local or published versions of the common libraries. This command builds the [Angular SSR](https://angular.dev/guide/ssr) application for production and serves it. You will **not** have hot reloading in this mode.

- To build and serve the application using the **published** libraries:

  ```bash
  yarn build:serve:ssr
  ```

  This will:
  - Build the application for production using the versions pinned in your `package.json`/`yarn.lock`
  - Serve it on **http://localhost:4000**

- To build and serve the application using **local** libraries:

  First, ensure you've run `yarn pack:local` in both common libraries and set the environment variables:

  ```bash
  export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB REPOSITORY ROOT]"
  export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB REPOSITORY ROOT]"
  ```

  **Ensure you've run `yarn pack:local` in both libraries and exported the environment variables before running this command.**

  Then run:

  ```bash
  yarn build:serve:local-lib:ssr
  ```

  This will:
  - Install local `.tgz` packages for the common libraries
  - Build the application for production
  - Serve it on **http://localhost:4000**

The application's home page will be available at **http://localhost:4000**.

**Note** this is running the [Angular SSR](https://angular.dev/guide/ssr) application and expects the [opal-fines-service](https://github.com/hmcts/opal-fines-service) to also be running locally to function correctly.

#### 6. Redis (Optional)

By default Redis is disabled for local development. If desired, start up a Redis instance locally:

```bash

docker run -p 6379:6379 -it redis/redis-stack-server:latest

```

And enable Redis integration within the application by setting the environment variable `FEATURES_REDIS_ENABLED` to `true`. The application will connect to Redis on the next startup.

#### 7. Launch Darkly (Optional)

By default Launch Darkly is disabled by default for local development. To enable set the following environment variables. Replace `XXXXXXXXXXXX` with the project client id.

```bash

export FEATURES_LAUNCH_DARKLY_ENABLED=true
export LAUNCH_DARKLY_CLIENT_ID=XXXXXXXXXXXX

```

The streaming of flags is disabled by default, if you would like to enable set the following environment variable.

```bash

export FEATURES_LAUNCH_DARKLY_STREAM=true

```

#### 8. Local feature flag overrides

Feature flag defaults are configured in `config/default.json` under `features.feature-flags`.

The `override` setting controls where the UI gets its feature flags from:

- `false` means Launch Darkly is used.
- `true` means the UI uses the configured `releases` values instead of Launch Darkly.

For local development, set `FEATURE_FLAGS_OVERRIDE` to `true` and set the release flags you need. The environment variable mappings are defined in `config/custom-environment-variables.json`, so these can be exported from your shell, including `~/.zshrc`.

For example:

```bash

export FEATURE_FLAGS_OVERRIDE=true
export RELEASE_1A_ENABLED=true
export RELEASE_1B_ENABLED=true

```

After updating `~/.zshrc`, reload your shell or run:

```bash

source ~/.zshrc
yarn dev:ssr

```

Leave `FEATURE_FLAGS_OVERRIDE` unset or set to `false` in deployed environments so Launch Darkly remains the source of truth.

## Build

Run `yarn build:ssr` to build the project. The build artifacts will be stored in the `dist/opal-frontend` directory. This compiles both the node.js server-side code and angular code.

## Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint) and [Prettier](https://prettier.io/).

Running the linting:

```bash

yarn lint

```

You can fix prettier formatting issues using:

```bash

yarn  prettier:fix

```

There is a custom lint rule for member ordering to ensure members in the code are ordered in the following format:

```json
[
  "private-static-field",
  "protected-static-field",
  "public-static-field",
  "private-instance-field",
  "protected-instance-field",
  "public-instance-field",
  "constructor",
  "private-static-method",
  "protected-static-method",
  "public-static-method",
  "private-instance-method",
  "protected-instance-method",
  "public-instance-method"
]
```

## Running unit tests

Run `yarn test` to execute the unit tests via [Vitest](https://vitest.dev/).

Run `yarn test:watch` to execute unit tests in watch mode.

To check code coverage, run `yarn test:coverage`.
Code coverage can then be found in the `coverage` folder of the repository locally.

## Running end-to-end tests

We are using [cypress](https://www.cypress.io/) for our end-to-end tests (Cucumber `.feature` files).

### Prerequisites

- Start the SSR app locally. The default base URL is `http://localhost:4000/`.
- Override the base URL with `TEST_URL` if needed, for example when running against a deployed environment.
- Generic test runs default to `edge`. In CI, the pipeline falls back to `chrome` if Edge is unavailable. Explicit browser runs still fail if the requested browser is not installed.

### Opal mode (default)

Run `yarn test:smoke` to execute the end-to-end smoke tests in Opal mode.

```bash

yarn test:smoke

```

Run `yarn test:functional` to execute the end-to-end functional tests in Opal mode.

```bash

yarn test:functional

```

To filter scenarios by tag locally, set `TAGS` and use the tagged runner:

```bash

TAGS=@UAT-Technical yarn test:functional:tags

```

Run `yarn test:component` to execute the Cypress component suite.

#### Release-scoped runners

The default functional runner excludes `@UAT-Technical`, `@skip`, and the off-state release tags, so the normal pipeline picks up the enabled-path coverage without automatically running the disabled-path scenarios.

Use these functional scripts when you need a release-aligned run locally or in a dedicated CI stage:

- `yarn test:functional:r1a_off`: technical `release-1a` disabled scenarios only
- `yarn test:functional:r1a`: current `R1A` positive coverage only
- `yarn test:functional:r1b_off`: technical `release-1b` disabled scenarios only
- `yarn test:functional:r1ab`: current `R1A` + `R1B` positive coverage only
- `yarn test:functional:r1c_write_off_off`: technical `release-1c-write-off` disabled scenarios only
- `yarn test:functional:r1c_enforcement_operational_reporting_off`: technical `release-1c-enforcement-operational-reporting` disabled scenarios only

Use these component scripts to avoid running later-release component coverage when you only want the currently-enabled release package:

- `yarn test:component:r1a`: `R1A` manual account creation and draft-account components only
- `yarn test:component:r1ab`: `R1A` + `R1B` component coverage only
- `yarn test:component:r1c_write_off`: `R1C` write-off / consolidation components only
- `yarn test:component:r1c_enforcement_operational_reporting`: `R1C` reports components only

The component release runners use `--spec` selection rather than extra tags. `test:component:r1a` intentionally excludes `manualAccountCreation/FinesFixedPenalty` to mirror the current functional `R1A` split.

All three top-level runners accept:

- `--browser=<chrome|edge|firefox>` for an explicit browser
- `--mode=<opal|legacy>` for suite mode selection
- `--parallel` or `--serial` to override the default execution style

Examples:

```bash

yarn test:component --browser=chrome --parallel
yarn test:smoke --mode=legacy --serial
yarn test:functional --browser=firefox --mode=opal --parallel
yarn test:functional:r1ab --browser=chrome
yarn test:component:r1a --browser=edge

```

### Legacy app mode

To run the UAT-Technical-tagged functional tests against legacy app mode locally:
This keeps the functional suite on the normal OPAL spec tree and only switches the app/helpers into legacy mode.

```bash

yarn test:functional:uat_legacy

```

### Dev-JCDE (CI / PR builds)

If you do not add a selector label, the CNP pipeline uses its normal default functional selection:

- functional tags: `not @UAT-Technical and not @skip and not (@R1AOff or @R1BOff or @R1CWriteOffOff or @R1CEnforcementOperationalReportingOff)`
- functional specs: all functional features, unless one or more `test_*` routing labels are present

PR labels supported by the CNP pipeline:

- `run_release:r1a`: run the current `R1A` positive suite only
- `run_release:r1ab`: run the current `R1A` + `R1B` positive suite only
- `run_release:r1a_off`: run the `release-1a` disabled technical scenarios only
- `run_release:r1b_off`: run the `release-1b` disabled technical scenarios only
- `run_release:r1c_write_off_off`: run the `release-1c-write-off` disabled technical scenarios only
- `run_release:r1c_enforcement_operational_reporting_off`: run the `release-1c-enforcement-operational-reporting` disabled technical scenarios only
- `run_tag:<expression>`: run a tagged functional subset; the pipeline always appends `not @skip`
- `enable_legacy_mode`: switch the dev environment to legacy mode and point the legacy gateway at JCDE
- `test_authorisation`: route the default CNP functional selection to the `authorisation` functional area
- `test_enq`: route the default CNP functional selection to the `accountEnquiry` / `fineAccountEnquiry` functional area
- `test_remo`: route the default CNP functional selection to the `reciprocalMaintenance` functional area
- `test_mac`: route the default CNP functional selection to the `manualAccountCreation` functional area
- `skip_opal_component`: skip the opal component stage in CNP

For release-scoped PR runs, use one of the `run_release:*` labels listed above instead of
`run_tag:<expression>`.

`run_release` skips smoke tests automatically. It also scopes component execution to the matching current-release package where supported, so an `r1a` run does not execute `R1B` or `R1C` component coverage. Off-state release selectors run the functional off-state coverage only. Do not combine `run_release` with `run_tag` or `enable_legacy_mode`.

When legacy mode is enabled in CI, you must also provide a `run_tag:<expression>` label, for example `run_tag:@UAT-Technical`, to scope the suite. The pipeline always appends `not @skip`.

The `test_*` routing labels only affect the normal CNP path. If `run_release:<suite>` is present, the release suite decides both the tags and the spec selection.

### Nightly pipeline stages

The nightly Jenkins pipeline runs its stages in this order after checkout and test setup:

- `Component Tests` runs when `Component=true`.
- `Smoke Tests` runs when `Smoke=true`.
- `Functional Tests` runs when `Functional=true`.
- `R1A Legacy Demo` runs when `RunR1aLegacyDemo=true` and defaults to enabled. It points `TEST_URL` at `https://opal-frontend.demo.apps.hmcts.net/`, switches app mode to legacy, and runs `yarn test:functional:r1a`.
- `R1A Off Legacy Demo` runs only when `RunR1aOffLegacyDemo=true`. It uses the same demo legacy flow and runs `yarn test:functional:r1a_off`.
- `UAT-Technical` runs only when `RunUatTech=true`. It uses the same demo legacy flow and runs `yarn test:functional:uat_legacy`.
- `Legacy Tests` runs only when `Legacy=true`. It runs the general functional suite in legacy mode.
- `Chrome Tests` runs only when `RunChrome=true`. It reruns the functional suite in Chrome.
- `Firefox Tests` runs only when `RunFirefox=true`. It reruns the functional suite in Firefox.

Notes for the nightly pipeline:

- `LEGACY_URL` currently defaults to `DEV` so the demo legacy stages can run while `PRE-PROD` is not ready.
- `LEGACY_URL=PRE-PROD` points the legacy gateway checks at `https://cloudgobgateway.test.platform.hmcts.net/opal`.
- `LEGACY_URL=DEV` uses the staging legacy DB stub and skips the pre-prod `getGmasTest` health check.
- `ZephyrExecution=true`, or a Friday nightly run, enables the Zephyr reporting flow for the normal component and functional paths.

### Debugging

Run `yarn cypress` to open the Cypress console.

```bash

yarn cypress

```

### Reports

After a clean run, artifacts and reports are written to `functional-output/` and `smoke-output/`.
Replace `<browser>` with `chrome`, `edge`, or `firefox`.

```text
functional-output/
  component/
    <browser>/
      html/
        component-report.html
        assets/...
      json/
        .jsons/
          mochawesome*.json
      junit/
        component-test-output-*.xml
      screenshots/...
  prod/
    <browser>/
      opal-mode-test-output-*.xml
      <browser>-test-result.xml
      cucumber/
        OPAL-report-*.ndjson
        <browser>-report.ndjson
        <browser>-report.html
      legacy/
        legacy-mode-test-output-*.xml
        legacy-test-result.xml
        cucumber/
          LEGACY-report-*.ndjson
          legacy-report.ndjson
          legacy-report.html
  screenshots/
    <browser>/...
    <browser>/legacy/...
  videos/...
  zephyr/
    cypress-report-1.json
    cucumber-report.json
    temp/...
  account_evidence/...

smoke-output/
  prod/
    <browser>/
      opal-mode-test-output-*.xml
      <browser>-test-result.xml
      cucumber/
        OPAL-report-*.ndjson
        smoke-report.ndjson
        smoke-report.html
      legacy/
        legacy-mode-test-output-*.xml
        legacy-test-result.xml
        cucumber/
          LEGACY-report-*.ndjson
          legacy-report.ndjson
          legacy-report.html
  screenshots/
    <browser>/...
    <browser>/legacy/...
  zephyr/
    cucumber-report.json
```

Notes:

- `functional-output/component/<browser>/json/.jsons/` is the raw Mochawesome JSON used to build `html/component-report.html`.
- `functional-output/prod/<browser>/legacy/` and `smoke-output/prod/<browser>/legacy/` are only created for legacy-mode runs.
- `videos/` is only expected when using `yarn test:functionalOpalVideo`.
- `account_evidence/` is only expected when legacy evidence capture is enabled.
- These older component paths should not be recreated on a clean run: `functional-output/component-report/`, `functional-output/component-html/`, and `functional-output/prod/<browser>/component/`.

## Running accessibility tests

We are using [axe-core](https://github.com/dequelabs/axe-core) and [cypress-axe](https://github.com/component-driven/cypress-axe) to check the accessibility.
Run the production server and once running you can run the smoke or functional test commands.

> See [opal-frontend-common-ui-lib](https://github.com/hmcts/opal-frontend-common-ui-lib), [opal-frontend-common-node-lib](https://github.com/hmcts/opal-frontend-common-node-lib), and [opal-frontend-common-cypress-lib](https://github.com/hmcts/opal-frontend-common-cypress-lib) for usage and build instructions.

## Switching Between Local and Published Common Libraries

This project supports switching between local and published versions of the `opal-frontend-common`, `opal-frontend-common-node`, and `opal-frontend-common-cypress` libraries using the following scripts:

### Switching to Local Versions

First, ensure you've run `yarn pack:local` in the library repos you want to use locally and exported the repository root paths (where the `.tgz` files are created):

```bash
# In your shell config file (.zshrc, .bash_profile, etc.)
export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB FOLDER]"
export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB FOLDER]"
export COMMON_CYPRESS_LIB_PATH="[INSERT PATH TO COMMON CYPRESS LIB FOLDER]"
```

Then, run the following scripts:

```bash
yarn import:local:common-ui-lib
yarn import:local:common-node-lib
yarn import:local:common-cypress-lib
```

These commands will remove the published versions and install local `.tgz` packages from each configured path.

### Switching to Published Versions

If you have installed local `.tgz` packages and want to return to npm-published packages, first ensure your `package.json` dependencies are semver values (not `file:` tarball paths), then reinstall.

```bash
yarn add @hmcts/opal-frontend-common@<VERSION> @hmcts/opal-frontend-common-node@<VERSION>
yarn add --dev @hmcts/opal-frontend-common-cypress@<VERSION>
yarn install
```

You can also use:

```bash
yarn import:published:common-ui-lib
yarn import:published:common-node-lib
yarn import:published:common-cypress-lib
```

These scripts read the target version from package.json.
If package.json still contains `file:...tgz` values, they will reinstall local tarballs rather than npm-published versions.

This is useful when you're no longer working on the libraries directly or want to verify against the published versions that your project is pinned to.

**Note:** Version upgrades should come via Renovate PRs. These commands do **not** upgrade to the latest; they reinstall the exact versions specified in `package.json`. For extra safety in CI, consider using `yarn install --immutable` to prevent lockfile drift.

### How Shared Cypress Scripts Work

The Cypress helper commands in `opal-frontend` now come from the shared package `@hmcts/opal-frontend-common-cypress`, not from source files stored in this repository.

1. How `opal-frontend` scripts find the commands:
   `opal-frontend/package.json` keeps the same script names, but the script bodies now call package binaries such as `opal-cypress-find-duplicate-scenarios` and `opal-cypress-find-unused-steps`. Those binary names are declared in `opal-frontend-common-cypress-lib/package.json` and are made available automatically by Yarn when `@hmcts/opal-frontend-common-cypress` is installed as a dev dependency.
2. Why the commands still operate on `opal-frontend` files:
   The shared binaries run from the consuming repository's working directory and use the paths passed in the script, for example `--root cypress/e2e/functional/opal/features`. So the code lives in the shared package, but the files being scanned or written are still the files in `opal-frontend`.
3. How the sibling repo is involved during local development:
   `opal-frontend` does not read sibling repositories directly during a normal script run. It only does so when you intentionally switch to a locally packed tarball by setting `COMMON_CYPRESS_LIB_PATH` and running `yarn import:local:common-cypress-lib`. After that install step, the same script names still work, but they execute the locally packed version of the shared package instead of the published npm version.

## OpenAPI reference models

- Run `yarn generate:openapi` to download and merge the fines-service specs, then emit reference-only models to `src/app/generated/api-client` and `src/app/flows/fines/services/opal-fines-service/{interfaces/generated,types/generated}`.
- The generated files are gitignored and excluded from TypeScript/Jasmine; they are **not** used by application code or tests.
- When schema changes are needed, copy shapes from the generated output into the hand-written interfaces under `src/app/flows/fines/services/opal-fines-service/interfaces` and adjust as required.

## OpenAPI docs

- Backend fines OpenAPI specs live in the fines service repo under `src/main/resources/openapi/` (DefendantAccount, MajorCreditor, MinorCreditor, common, types) and are merged via `openapi/openapi-merge-config.json`.
- The merged spec is written locally to `openapi/opal-merged.yaml` when you run `yarn generate:openapi`; open that file for endpoint/schema details or to copy shapes into the hand-cranked interfaces.

**Platform note:** `import:*` scripts use Unix shell commands (`rm`, `ls`, `grep`) and are intended for macOS/Linux environments.

## Angular code scaffolding

Run `yarn ng generate component component-name` to generate a new component. You can also use `yarn ng generate directive|pipe|service|class|guard|interface|enum|module`.

Note the requirement for prefixing the `ng` commands with `yarn`

## Angular code LLM prompts

https://angular.dev/ai/develop-with-ai

Paste the following prompt into your AI assistant of choice.

```markdown
You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Do NOT set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
```

## 💡 Copilot Prompt Examples for Angular MCP

### 📘 1. Ask for Documentation Help

**Prompt:**

> “How do Angular signals work?”

**What Copilot does:**  
Calls `search_documentation("signals")` and returns official Angular documentation context.

---

### 🧱 2. Generate Code

**Prompt:**

> “Generate a service for user authentication”

**What Copilot does:**  
Runs `ng generate service user-auth` through the MCP server — adds the file in the correct directory.

---

### 📚 3. Get Project File Structure

**Prompt:**

> “List all Angular modules in this project”

**What Copilot does:**  
Uses `list_projects` and `get_file_tree` to find and display modules across the workspace.

---

### 🧭 4. Navigate Routing Setup

**Prompt:**

> “What routes are defined in this app?”

**What Copilot does:**  
Parses routing modules and shows route paths, guards, and lazy-loaded modules.

---

### 🧹 5. Refactor with AI Help

**Prompt:**

> “Convert this component to use the standalone API”

**What Copilot does:**  
Updates component metadata with `standalone: true`, refactors imports, and removes old NgModule references.

---

### 🛠️ 6. Add Angular Libraries

**Prompt:**

> “Add Angular Material”

**What Copilot does:**  
Triggers `ng add @angular/material` to install the package and configure animations + theming.

# Zephyr Automation

Zephyr Automation is a tool for integrating test results and ticket management between Zephyr, Jira, and test frameworks (Cucumber, Cypress). It automates the creation and updating of Jira tickets and Zephyr executions based on test reports.

## Features

- Create or update Jira tickets from test results
- Create Zephyr executions
- Supports Cucumber and Cypress JSON reports

## Project Scripts (zephyr:\*)

- Zephyr scripts still use the JSON report paths listed below as their inputs. Their console output is also mirrored to `tmp/zephyr/*.log`, with each script overwriting its own log file on the next run. `/tmp` is gitignored.
- `zephyr:cypress:jira-create`: Create Jira tickets from the Cypress JSON report at `functional-output/zephyr/cypress-report-1.json`.
- `zephyr:cypress:jira-update`: Update Jira tickets using the Cypress JSON report at `functional-output/zephyr/cypress-report-1.json`.
- `zephyr:cypress:jira-execute`: Create a Zephyr execution from the Cypress JSON report at `functional-output/zephyr/cypress-report-1.json`.
- `zephyr:cucumber:functional:jira-create`: Create Jira tickets from the functional Cucumber JSON report at `functional-output/zephyr/cucumber-report.json`.
- `zephyr:cucumber:functional:jira-update`: Update Jira tickets using the functional Cucumber JSON report at `functional-output/zephyr/cucumber-report.json`.
- `zephyr:cucumber:functional:jira-execute`: Create a Zephyr execution from the functional Cucumber JSON report at `functional-output/zephyr/cucumber-report.json`.
- `zephyr:cucumber:smoke:jira-create`: Create Jira tickets from the smoke Cucumber JSON report at `smoke-output/zephyr/cucumber-report.json`.
- `zephyr:cucumber:smoke:jira-update`: Update Jira tickets using the smoke Cucumber JSON report at `smoke-output/zephyr/cucumber-report.json`.
- `zephyr:cucumber:smoke:jira-execute`: Create a Zephyr execution from the smoke Cucumber JSON report at `smoke-output/zephyr/cucumber-report.json`.
- `zephyr:test:component`: Reset outputs, run component tests, then create a Zephyr execution from the Cypress JSON report.
- `zephyr:test:functional`: Reset outputs, run functional tests, then create a Zephyr execution from the functional Cucumber JSON report.
- `zephyr:test:smoke`: Reset outputs, run smoke tests, then create a Zephyr execution from the smoke Cucumber JSON report.

## Test Metadata Maintenance

- `opal-cypress-find-tests-missing-epic`: Report executable Cypress tests that have no Jira epic metadata.
- `opal-cypress-resolve-placeholder-jira-epics`: Resolve placeholder epic values from `cypress/jira-epic-placeholders.json`. Add `--write` to update matching placeholders in test files.
- `opal-cypress-find-tests-with-multiple-epics`: Report executable Cypress tests that have more than one Jira epic reference.
- `yarn check:jira:test-metadata`: Scan all covered component specs and functional E2E feature files and validate Jira metadata on every executable test, including rejecting multiple `@JIRA-EPIC` values on a single test.
- `yarn find:duplicate:scenarios`: Report duplicate scenario names across the functional OPAL feature suite.
- `yarn find:unused:steps`: Report step definitions that are not referenced by the scanned feature files.
- `yarn extract:jira:po-keys-from-tests`: Extract Jira test keys from Cypress specs and feature files into `matches.csv`.
- The Jira metadata check also runs in the CI pipeline. Component tests must include `@JIRA-EPIC` and either `@JIRA-STORY` or `@JIRA-DEFECT`. Functional E2E tests must include `@JIRA-EPIC` and at least one of `@JIRA-STORY`, `@JIRA-NFR`, or `@JIRA-DEFECT`. Smoke tests are not checked here, and `dummyTest.feature` remains exempt.

### Supported Tags

The following tags can be used in your test scenarios to control ticket creation, linking, and metadata:

| Tag Prefix         | Example Value           | Description                                                        |
| ------------------ | ----------------------- | ------------------------------------------------------------------ |
| `@JIRA-KEY:`       | `@JIRA-KEY:PROJ-123`    | Associates the test with an existing Jira issue key.               |
| `@JIRA-KEY:PO-*`   | `@JIRA-KEY:PO-1234`     | Associates one executable test with one Zephyr PO test case key.   |
| `@JIRA-COMPONENT:` | `@JIRA-COMPONENT:API`   | Adds the specified Jira component to the ticket.                   |
| `@JIRA-LABEL:`     | `@JIRA-LABEL:smoke`     | Adds the specified label to the Jira ticket.                       |
| `@JIRA-EPIC:`      | `@JIRA-EPIC:PROJ-456`   | Links the ticket to the specified Jira Epic.                       |
| `@JIRA-NFR:`       | `@JIRA-NFR:PROJ-789`    | Links the ticket to a Non-Functional Requirement (NFR) Jira issue. |
| `@JIRA-LINK:`      | `@JIRA-LINK:PROJ-321`   | Creates a generic link to another Jira issue.                      |
| `@JIRA-STORY:`     | `@JIRA-STORY:PROJ-654`  | Links the ticket to a Jira Story.                                  |
| `@JIRA-DEFECT:`    | `@JIRA-DEFECT:PROJ-987` | Links the ticket to a Jira Defect.                                 |
| `@JIRA-IGNORE:`    | `@JIRA-IGNORE`          | Prevents ticket creation or update for this test.                  |

- Tags are case-sensitive and must be used exactly as shown.
- `yarn check:jira:test-metadata` uses `@hmcts/opal-frontend-common-cypress` to enforce the covered-test Jira metadata policy, including the single-epic rule.
