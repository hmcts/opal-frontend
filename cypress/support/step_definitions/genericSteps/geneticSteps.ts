import { Then } from '@badeball/cypress-cucumber-preprocessor/';

Then('I click the {string} button', (buttonName: string) => {
  cy.contains('button', buttonName).click();
});
Then(
  'I see the {string} radio button below the {string} radio button',
  (radioButton: string, previousRadioButton: string) => {
    cy.contains('label', previousRadioButton).parent().next().contains('label', radioButton);
  },
);
Then('I select the {string} radio button', (radioButton: string) => {
  cy.contains('label', radioButton).click();
});
Then('I validate the {string} radio button is selected', (radioButton: string) => {
  cy.get('input[type="radio"]').next().contains('label', radioButton).prev().should('be.checked');
});
Then('I validate the {string} radio button is not selected', (radioButton: string) => {
  cy.get('input[type="radio"]').next().contains('label', radioButton).prev().should('not.be.checked');
});
Then('I go back in the browser', () => {
  cy.go('back');
});
