import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I insert the OPAL test data', () => {
  cy.task('runSql', { file: 'cypress/fixtures/insert_into_defendants.sql' });
});
