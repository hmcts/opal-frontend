import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I add the text {string} to the note input', (noteText: string) => {
  cy.get('#note').type(noteText);
});
When('I click the Add button', () => {
  cy.get('#submitForm').click();
});
Then('I see the text {string} under the input', (note: string) => {
  cy.get('.ng-untouched > .ng-star-inserted > .govuk-grid-column-full').contains(note);
});
Then('I can see {string} at the top of the history', (text: string) => {
  cy.get('[id*=insetText]').first().should('contain.text', text);
});
Then('I can see {string} at position {string} of the history', (text: string, position: number) => {
  cy.get('[id*=insetText]').eq(position).should('contain.text', text);
});
