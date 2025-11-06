// cypress/e2e/functional/opal/actions/accessDenied.actions.ts
import * as Locators from '../../../../shared/selectors/accessDenied.locators';

export function assertAccessDeniedPage(): void {
  Cypress.log({ name: 'access-denied', displayName: 'AccessDenied', message: 'Asserting Access Denied page' });
  cy.get(Locators.accessDeniedHeading).should('be.visible');
}

export function assertErrorMessage(expected: string): void {
  cy.get(Locators.accessDeniedMessage).should('contain.text', expected);
}

export function assertBackToDashboardAction(label: string): void {
  cy.get(Locators.backToDashboardBtn).should('be.visible').and('contain.text', label);
}
