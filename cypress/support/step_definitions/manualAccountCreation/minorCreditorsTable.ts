import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

const verifyMinorCreditorDetails = (
  summary: Cypress.Chainable<JQuery<HTMLElement>>,
  details: { [key: string]: string },
) => {
  const detailKeys: { [key: string]: string } = {
    'Minor creditor': 'h2',
    Address: 'dt',
    'Payment method': 'dt',
    'Account name': 'dt',
    'Sort code': 'dt',
    'Account number': 'dt',
    'Payment reference': 'dt',
  };

  Object.keys(detailKeys).forEach((key) => {
    if (details[key]) {
      const element = detailKeys[key];
      if (element === 'h2') {
        summary.get(element).should('contain', details[key]);
      } else {
        summary.get(element).contains(element, key).next().should('contain', details[key]);
      }
    }
  });
};

Then('I see the following Minor creditor details for impostion {int}:', (index: number, dataTable: DataTable) => {
  const details = dataTable.rowsHash();
  const summary = cy
    .contains('legend', 'Impositions')
    .parent()
    .find('opal-lib-moj-ticket-panel')
    .eq(index - 1)
    .find('app-fines-mac-offence-details-minor-creditor-information');

  verifyMinorCreditorDetails(summary, details);
});

Then('I do not see the Minor creditor details for impostion {int}', (index: number, dataTable: DataTable) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('opal-lib-moj-ticket-panel')
    .eq(index - 1)
    .find('app-fines-mac-offence-details-minor-creditor-information')
    .should('not.exist');
});

Then('I see the following Minor creditor details:', (dataTable: DataTable) => {
  const details = dataTable.rowsHash();
  const summary = cy.get('app-fines-mac-offence-details-minor-creditor-information');

  verifyMinorCreditorDetails(summary, details);
});
