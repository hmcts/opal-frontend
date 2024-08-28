import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I select {string} from the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('app-govuk-select', dropdown, { matchCase: false }).find('select').select(option);
});
Then('I see {string} selected in the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('app-govuk-select', dropdown, { matchCase: false }).find('select').should('have.value', option);
});
