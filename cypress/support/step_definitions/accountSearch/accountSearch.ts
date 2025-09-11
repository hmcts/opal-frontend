import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I populate the form with the following search criteria', (table: DataTable) => {
  const searchCriteria = table.rowsHash();

  if (searchCriteria['court']) {
    cy.get('#court-autocomplete').type(searchCriteria['court']);
    cy.get('#court-autocomplete__listbox').should('not.contain', 'No results found');
    cy.get('#court-autocomplete').type('{downArrow}{enter}');
  }

  function typeIfNotBlank(selector: string, value: string) {
    if (value) {
      cy.get(selector).type(value);
    }
  }
  typeIfNotBlank('#surname', searchCriteria['surname']);
  typeIfNotBlank('#forename', searchCriteria['forename']);
  typeIfNotBlank('#initials', searchCriteria['initials']);
  typeIfNotBlank('#dayOfMonth', searchCriteria['dobDay']);
  typeIfNotBlank('#monthOfYear', searchCriteria['dobMonth']);
  typeIfNotBlank('#year', searchCriteria['dobYear']);
  typeIfNotBlank('#addressLine', searchCriteria['addrLn1']);
  typeIfNotBlank('#niNumber', searchCriteria['niNumber']);
  typeIfNotBlank('#pcr', searchCriteria['pcr']);
});

Then('I see an Object logged in the console containing', (/*table: DataTable*/) => {
  //const expectedResponse = table.rowsHash()
  //cant get json object from console using cypress
});

When('I see the form contains the following search criteria', (table: DataTable) => {
  const searchCriteria = table.rowsHash();

  if (searchCriteria['court'] != '') {
    cy.get('#court-autocomplete').should('have.value', searchCriteria['court']);
  } else
    () => {
      cy.get('#court').should('have.value', null);
    };

  function assertValueIsCorrect(selector: string, value: string) {
    if (value) {
      cy.get(selector).should('have.value', value);
    } else {
      cy.get(selector).should('have.value', '');
    }
  }
  assertValueIsCorrect('#surname', searchCriteria['surname']);
  assertValueIsCorrect('#forename', searchCriteria['forename']);
  assertValueIsCorrect('#initials', searchCriteria['initials']);
  assertValueIsCorrect('#dayOfMonth', searchCriteria['dobDay']);
  assertValueIsCorrect('#monthOfYear', searchCriteria['dobMonth']);
  assertValueIsCorrect('#year', searchCriteria['dobYear']);
  assertValueIsCorrect('#addressLine', searchCriteria['addrLn1']);
  assertValueIsCorrect('#niNumber', searchCriteria['niNumber']);
  assertValueIsCorrect('#pcr', searchCriteria['pcr']);
});

When('I click the clear button', () => {
  cy.get('#clearForm').click();
});

When('I click the search button', () => {
  cy.get('#submitForm').click();
});

When('I intercept the {string} account search API call', (accountType) => {
  let urlPattern;
  let aliasName;
  let mockResponse;

  switch (accountType) {
    case 'defendant':
      urlPattern = '**/opal-fines-service/defendant-accounts/search';
      aliasName = 'getDefendantAccounts';
      mockResponse = {};
      break;

    case 'minor creditor':
      urlPattern = '**/opal-fines-service/minor-creditor-accounts/search';
      aliasName = 'getMinorCreditorAccounts';
      mockResponse = { minorCreditorType: null };
      break;

    default:
      throw new Error(`Unknown account type: ${accountType}`);
  }

  cy.intercept('POST', urlPattern, (req) => {
    req.reply({
      statusCode: 200,
      body: mockResponse,
    });
  }).as(aliasName);
});

Then(
  'the intercepted {string} account search API call contains the following parameters:',
  (accountType: string, table: DataTable) => {
    const expectedParams = table.rowsHash();
    const type = accountType.toLowerCase();

    // Define request mappings per account type
    const mappings: Record<string, Record<string, { key: string; topLevel?: boolean }>> = {
      defendant: {
        addressLine1: { key: 'address_line_1' },
        dateOfBirth: { key: 'birth_date' },
        firstNamesExact: { key: 'exact_match_forenames' },
        organisationName: { key: 'organisation_name' },
        lastNameExact: { key: 'exact_match_surname' },
        includeAliases: { key: 'include_aliases' },
        nationalInsuranceNumber: { key: 'national_insurance_number' },
        companyName: { key: 'organisation_name' },
        companyNameExact: { key: 'exact_match_organisation_name' },
        lastName: { key: 'surname' },
        firstNames: { key: 'forenames' },
        postcode: { key: 'postcode' },
        activeAccountsOnly: { key: 'active_accounts_only', topLevel: true },
      },
      'minor creditor': {
        activeAccountsOnly: { key: 'active_accounts_only', topLevel: true },
        accountNumber: { key: 'account_number', topLevel: true },
        businessUnitIds: { key: 'business_unit_ids', topLevel: true },
        organisation: { key: 'organisation' },
        organisationName: { key: 'organisation_name' },
        organisationNameExact: { key: 'exact_match_organisation_name' },
        lastName: { key: 'surname' },
        firstNames: { key: 'forenames' },
        exactFirstNames: { key: 'exact_match_forenames' },
        exactLastName: { key: 'exact_match_surname' },
        addressLine1: { key: 'address_line_1' },
        postcode: { key: 'postcode' },
      },
    };

    const alias = type === 'defendant' ? '@getDefendantAccounts' : '@getMinorCreditorAccounts';
    const entityKey = type === 'defendant' ? 'defendant' : 'creditor';

    cy.wait(alias).then((interception) => {
      const body = interception.request.body;
      const entity = body[entityKey] || {};

      console.log(`Intercepted ${accountType} body:`, JSON.stringify(body, null, 2));

      const requestMapping = mappings[type];
      Object.entries(expectedParams).forEach(([gherkinKey, expectedValue]) => {
        const mapping = requestMapping[gherkinKey];
        if (!mapping) {
          throw new Error(`No mapping found for feature key: ${gherkinKey}`);
        }

        const actualValue = mapping.topLevel ? body[mapping.key] : entity[mapping.key];
        const expected = expectedValue === 'null' ? null : expectedValue;

        if (expected !== null && expected !== undefined) {
          if (Array.isArray(actualValue) && typeof expectedValue === 'string') {
            expect(actualValue).to.deep.equal(JSON.parse(expectedValue));
          } else {
            expect(String(actualValue)).to.equal(String(expected));
          }
        } else {
          expect(actualValue).to.be.null;
        }
      });
    });
  },
);
