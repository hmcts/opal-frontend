import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
Then('I see help text {string} for the {string} radio button', (helpText: string, radioButton: string) => {
  cy.get('.govuk-radios').contains(radioButton).next().should('contain', helpText);
});
When('I see {string} below the {string} radio button', (text: string, radioButton: string) => {
  cy.contains('label', radioButton).next().contains('div', text).invoke('text').should('contains', text);
});
Then('I see the {string} radio button under the {string} section', (radioButton: string, section: string) => {
  cy.get('[legendtext="' + section + '"]')
    .find('.govuk-radios')
    .should('contain.text', radioButton);
});
Then(
  'I see the {string} radio button under the {string} section is selected',
  (radioButton: string, section: string) => {
    cy.get('[legendtext="' + section + '"]')
      .find('.govuk-radios')
      .contains('label', radioButton)
      .prev()
      .should('be.checked');
  },
);
Then(
  'I see the {string} radio button under the {string} section is not selected',
  (radioButton: string, section: string) => {
    cy.get('[legendtext="' + section + '"]')
      .find('.govuk-radios')
      .contains('label', radioButton)
      .prev()
      .should('not.be.checked');
  },
);
When('I select the {string} radio button under the {string} section', (radioButton: string, section: string) => {
  cy.get('[legendtext="' + section + '"]')
    .find('.govuk-radios')
    .contains('label', radioButton)
    .click();
});
