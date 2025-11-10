import * as Locators from '../../../../shared/selectors/accountEnquiriesViewDetails.locators';

export function testRouteGuard(defendantType: string, defendantName: string): void {
  // Determine which field to test based on defendant type
  const fieldName = defendantType.toLowerCase() === 'company' ? 'Company name' : 'First name';

  Cypress.log({
    name: 'routeGuard',
    displayName: 'Route Guard',
    message: `Testing route guard for ${defendantType} defendant`,
  });

  Locators.getInputFieldByLabel(fieldName).clear().type('Test', { delay: 0 });

  // Click Cancel and then click Cancel in the confirmation dialog
  cy.contains(Locators.cancelLink, Locators.cancelLinkText).click();
  cy.once('window:confirm', () => false);

  // Verify the test value is still in the field (route guard prevented navigation)
  Locators.getInputFieldByLabel(fieldName).should('have.value', 'Test');

  // Click Cancel and then click Ok in the confirmation dialog
  cy.contains(Locators.cancelLink, Locators.cancelLinkText).click();
  cy.once('window:confirm', () => true);

  // Verify navigation back to the defendant page
  cy.get(Locators.pageHeading).should('contain', defendantName);
}
