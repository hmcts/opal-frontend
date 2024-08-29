import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('The button {string} is clicked, nothing happens', (linkText: string) => {
  let initialUrl: string;
  cy.url().then((url) => {
    initialUrl = url.toString();
    cy.get('button').contains(linkText).click();
    cy.url().should('eq', initialUrl);
  });
});
Then('I select {string} button', (removeButton: string) => {
  cy.contains('a', removeButton).click();
});