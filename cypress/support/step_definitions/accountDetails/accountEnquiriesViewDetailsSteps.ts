import { When } from '@badeball/cypress-cucumber-preprocessor';
import { testRouteGuard } from '../../../e2e/functional/opal/actions/routeGuard.action';
import { testCancelChanges } from '../../../e2e/functional/opal/actions/cancelChanges.action';

/**
 * Step definition for testing route guard functionality on defendant details forms.
 */
When('I trigger the route guard for a {string} defendant named {string}', (defendantType: string, defendantName: string) => {
  testRouteGuard(defendantType, defendantName);
});

/**
 * Step definition for testing cancel changes functionality on defendant details forms.
 */
When('I test cancel changes for a {string} defendant named {string}', (defendantType: string, defendantName: string) => {
  testCancelChanges(defendantType, defendantName);
});
