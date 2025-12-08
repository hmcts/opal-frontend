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
// Ignore the specific sourcemap/Base64 error coming from the Cucumber preprocessor.
// This stops the noisy "Invalid string. Length must be a multiple of 4" from
// failing the run, but other uncaught errors will still fail tests.
Cypress.on('uncaught:exception', (err) => {
  if (err.message?.includes('Invalid string. Length must be a multiple of 4')) {
    return false; // do NOT fail the test for this one known issue
  }

  // Let all other errors behave normally (fail the test)
  return true;
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
