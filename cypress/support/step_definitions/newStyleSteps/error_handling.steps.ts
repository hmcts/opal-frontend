// cypress/support/step_definitions/error_handling.steps.ts
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import {
  assertAccessDeniedPage,
  assertErrorMessage,
  assertBackToDashboardAction,
} from '../../../e2e/functional/opal/actions/accessDenied.actions';

Then('I should see an Access Denied page', () => {
  assertAccessDeniedPage();
});

Then('I should see an error message {string}', (message: string) => {
  assertErrorMessage(message);
});

Then('I should see a {string} action', (label: string) => {
  assertBackToDashboardAction(label);
});
