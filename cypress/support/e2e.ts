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

Cypress.on('uncaught:exception', (err) => {
  const message = String((err && (err as any).message) || err || '');

  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION (global handler):', message);

  // 🔴 Treat anything that looks like the sourcemap/Base64 bug as "known noise"
  if (
    message.includes('Invalid string') ||
    message.includes('Length must be a multiple of 4') ||
    message.includes('createSourceMapConsumer') ||
    message.includes('maybeRetrievePositionFromSourceMap')
  ) {
    return false; // don't fail tests for this known Cucumber+source-map bug
  }

  // Let everything else still fail the test
  return true;
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
