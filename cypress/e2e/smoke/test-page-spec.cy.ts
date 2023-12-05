describe('Test page spec', () => {
  it('passes', () => {
    cy.visit('/sign-in');
    cy.get('app-govuk-button > #fetch-api-data').contains('Sign in')
    cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click
    cy.get('app-govuk-button > #fetch-api-data').contains('Sign out').should('be.visible')
  });
});
