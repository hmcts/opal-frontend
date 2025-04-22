# OPAL Frontend

This is an [Angular SSR](https://angular.dev/guide/ssr) application. There are two main reasons for this:

- the web server for when the app is deployed in Kubernetes.

- to proxy API requests to internally-facing backend API services, such as the [opal-fines-service](https://github.com/hmcts/opal-fines-service).

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v20.9.0 or later

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

#### 2. Development server

To run the [Angular SSR](https://angular.dev/guide/ssr) application in development mode with hot reloading run the following command.

```bash

yarn dev:ssr

```

The applications's home page will be available at http://localhost:4200.

**Note** this is running the [Angular SSR](https://angular.dev/guide/ssr) application and expects the [opal-fines-service](https://github.com/hmcts/opal-fines-service) to also be running locally to function correctly.

#### 3. Production server

The following command builds the [Angular SSR](https://angular.dev/guide/ssr) application for production and serves it. You will **not** have hot reloading in this mode.

```bash

yarn build:serve:ssr

```

The applications's home page will be available at http://localhost:4000.

**Note** this is running [Angular SSR](https://angular.dev/guide/ssr) application and expects the [opal-fines-service](https://github.com/hmcts/opal-fines-service) to also be running locally to function correctly.

#### Redis (Optional)

By default Redis is disabled for local development. If desired, start up a Redis instance locally:

```bash

docker run -p 6379:6379 -it redis/redis-stack-server:latest

```

And enable Redis integration within the application by setting the environment variable `FEATURES_REDIS_ENABLED` to `true`. The application will connect to Redis on the next startup.

#### Launch Darkly (Optional)

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
