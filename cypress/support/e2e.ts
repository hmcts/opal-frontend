// cypress/support/e2e.ts

// ***********************************************************
// This support file is processed and loaded automatically
// before your test files.
//
// Great place for global configuration / behaviour.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Simple marker so we can confirm in CI logs this file is actually loaded
 
console.log('*** Cypress e2e support file loaded ***');

Cypress.on('uncaught:exception', (err) => {
  const message = String((err as any)?.message || err || '');

   
  console.error('UNCAUGHT EXCEPTION (Cypress global handler):', message);

  // Known noisy sourcemap/Base64 error coming from Cucumber/source-map internals.
  // We don't want this to fail the whole run.
  if (message.includes('Invalid string') && message.includes('Length must be a multiple of 4')) {
    return false; // don't fail the test run for this specific bug
  }

  // Let all other errors behave normally (fail the test)
  return true;
});
