import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { List, forEach } from 'cypress/types/lodash';

When('I view the first result', () => {
  cy.get(':nth-child(1) > .cdk-column-view > .govuk-link').click();
});

Then('I can see {string} in the account details panel header', (panelHeader: string) => {
  cy.get('#tabsAccountPanelAccountDetails > .govuk-heading-m').should('contain', panelHeader);
});
Then('I can see {string} in the account imposition panel header', (panelHeader: string) => {
  cy.get('#tabsAccountPanelAccountImposition > .govuk-heading-m').should('contain', panelHeader);
});
Then('I can see {string} in the account history panel header', (panelHeader: string) => {
  cy.get('#tabsAccountPanelAccountHistory > .govuk-heading-m').should('contain', panelHeader);
});

When('I click the {string} tab on the account details screen', (tab: string) => {
  cy.get('#tab_tabsAccountPanelAccount' + tab).click();
});

When('I click the New Search button', () => {
  cy.get('#newSearch').click();
});

Then('the name on the details screen for the result is {string}', (name: string) => {
  cy.get('.govuk-grid-column-two-thirds > :nth-child(3)').should('contain.text', name);
});

Then('the account details are', (acDetails: DataTable) => {
  const accountDetails = acDetails.rowsHash();
  const rows: number = acDetails.raw().length;
  let index: number = 0;

  const keys = Object.keys(accountDetails);
  const values = Object.values(accountDetails);

  while (index < rows) {
    cy.get('[id*="ListRow' + keys[index] + 'Value"] > p').should('contain.text', values[index]);
    index++;
  }
});
