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

// a step definition for "When I intercept the account search API call for individuals"
When('I intercept the account search API call for individuals', () => {
  cy.intercept('POST', '**/opal-fines-service/defendant-accounts/search', (req) => {
    // just alias the request and let it continue without hitting backend
    req.reply({ statusCode: 200, body: {} });
  }).as('getDefendantAccounts');
});

/*
Then('the intercepted API call for individuals contains the following parameters:', (table: DataTable) => {
  const expectedParams = table.rowsHash();

  // map feature file keys → API payload keys (inside defendant)
  const keyMapping: Record<string, string> = {
    lastName: 'surname',
    lastNameExact: 'exact_match_surname',
    firstNames: 'forenames',
    firstNamesExact: 'exact_match_forenames',
    dateOfBirth: 'birth_date',
    nationalInsuranceNumber: 'national_insurance_number',
    addressLine1: 'address_line_1',
    postcode: 'postcode',
    includeAliases: 'include_aliases',
  };

  cy.wait('@getDefendantAccounts').then((interception) => {
    const body = interception.request.body;
    const defendant = body.defendant || {};
    console.log('Intercepted body:', body);

    Object.entries(expectedParams).forEach(([gherkinKey, expectedValue]) => {
      const apiKey = keyMapping[gherkinKey] ?? gherkinKey;
      const actualValue = defendant[apiKey];

      if (expectedValue) {
        expect(String(actualValue)).to.equal(String(expectedValue));
      } else {
        expect(actualValue).to.be.undefined;
      }
    });
  });
});*/

// step definition for "I intercept the account search API call for companies" and another step definition for "the intercepted API call for companies contains the following parameters:"
When('I intercept the account search API call', () => {
  // Intercept Defendant Accounts search
  cy.intercept('POST', '**/opal-fines-service/defendant-accounts/search', (req) => {
    req.reply({ statusCode: 200, body: {} });
  }).as('getDefendantAccounts');
});

When('I intercept the minor creditor search API call', () => {
  cy.intercept('POST', '**/opal-fines-service/minor-creditor-accounts/search', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        // Only include the key the frontend expects
        minorCreditorType: null,
      },
    });
  }).as('getMinorCreditorAccounts');
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

Then('the intercepted API call for search account contains the following parameters:', (table: DataTable) => {
  const expectedParams = table.rowsHash();

  const requestMapping: Record<string, { key: string; topLevel?: boolean }> = {
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
  };

  cy.wait('@getDefendantAccounts').then((interception) => {
    const body = interception.request.body;
    // Support both API structures
    const entity = body.defendant || body.creditor || {};
    console.log('Intercepted body:', JSON.stringify(body, null, 2));

    Object.entries(expectedParams).forEach(([gherkinKey, expectedValue]) => {
      const mapping = requestMapping[gherkinKey];
      if (!mapping) {
        throw new Error(`No mapping found for feature key: ${gherkinKey}`);
      }

      const actualValue = mapping.topLevel ? body[mapping.key] : entity[mapping.key];
      const expected = expectedValue === 'null' ? null : expectedValue;

      if (expected !== null && expected !== undefined) {
        expect(String(actualValue)).to.equal(String(expected));
      } else {
        expect(actualValue).to.be.null;
      }
    });
  });
});

Then('the intercepted Minor Creditor API search call contains the following parameters:', (table: DataTable) => {
  const expectedParams = table.rowsHash();

  const requestMapping: Record<string, { key: string; topLevel?: boolean }> = {
    // Top-level parameters
    activeAccountsOnly: { key: 'active_accounts_only', topLevel: true },
    accountNumber: { key: 'account_number', topLevel: true },
    businessUnitIds: { key: 'business_unit_ids', topLevel: true },

    // Creditor parameters
    organisation: { key: 'organisation' },
    organisationName: { key: 'organisation_name' },
    organisationNameExact: { key: 'exact_match_organisation_name' },
    lastName: { key: 'surname' },
    firstNames: { key: 'forenames' },
    exactFirstNames: { key: 'exact_match_forenames' },
    exactLastName: { key: 'exact_match_surname' },
    addressLine1: { key: 'address_line_1' },
    postcode: { key: 'postcode' },
  };

  cy.wait('@getMinorCreditorAccounts').then((interception) => {
    const body = interception.request.body;
    const creditor = body.creditor || {};
    console.log('Intercepted Minor Creditor body:', JSON.stringify(body, null, 2));

    Object.entries(expectedParams).forEach(([gherkinKey, expectedValue]) => {
      const mapping = requestMapping[gherkinKey];
      if (!mapping) {
        throw new Error(`No mapping found for feature key: ${gherkinKey}`);
      }

      const actualValue = mapping.topLevel ? body[mapping.key] : creditor[mapping.key];

      // Convert "null" string to actual null for comparison
      const expected = expectedValue === 'null' ? null : expectedValue;

      if (expected !== null && expected !== undefined) {
        // Handle arrays like businessUnitIds
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

/*Then('the intercepted API call for search account contains the following parameters:', (table: DataTable) => {
  const expectedParams = table.rowsHash();

  const requestMapping: Record<string, string> = {
    addressLine1: 'address_line_1',
    dateOfBirth: 'birth_date',
    firstNamesExact: 'exact_match_forenames',
    organisationName: 'organisation_name',
    lastNameExact: 'exact_match_surname',
    includeAliases: 'include_aliases',
    nationalInsuranceNumber: 'national_insurance_number',
    companyName: 'organisation_name',         
    companyNameExact: 'exact_match_organisation_name',
    lastName: 'surname',    
    firstNames: 'forenames', 
    postcode: 'postcode',
  };
  
  cy.wait('@getDefendantAccounts').then((interception) => {
    const body = interception.request.body;
    const defendant = body.defendant || {};
    console.log('Intercepted body:', JSON.stringify(defendant, null, 2));

    Object.entries(expectedParams).forEach(([gherkinKey, expectedValue]) => {
      const apiKey = requestMapping[gherkinKey];

      if (!apiKey) {
        throw new Error(`No mapping found for feature key: ${gherkinKey}`);
      }

      const actualValue = defendant[apiKey];

      // Always compare as string; handle null explicitly
      if (expectedValue !== null && expectedValue !== undefined) {
        expect(String(actualValue)).to.equal(String(expectedValue));
      } else {
        expect(actualValue).to.be.null;
      }
    });
  });
});*/
