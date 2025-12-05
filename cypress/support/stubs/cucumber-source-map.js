// cypress/support/stubs/cucumber-source-map.js

// Stubbed source-map helpers to avoid sourcemap parsing in headed Cypress runs.
module.exports = {
  createSourceMapConsumer: (...args) => {
    // eslint-disable-next-line no-console
    console.log('[STUB] createSourceMapConsumer called with args:', args);
    return undefined;
  },
  cachedCreateSourceMapConsumer: (...args) => {
    // eslint-disable-next-line no-console
    console.log('[STUB] cachedCreateSourceMapConsumer called with args:', args);
    return undefined;
  },
  maybeRetrievePositionFromSourceMap: (...args) => {
    // eslint-disable-next-line no-console
    console.log('[STUB] maybeRetrievePositionFromSourceMap called with args:', args);
    return undefined;
  },
};
