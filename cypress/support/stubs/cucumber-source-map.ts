// cypress/support/stubs/cucumber-source-map.ts

/**
 * Stubbed source-map helpers for the Cucumber preprocessor.
 * These are intentionally no-ops to stop Cypress from doing sourcemap work
 * that was causing recursion / Base64 errors in headed/headless runs.
 */
export const createSourceMapConsumer = () => undefined;
export const cachedCreateSourceMapConsumer = () => undefined;
export const maybeRetrievePositionFromSourceMap = () => undefined;
