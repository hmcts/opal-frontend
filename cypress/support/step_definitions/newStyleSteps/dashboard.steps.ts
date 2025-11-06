// cypress/support/step_definitions/navigation.steps.ts
import { When } from '@badeball/cypress-cucumber-preprocessor';
import { goToManualAccountCreation } from '../../../e2e/functional/opal/actions/dashboard.actions';

/** When I open Manual Account Creation */
When('I open Manual Account Creation', () => {
  goToManualAccountCreation();
});
