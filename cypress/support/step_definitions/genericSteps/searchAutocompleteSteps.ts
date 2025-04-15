import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see {string} in the {string} searchbox', (fieldValue: string, fieldName: string) => {
  cy.contains('opal-lib-alphagov-accessible-autocomplete', fieldName, { matchCase: false })
    .find('input')
    .should('have.value', fieldValue);
});
When('I enter {string} into the {string} search box', (searchText: string, searchBox: string) => {
  cy.contains('opal-lib-alphagov-accessible-autocomplete', searchBox)
    .children('div')
    .children('div')
    .find('input')
    .clear()
    .type(searchText, { delay: 0 });
  cy.contains('opal-lib-alphagov-accessible-autocomplete', searchBox).should('not.contain', 'No results found');
  cy.contains('opal-lib-alphagov-accessible-autocomplete', searchBox)
    .children('div')
    .children('div')
    .find('input')
    .type('{downArrow}{enter}', { delay: 0 });
});

When('I see {string} under the {string} search box', (text: string, fieldName: string) => {
  cy.contains('opal-lib-alphagov-accessible-autocomplete', fieldName)
    .find('label')
    .next()
    .invoke('text')
    .should('contains', text);
});
