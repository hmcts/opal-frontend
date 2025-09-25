import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I navigate to View Defendant Account Details', () => {
  cy.get('#finesAccLink').should('contain', 'View Defendant Account Details').click();
});

Then('I see {string} on the page', (addAccountNoteText: string) => {
  cy.get('textarea#facc_add_notes+div').should('contains.text', addAccountNoteText);
});

Then('The text area should have a 1000 character limit', () => {
  cy.get('#facc_add_notes').should('have.attr', 'maxlength', '1000');
});

Then('I enter 1000 character into the {string} text field', (fieldName: string) => {
  const longText = 'a'.repeat(1000);
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .clear()
    .type(longText, { delay: 0 });
});

Then('I see the URL contains {string}', (urlPart: string) => {
  cy.url().should('include', urlPart);
});

Then('I verify {string} a window pops up and I click Ok', (link: string) => {
  cy.on('window:confirm', (str) => {
    expect(str).to.equal(link);
  });
});
