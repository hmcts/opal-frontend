/// <reference types="cypress" />

export const assertPageAtTop = (): void => {
  // Verify both window.scrollY and documentElement.scrollTop for robustness
  cy.window().its('scrollY').should('equal', 0);
  cy.document().its('documentElement.scrollTop').should('equal', 0);
};
