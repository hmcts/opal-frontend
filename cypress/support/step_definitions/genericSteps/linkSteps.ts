import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I click on the {string} link', (linkText: string) => {
  cy.get('a').contains(linkText).click();
});
When('{string} is clicked', (linkText: string) => {
  cy.get('a').contains(linkText).click();
});
When('{string} is clicked, nothing happens', (linkText: string) => {
  let initialUrl: string;
  cy.url().then((url) => {
    initialUrl = url.toString();
    cy.get('a').contains(linkText).click();
    cy.url().should('eq', initialUrl);
  });
});
When('the link with text {string} should not be present', (linkText: string) => {
  cy.contains('a', linkText).should('not.exist');
});
