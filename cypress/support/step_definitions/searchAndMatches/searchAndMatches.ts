import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Add any specific steps needed for the SearchAndMatches feature here
Then('I navigate to Search For An Account', () => {
  cy.contains('a', 'Search for an account').click();
  cy.contains('h1', 'Search for an account').should('be.visible');
});

Then('I see the {string} checkbox is checked', (checkboxName: string) => {
  cy.get('input[type="checkbox"]').next().contains('label', checkboxName).prev().should('be.checked');
});

Then('I see the {string} checkbox is unchecked', (checkboxName: string) => {
  cy.get('input[type="checkbox"]').next().contains('label', checkboxName).prev().should('not.be.checked');
});

When('I select the last name exact match checkbox', () => {
  cy.get('#fsa_search_account_individuals_last_name_exact_match').check({ force: true });
});

When('I select the first names exact match checkbox', () => {
  cy.get('#fsa_search_account_individuals_first_names_exact_match').check({ force: true });
});

When('I select the company name exact match checkbox', () => {
  cy.get('#fsa_search_account_companies_company_name_exact_match').check({ force: true });
});

When('I select the include alias checkbox', () => {
  cy.get('#fsa_search_account_companies_include_aliases').check({ force: true });
});

Then('I verify the last name exact match checkbox is checked', () => {
  cy.get('#fsa_search_account_individuals_last_name_exact_match').should('be.checked');
});

Then('I verify the last name exact match checkbox is not checked', () => {
  cy.get('#fsa_search_account_individuals_last_name_exact_match').should('not.be.checked');
});

Then('I verify the first names exact match checkbox is checked', () => {
  cy.get('#fsa_search_account_individuals_first_names_exact_match').should('be.checked');
});

Then('I verify the first names exact match checkbox is not checked', () => {
  cy.get('#fsa_search_account_individuals_first_names_exact_match').should('not.be.checked');
});

Then('I verify the company name exact match checkbox is checked', () => {
  cy.get('#fsa_search_account_companies_company_name_exact_match').should('be.checked');
});

Then('I verify the company name exact match checkbox is not checked', () => {
  cy.get('#fsa_search_account_companies_company_name_exact_match').should('not.be.checked');
});

Then('I verify the include alias checkbox is checked', () => {
  cy.get('#fsa_search_account_companies_company_name_exact_match').should('be.checked');
});

Then('I verify the include alias checkbox is not checked', () => {
  cy.get('#fsa_search_account_companies_company_name_exact_match').should('not.be.checked');
});