import { Then, When } from '@badeball/cypress-cucumber-preprocessor';


When('I intercept reference data for offence details', () => {
  cy.fixture('referenceData/majorCreditorRefData.json').then((majorCreditorData) => {
    cy.intercept('GET', '/opal-fines-service/creditors/major?*', majorCreditorData).as('getMajorCreditorRefData');
    
    majorCreditorData.refData.forEach((creditor: any) => {
      cy.intercept('GET', `/opal-fines-service/creditors/major/${creditor.major_creditor_id}`, creditor).as(`getMajorCreditor${creditor.major_creditor_id}`);
    });
  });

  cy.fixture('referenceData/impositionRefData.json').then((impositionData) => {
    cy.intercept('GET', '/opal-fines-service/results?*', impositionData).as('getImpositionRefData');

    impositionData.refData.forEach((result: any) => {
      cy.intercept('GET', `/opal-fines-service/results/${result.result_id}`, result).as(`getImposition${result.result_id}`);
    });
  });

  cy.fixture('referenceData/offenceRefData.json').then((offenceData) => {
    cy.intercept('GET', '/opal-fines-service/offences?*', offenceData).as('getOffenceRefData');
    
    offenceData.refData.forEach((offence: any) => {
      cy.intercept('GET', `/opal-fines-service/offences/${offence.offence_id}`, offence).as(`getOffence${offence.offence_id}`);
    });
  });
  
  cy.fixture('referenceData/offenceRefData.json').then((offenceData) => {
    offenceData.refData.forEach((offence: any) => {
      cy.intercept('GET', `/opal-fines-service/offences?q=${offence.offence_cjs_code}`, {
        count: 1,
        refData: [offence]
      }).as(`getOffenceByCjsCode${offence.offence_cjs_code}`);
    });
  });
});


