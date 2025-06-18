import { DataTable, When } from '@badeball/cypress-cucumber-preprocessor';
import _ from 'lodash';
import { getDaysAgo } from '../../../utils/dateUtils';

type DefendantType = 'company' | 'adultOrYouthOnly' | 'parentOrGuardianToPay';

let approvedAccounts: any[] = [];

/**
 * Get the appropriate payload file name based on the account type
 */
function getPayloadFileForApprovedAccountType(accountType: DefendantType): string {
  const payloadFiles = {
    company: 'approvedCompanyPayload.json',
    adultOrYouthOnly: 'approvedAccountPayload.json',
    parentOrGuardianToPay: 'approvedParentOrGuardianPayload.json',
  };
  return payloadFiles[accountType];
}

/**
 * Convert DataTable to a nested object with properly parsed values
 */
function convertDataTableToNestedObject(dataTable: DataTable): Record<string, any> {
  const overrides: Record<string, any> = {};

  const rows = dataTable.rowsHash();

  for (const [path, value] of Object.entries(rows)) {
    let parsedValue: any = value;

    try {
      parsedValue = JSON.parse(value);
    } catch (e) {
    }
    _.set(overrides, path, parsedValue);
  }
  return overrides;
}

/**
 * Process fixture to replace any date function placeholders with actual dates
 */
function processDateFunctions(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const result: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    let value = obj[key];

    if (typeof value === 'string' && value.startsWith('getDaysAgo')) {
      // Extract the number from the function call, e.g., "getDaysAgo(3)" -> 3
      const match = value.match(/getDaysAgo\((\d+)\)/);
      if (match) {
        const days = parseInt(match[1], 10);
        value = getDaysAgo(days);
      }
    } else if (typeof value === 'object' && value !== null) {
      value = processDateFunctions(value);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Creates a mock approved account with the specified account type and details
 * Similar to the regular draft account creation but mocks the API instead
 */
When('I create a {string} approved draft account with the following details:', (accountType: DefendantType, data: DataTable) => {
  const overrides = convertDataTableToNestedObject(data);

  // Load the appropriate base payload for this account type
  const payloadFile = getPayloadFileForApprovedAccountType(accountType);
  cy.fixture(`draftAccounts/${payloadFile}`).then((accountData) => {

    const requestBody = _.merge({}, accountData, overrides);

    // Process any date function placeholders
    const processedBody = processDateFunctions(requestBody);
    
    // Ensure each account has a unique ID
    if (approvedAccounts.length > 0) {
      processedBody.draft_account_id = approvedAccounts[approvedAccounts.length - 1].draft_account_id + 1;
    }
    approvedAccounts.push(processedBody);

    cy.intercept('GET', '**/opal-fines-service/draft-accounts?**status=Published**', {
      statusCode: 200,
      body: {
        count: approvedAccounts.length,
        summaries: approvedAccounts
      },
    }).as('getApprovedAccount');
  });
});

beforeEach(() => {
  approvedAccounts = [];
});

/**
 * Helper step to clear all existing approved accounts
 */
When('I clear all approved draft accounts', () => {
  approvedAccounts = [];
  cy.intercept('GET', '**/opal-fines-service/draft-accounts?**status=Published**', {
    statusCode: 200,
    body: {
      count: 0,
      summaries: []
    },
  }).as('getApprovedAccount');
});

