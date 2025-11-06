// cypress/e2e/functional/opal/actions/dashboard.actions.ts
import * as Locators from '../../../../shared/selectors/dashboard.locators';

export function assertDashboard(username?: string): void {
  const userPart = username ? 'for ' + username : '';
  Cypress.log({ name: 'dashboard', displayName: 'Dashboard', message: `Verifying dashboard page ${userPart}` });

  cy.get(Locators.dashboardPageTitle).should('contain.text', 'Dashboard');
  if (username) cy.get(Locators.userName).should('contain.text', username);
}

export function goToManualAccountCreation(): void {
  Cypress.log({ name: 'dashboard', displayName: 'Navigation', message: 'Clicking Manual Account Creation link' });
  cy.get(Locators.manualAccountCreationLink).should('be.visible').click();
}
