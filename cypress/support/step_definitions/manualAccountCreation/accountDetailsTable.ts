import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';
import { formatDateString, calculateWeeksInFuture, calculateWeeksInPast } from '../../../support/utils/dateUtils';

Then('I see the business unit is {string}', (businessUnit: string) => {
  cy.get('#accountDetailsBusinessUnitValue').should('contain.text', businessUnit);
});
Then('I see the defendant type is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('contain.text', defendantType);
});
Then('I see the document language is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the hearing language is {string}', (defendantType: string) => {
  cy.get('#accountDetailsDefendantTypeValue').should('have.text', defendantType);
});
Then('I see the {string} is {string} in the account details table', (key: string, value: string) => {
  cy.get('[summarylistid="accountDetails"]')
    .contains(key)
    .next('[summarylistid="accountDetails"] > dd')
    .should('have.text', value);
});

Then('I see {string} below {string} in the account details table', (valueOne: string, valueTwo: string) => {
  cy.get('[summarylistid="accountDetails"]')
    .contains(valueOne)
    .parent()
    .prev('[summarylistid="accountDetails"]')
    .children('dt')
    .should('have.text', valueTwo);
});

Then('I do not see {string} in the account details table', (valueOne: string) => {
  cy.get('[summarylistid="accountDetails"]').should('not.contain.text', valueOne);
});
Then('I see {string} has a change link in the account details table', (value: string) => {
  cy.get('[summarylistid="accountDetails"]').contains(value).siblings().find('a').should('have.text', 'Change');
});
Then('I click the {string} change link in the account details table', (row: string) => {
  cy.get('[summarylistrowid="languagePreferences"]')
    .contains(row)
    .siblings()
    .find('a')
    .should('have.text', 'Change')
    .click();
});

Then('I see the following in the {string} table:', (tableName: string, dataTable: DataTable) => {
  const expectedRows = dataTable.raw();

  expectedRows.forEach((row) => {
    const [key, value] = row;
    const tableSelector = cy
      .get(`h2.govuk-summary-card__title`)
      .contains(tableName)
      .parentsUntil('app-govuk-summary-card-list');

    if (tableName === 'Offences and impositions') {
      tableSelector
        .find('app-fines-mac-offence-details-review-offence-heading-title')
        .find('span')
        .should('have.text', value);
    } else if (tableName === 'Payment terms' && key === 'Date of collection order') {
      const weeksInPast: number = parseInt(value.split(' ')[0], 10);
      tableSelector
        .contains('dt', key)
        .next()
        .should('have.text', formatDateString(calculateWeeksInPast(weeksInPast)));
    } else if (tableName === 'Payment terms' && key === 'Pay by date') {
      const weeksInFuture: number = parseInt(value.split(' ')[0], 10);
      tableSelector
        .contains('dt', key)
        .next()
        .should('have.text', formatDateString(calculateWeeksInFuture(weeksInFuture)));
    } else {
      tableSelector
        .contains('dt', key)
        .next()
        .invoke('text')
        .then((actualText) => {
          expect(actualText.trim()).to.equal(value);
        });
    }
  });
});
Then('I do not see the {string} table', (tableName: string) => {
  cy.get(`h2.govuk-summary-card__title`).contains(tableName).should('not.exist');
});
Then('I click on the {string} link in the {string} table', (linkName: string, tableName: string) => {
  cy.get(`h2.govuk-summary-card__title`)
    .contains(tableName)
    .parentsUntil('app-govuk-summary-card-list')
    .contains('a', linkName)
    .click();
});
