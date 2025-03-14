describe('Test page spec', () => {
  it('passes', () => {
    cy.visit('/sign-in');
    cy.get('lib-govuk-button > #fetch-api-data').contains('Sign in');
    cy.get('lib-govuk-button > #fetch-api-data').contains('Sign in').click;
    cy.get('lib-govuk-button > #fetch-api-data').contains('Sign out').should('be.visible');
  });
});
