// cypress/support/step_definitions/auth.steps.ts
import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { loginAndLandOnDashboard } from '../../../e2e/functional/opal/flows/auth.flow';

Given('I am logged in with email {string}', (email: string) => {
  Cypress.log({ name: 'auth', displayName: 'Login', message: `Logging in as ${email}` });
  loginAndLandOnDashboard(email);
});
