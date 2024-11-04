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
Then('I click on the {string} link for imposition {int}', (linkText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains('a', linkText)
    .click();
});
Then('I see the {string} link for imposition {int}', (linkText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains('a', linkText)
    .should('exist');
});
Then('I do not see the {string} link for imposition {int}', (linkText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains('a', linkText)
    .should('not.exist');
});
