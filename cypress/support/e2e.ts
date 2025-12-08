// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
try {
  const sourceMapHelper = require('@badeball/cypress-cucumber-preprocessor/dist/helpers/source-map');
  sourceMapHelper.createSourceMapConsumer = () => undefined;
  sourceMapHelper.cachedCreateSourceMapConsumer = () => undefined;
  sourceMapHelper.maybeRetrievePositionFromSourceMap = () => undefined;
} catch {
  // Ignore if helper is not present in this bundle
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
