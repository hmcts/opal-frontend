import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the business unit is {string}', (businessUnit: string) => {
  cy.get('#accountDetailsBusinessUnitValue').should('have.text', businessUnit);
});
Then('I see the defendant type is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the document language is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the hearing language is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the {string} is {string} in the account details table', (key: string, value: string) => {
  cy.get('[summarylistid="accountDetails"]')
    .contains(key)
    .next('[summarylistid="accountDetails"] > dd')
    .should('have.text', value);
});

Then('I see {string} below {string} in the account details table', (valueOne: string, valueTwo: string) => {
  cy.get('[summarylistid="accountDetails"]')
    .contains(valueOne)
    .parent()
    .prev('[summarylistid="accountDetails"]')
    .children('dt')
    .should('have.text', valueTwo);
});

Then('I do not see {string} in the account details table', (valueOne: string) => {
  cy.get('[summarylistid="accountDetails"]').should('not.contain.text', valueOne);
});
Then('I see {string} has a change link in the account details table', (value: string) => {
  cy.get('[summarylistid="accountDetails"]').contains(value).siblings().find('a').should('have.text', 'Change');
});
Then('I click the {string} change link in the account details table', (row: string) => {
  cy.get('[summarylistrowid="languagePreferences"]')
    .contains(row)
    .siblings()
    .find('a')
    .should('have.text', 'Change')
    .click();
});
