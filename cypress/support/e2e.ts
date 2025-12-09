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

Cypress.on('uncaught:exception', (err) => {
  const message = String(err?.message || err || '');

  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION CAUGHT BY CYPRESS HANDLER:', message);

  if (message.includes('Invalid string. Length must be a multiple of 4')) {
    return false; // ignore this known sourcemap/Base64 noise
  }

  return true; // fail on everything else
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
