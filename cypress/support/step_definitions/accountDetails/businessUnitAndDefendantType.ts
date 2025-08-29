import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see {string} as the caption on the page', (bodyCaption) => {
  cy.get('[class="govuk-caption-l"]').should('contain', bodyCaption);
});

When('I see {string} message on the business unit', (message: string) => {
  cy.get('p').should('contain.text', message);
});

Then('I see {string} section on the page', (sectionName: string) => {
  cy.get('[describedby="defendantTypeHint"]').should('contain.text', sectionName);
});

Then('I see {string} on the defendant type header', (defendantTypeHeader: string) => {
  cy.get('#defendantTypeHint').should('contain.text', defendantTypeHeader);
});
Then('I check and verify radio buttons', () => {
  cy.get('[type="radio"]').should('have.length', '3');
  cy.get('input').invoke('attr', 'radio').log;
  cy.get('input[id="adultOrYouthOnly"]').check().should('be.checked');
  cy.get('input[id="pgToPay"]').check().should('be.checked');
  cy.get('input[id="company"]').check().should('be.checked');
});

Then('I click on continue button', () => {
  cy.get('#submitForm').click();
});

// When('I select radio button {string}', (radioButton: string) => {
//   switch (radioButton) {
//     case 'adultOrYouthOnly': {
//       cy.get('#adultOrYouthOnly').check(radioButton);
//       break;
//     }
//     case 'pgToPay': {
//       cy.get('input[id="pgToPay"]').check().should('be.checked');
//       break;
//     }
//     case 'company': {
//       cy.get('input[id="company"]').check().should('be.checked');
//       break;
//     }
//   }
// });

Then('I verify the error {string}', (errorMessage: string) => {
  cy.get('h2').should('have.text', errorMessage);
});
When('I select adults and youth only', () => {
  cy.get('input[id="adultOrYouthOnly"]').check().should('be.checked');
});
When('I select parent or guardian to pay', () => {
  cy.get('input[id="pgToPay"]').check().should('be.checked');
});
When('I select company', () => {
  cy.get('input[id="company"]').check().should('be.checked');
});
Then('I verify if adults and youth only checked', () => {
  cy.get('input[id="adultOrYouthOnly"]').should('be.checked');
});
Then('I verify if parent or guardian to pay checked', () => {
  cy.get('input[id="pgToPay"]').should('be.checked');
});
Then('I verify company radio button checked', () => {
  cy.get('input[id="company"]').should('be.checked');
});
