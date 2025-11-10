import * as Locators from '../../../../shared/selectors/accountEnquiriesViewDetails.locators';

export function testCancelChanges(defendantType: string, defendantName: string): void {
  // Determine which field and page title to test based on defendant type
  const isCompany = defendantType.toLowerCase() === 'company';
  const fieldName = isCompany ? 'Company name' : 'First name';
  const detailsPageTitle = isCompany ? 'Company details' : 'Defendant details';

  Cypress.log({
    name: 'cancelChanges',
    displayName: 'Cancel Changes',
    message: `Testing cancel changes for ${defendantType} defendant`,
  });

  // Test 1: Navigate to change page and cancel without making changes
  cy.contains(Locators.cancelLink, Locators.defendantLinkText).click();
  cy.contains(Locators.cancelLink, Locators.changeLinkText).click();
  cy.get(Locators.pageHeading).should('contain', detailsPageTitle);
  cy.contains(Locators.cancelLink, Locators.cancelLinkText).click();
  cy.get(Locators.pageHeading).should('contain', defendantName);

  // Test 2: Navigate to change page and make a change
  cy.contains(Locators.cancelLink, Locators.defendantLinkText).click();
  cy.contains(Locators.cancelLink, Locators.changeLinkText).click();
  Locators.getInputFieldByLabel(fieldName).clear().type('Test', { delay: 0 });

  // Test 2a: Click Cancel and cancel the dialog (keep changes)
  cy.contains(Locators.cancelLink, Locators.cancelLinkText).click();
  cy.once('window:confirm', () => false);
  Locators.getInputFieldByLabel(fieldName).should('have.value', 'Test');

  // Test 3: Click Cancel and confirm the dialog (discard changes)
  cy.contains(Locators.cancelLink, Locators.cancelLinkText).click();
  cy.once('window:confirm', () => true);
  cy.get(Locators.pageHeading).should('contain', defendantName);
}
