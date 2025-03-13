import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import _ from 'lodash';

let createdAccounts: string[] = [];

function convertDataTableToNestedObject(dataTable: DataTable): Record<string, any> {
  const overrides: Record<string, any> = {};

  // Convert DataTable to an array of hashes
  const rows = dataTable.rowsHash();

  // Iterate over each key-value pair
  for (const [path, value] of Object.entries(rows)) {
    let parsedValue: any = value;

    // Attempt to parse JSON strings (e.g., arrays or objects)
    try {
      parsedValue = JSON.parse(value);
    } catch (e) {
      // If parsing fails, keep the value as a string
    }

    // Use Lodash's set method to assign the value at the specified path
    _.set(overrides, path, parsedValue);
  }
  return overrides;
}

When('I create a draft account with the following details:', (data: DataTable) => {
  const overrides = convertDataTableToNestedObject(data);

  cy.fixture('draftAccount.json').then((draftAccount) => {
    const requestBody = _.merge({}, draftAccount, overrides);

    cy.request('POST', 'opal-fines-service/draft-accounts', requestBody).then((response) => {
      expect(response.status).to.eq(201);
      const draftAccountId = response.body.draft_account_id;
      expect(draftAccountId).to.exist;
      createdAccounts.push(draftAccountId);
    });
  });
});
