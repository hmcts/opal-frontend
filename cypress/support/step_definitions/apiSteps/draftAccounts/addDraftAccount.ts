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

type DefendantType = 'company' | 'adultOrYouthOnly' | 'parentOrGuardianToPay';

/**
 * Get the appropriate payload file name based on the account type
 */
function getPayloadFileForAccountType(accountType: DefendantType): string {
  const payloadFiles = {
    company: 'draftAccountPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    parentOrGuardianToPay: 'parentOrGuardianPayload.json',
  };
  return payloadFiles[accountType];
}

When('I create a {string} draft account with the following details:', (accountType: DefendantType, data: DataTable) => {
  const overrides = convertDataTableToNestedObject(data);

  // Load the appropriate base payload for this account type
  const payloadFile = getPayloadFileForAccountType(accountType);
  cy.fixture(`draftAccounts/${payloadFile}`).then((draftAccount) => {
    const requestBody = _.merge({}, draftAccount, overrides);

    cy.request('POST', 'opal-fines-service/draft-accounts', requestBody).then((response) => {
      expect(response.status).to.eq(201);
      const draftAccountId = response.body.draft_account_id;
      expect(draftAccountId).to.exist;
      createdAccounts.push(draftAccountId);
    });
  });
});

When('I update the last created draft account with status {string}', (status: string) => {
  cy.wrap(createdAccounts)
    .its(createdAccounts.length - 1)
    .then((accountId) => {
      // Fetch the current draft account to get required fields
      cy.request('GET', `opal-fines-service/draft-accounts/${accountId}`).then((getResp) => {
        const account = getResp.body;
        const business_unit_id = account.business_unit_id;
        const version = account.version;
        const validated_by = account.submitted_by || 'opal-test';
        const now = new Date().toISOString();
        const updateBody = {
          business_unit_id,
          account_status: status,
          validated_by,
          version,
          timeline_data: [
            {
              username: validated_by,
              status,
              status_date: now,
              reason_text: 'Test reason',
            },
          ],
        };
        cy.request('PATCH', `opal-fines-service/draft-accounts/${accountId}`, updateBody).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
});

afterEach(() => {
  cy.log('Createdaccount length: ' + createdAccounts.length);

  if (createdAccounts.length > 0) {
    cy.log('Cleaning up accounts: ' + createdAccounts.join(', '));
    createdAccounts.forEach((accountId) => {
      cy.request('DELETE', `/opal-fines-service/draft-accounts/${accountId}?ignoreMissing=true`);
      createdAccounts = createdAccounts.filter((id) => id !== accountId);
    });
  }
});
