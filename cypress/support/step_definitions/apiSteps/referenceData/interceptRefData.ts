import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I intercept reference data for offence details', () => {
  // Intercept major creditor reference data as a list
  cy.fixture('referenceData/majorCreditorRefData.json').then((majorCreditorData) => {
    cy.intercept('GET', '/opal-fines-service/major-creditors?*', majorCreditorData).as('getMajorCreditorRefData');
  });

  // Intercept imposition reference data
  cy.fixture('referenceData/impositionRefData.json').then((impositionData) => {
    cy.intercept('GET', '/opal-fines-service/results?*', impositionData).as('getImpositionRefData');
  });

  // Intercept offence reference data by code
  cy.fixture('referenceData/offenceRefData.json').then((offenceData) => {
    offenceData.refData.forEach((offence: any) => {
      cy.intercept('GET', `/opal-fines-service/offences?q=${offence.offence_cjs_code}`, {
        count: 1,
        refData: [offence],
      }).as(`getOffenceByCjsCode${offence.offence_cjs_code}`);
    });
    cy.intercept('GET', '/opal-fines-service/offences?*', offenceData).as('getOffenceRefData');
  });
});

Then('all reference data should be loaded', () => {
  cy.wait('@getMajorCreditorRefData').its('response.statusCode').should('eq', 200);
  cy.wait('@getImpositionRefData').its('response.statusCode').should('eq', 200);
  cy.wait('@getOffenceRefData').its('response.statusCode').should('eq', 200);
});
