import { DashboardLocators as Locators } from '../../../../shared/selectors/dashboard.locators';
export class DashboardActions {
  assertDashboard(username?: string): void {
    cy.get(Locators.dashboardPageTitle, { timeout: 10000 }).should('contain.text', 'Dashboard');
    if (username) cy.get(Locators.userName).should('contain.text', username);

    cy.get(Locators.dashboardPageTitle).should('contain.text', 'Dashboard');
    if (username) cy.get(Locators.userName).should('contain.text', username);
  }

  goToManualAccountCreation(): void {
    Cypress.log({ name: 'dashboard', displayName: 'Navigation', message: 'Clicking Manual Account Creation link' });
    cy.get(Locators.manualAccountCreationLink, { timeout: 10000 }).should('be.visible').click();
  }

  goToAccountSearch() {
    cy.log('Navigation', 'Navigating to Search For An Account');
    cy.get('#finesSaSearchLink', { timeout: 10000 }).should('be.visible').click();
    cy.location('pathname', { timeout: 10000 }).should('include', '/fines/search-accounts/search');
    // ensure search form rendered
    cy.get('app-fines-sa-search, [data-testid="fines-sa-search"]', { timeout: 10000 }).should('be.visible');
  }
}
