import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I select {string} from the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('opal-lib-govuk-select', dropdown, { matchCase: false }).find('select').select(option);
});
Then('I see {string} selected in the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('opal-lib-govuk-select', dropdown, { matchCase: false }).find('select').should('have.value', option);
});
Then('I see there is no selected option in the {string} dropdown', (dropdown: string) => {
  cy.contains('opal-lib-govuk-select', dropdown, { matchCase: false }).find('select').should('have.value', null);
});
