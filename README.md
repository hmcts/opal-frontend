# OPAL Frontend

This is an [Angular SSR](https://angular.dev/guide/ssr) application. There are two main reasons for this:

- the web server for when the app is deployed in Kubernetes.

- to proxy API requests to internally-facing backend API services, such as the [opal-fines-service](https://github.com/hmcts/opal-fines-service).

## Contents

- [Getting Started](#getting-started)
- [Local Development Strategy](#local-development-strategy)
- [Production Server](#5-production-server)
- [Running Unit Tests](#running-unit-tests)
- [Running End-to-End Tests](#running-end-to-end-tests)
- [Accessibility Tests](#running-accessibility-tests)
- [Switching Between Local and Published Common Libraries](#switching-between-local-and-published-common-libraries)

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v20.9.0 or later.

- [yarn](https://yarnpkg.com/) v3

- [Docker](https://www.docker.com)

### Install Dependencies

Install dependencies by executing the following command:

```bash

yarn

```

### Local Development Strategy

#### 1. Clone opal-fines-service api

Clone the [opal-fines-service](https://github.com/hmcts/opal-fines-service) repository and follow the instructions in there to get it up and running. This is required by the front end to make local API requests.

#### 2. Clone opal-frontend-common-ui-lib

Clone the [opal-frontend-common-ui-lib](https://github.com/hmcts/opal-frontend-common-ui-lib) repository and run:

```bash
yarn
yarn build
```

This is required if you want to develop the frontend against the local version of the UI library using `yarn dev:local-lib:ssr`.

#### 3. Clone opal-frontend-common-node-lib

Clone the [opal-frontend-common-node-lib](https://github.com/hmcts/opal-frontend-common-node-lib) repository and run:

```bash
yarn
yarn build
```

This is required if you want to develop the frontend against the local version of the Node library using `yarn dev:local-lib:ssr`.

#### 4. Development server

There are two ways to run the Angular SSR application depending on whether you are developing against local or published versions of the common libraries:

- To use the **published** versions of the libraries:

  ```bash
  yarn dev:ssr
  ```

  This will import the latest published versions of `@hmcts/opal-frontend-common` and `@hmcts/opal-frontend-common-node`, then start the SSR dev server.

- To use **local** versions of the libraries:

  First, ensure you've built the libraries locally and set the environment variables:

  ```bash
  export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB DIST FOLDER]"
  export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB DIST FOLDER]"
  ```

  **Ensure you've built both libraries and exported the environment variables before running this command.**

  Then run:

  ```bash
  yarn dev:local-lib:ssr
  ```

  This will import the local builds and start the SSR dev server with those versions.

The application's home page will be available at **http://localhost:4200**.

**Note** this is running the [Angular SSR](https://angular.dev/guide/ssr) application and expects the [opal-fines-service](https://github.com/hmcts/opal-fines-service) to also be running locally to function correctly.

#### 5. Production server

There are two options depending on whether you're working with local or published versions of the common libraries. This command builds the [Angular SSR](https://angular.dev/guide/ssr) application for production and serves it. You will **not** have hot reloading in this mode.

- To build and serve the application using the **published** libraries:

  ```bash
  yarn build:serve:ssr
  ```

  This will:

  - Import the published versions of `@hmcts/opal-frontend-common` and `@hmcts/opal-frontend-common-node`
  - Build the application for production
  - Serve it on **http://localhost:4000**

- To build and serve the application using **local** libraries:

  First, ensure you've built both common libraries and set the environment variables:

  ```bash
  export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB DIST FOLDER]"
  export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB DIST FOLDER]"
  ```

  **Ensure you've built both libraries and exported the environment variables before running this command.**

  Then run:

  ```bash
  yarn build:serve:local-lib:ssr
  ```

  This will:

  - Import the local builds of the common libraries
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

## Build

Run `yarn build:ssr` to build the project. The build artifacts will be stored in the `dist/opal-frontend` directory. This compiles both the node.js server-side code and angular code.

## Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint) and [Prettier](https://prettier.io/)

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

Run `yarn test` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html).

To check code coverage, run `yarn test --code-coverage` to execute the unit tests via [karma](https://karma-runner.github.io/latest/index.html) but with code coverage.
Code coverage can then be found in the coverage folder of the repository locally.

## Running end-to-end tests

We are using [cypress](https://www.cypress.io/) for our end to end tests.

Run `yarn test:smoke` to execute the end-to-end smoke tests.

```bash

yarn test:smoke

```

Run `yarn test:functional` to execute the end-to-end functional tests.

```bash

yarn test:functional

```

Run `yarn cypress` to open the cypress console, very useful for debugging tests.

```bash

yarn cypress

```

## Running accessibility tests

We are using [axe-core](https://github.com/dequelabs/axe-core) and [cypress-axe](https://github.com/component-driven/cypress-axe) to check the accessibility.
Run the production server and once running you can run the smoke or functional test commands.

> See [opal-frontend-common-ui-lib](https://github.com/hmcts/opal-frontend-common-ui-lib) and [opal-frontend-common-node-lib](https://github.com/hmcts/opal-frontend-common-node-lib) for usage and build instructions.

## Switching Between Local and Published Common Libraries

This project supports switching between local and published versions of the `opal-frontend-common` and `opal-frontend-common-node` libraries using the following scripts:

### Switching to Local Versions

First, ensure you've built the libraries locally and exported the paths to the built `dist` folders:

```bash
# In your shell config file (.zshrc, .bash_profile, etc.)
export COMMON_UI_LIB_PATH="[INSERT PATH TO COMMON UI LIB FOLDER]"
export COMMON_NODE_LIB_PATH="[INSERT PATH TO COMMON NODE LIB DIST FOLDER]"
```

Then, run the following scripts:

```bash
yarn import:local:common-ui-lib
yarn import:local:common-node-lib
```

These commands will remove the published versions and install the local builds from the paths you specified.

### Switching to Published Versions

To restore the published packages from npm:

```bash
yarn import:published:common-ui-lib
yarn import:published:common-node-lib
```

This is useful when you're no longer working on the libraries directly or want to verify against the published version.

## Angular code scaffolding

Run `yarn ng generate component component-name` to generate a new component. You can also use `yarn ng generate directive|pipe|service|class|guard|interface|enum|module`.

Note the requirement for prefixing the `ng` commands with `yarn`
