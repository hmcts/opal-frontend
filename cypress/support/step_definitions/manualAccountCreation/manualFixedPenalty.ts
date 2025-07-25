import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I enter {string} into the Issuing Authority search box', (issuingAuthority: string) => {
  cy.get('#fm_fp_court_details_issuing_authority_id-autocomplete').type(issuingAuthority);
  cy.get('.autocomplete__option').should('not.contain', 'No results found');
  cy.get('#fm_fp_court_details_issuing_authority_id-autocomplete').type('{downArrow}{enter}');
});

Then('I enter {string} into the Enforcement court search box', (enforcementCourt: string) => {
  cy.get('#fm_fp_court_details_imposing_court_id-autocomplete').type(enforcementCourt);
  cy.get('.autocomplete__option').should('not.contain', 'No results found');
  cy.get('#fm_fp_court_details_imposing_court_id-autocomplete').type('{downArrow}{enter}');
});

Then('I enter {string} into the Amount imposed field', (value: string) => {
  cy.get('#fm_fp_offence_details_amount_imposed').type(value);
});

Then('I see {string} in the Amount imposed field', (value: string) => {
  cy.get('#fm_fp_offence_details_amount_imposed').should('have.value', value);
});
