// cypress/support/stubs/cucumber-source-map.js

/**
 * Stubbed source-map helpers for the Cucumber preprocessor.
 * These are intentionally no-ops to stop Cypress from doing sourcemap work
 * that was causing recursion / Base64 errors in headed/headless runs.
 */
module.exports = {
  createSourceMapConsumer: () => undefined,
  cachedCreateSourceMapConsumer: () => undefined,
  maybeRetrievePositionFromSourceMap: () => undefined,
};

