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
Then('I see the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText).should('exist');
});
Then('the button with text {string} should not be present', (buttonText: string) => {
  cy.contains('button', buttonText).should('not.exist');
});
