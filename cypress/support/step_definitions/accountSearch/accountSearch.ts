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
    case 'account number': {
      let defCount = 0;

      cy.intercept('**/opal-fines-service/defendant-accounts/search', (req) => {
        req.reply((res) => {
          defCount += 1;
          console.log(`defendantSearch #${defCount} →`, {
            status: res.statusCode,
            requestBody: req.body,
            responseBody: res.body,
          });
        });
      }).as('defendantSearch');

      cy.intercept('**/opal-fines-service/minor-creditor-accounts/search', (req) => {
        req.reply((res) => {
          console.log('minorCreditorSearch →', {
            status: res.statusCode,
            requestBody: req.body,
            responseBody: res.body,
          });
        });
      }).as('minorCreditorSearch');

      // handled here; skip the generic single-intercept logic below
      return;
    }
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

const parseVal = (v: unknown) => {
  if (v == null) return v; // null/undefined as-is
  if (Array.isArray(v)) return v; // already array
  if (typeof v !== 'string') return v; // numbers/booleans as-is

  const t = v.trim();
  if (t === 'null') return null;
  if (t === 'true') return true;
  if (t === 'false') return false;

  // JSON (array/object)
  if ((t.startsWith('[') && t.endsWith(']')) || (t.startsWith('{') && t.endsWith('}'))) {
    try {
      return JSON.parse(t);
    } catch {}
  }

  // number-like string
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);

  return v;
};

const getActiveOnlyFromTable = (expected: Record<string, any>) =>
  parseVal(expected['active_accounts_only'] ?? expected['activeAccountsOnly']);

const expectCommonTop = (body: any, expected: Record<string, any>) => {
  const expUnits = parseVal(expected['business_unit_ids']);
  const expActiveOnly = getActiveOnlyFromTable(expected);

  expect(body, 'request body should exist').to.be.an('object');

  expect(body.active_accounts_only, `active_accounts_only (got ${JSON.stringify(body.active_accounts_only)})`).to.equal(
    expActiveOnly,
  );

  expect(body.business_unit_ids, `business_unit_ids (got ${JSON.stringify(body.business_unit_ids)})`).to.deep.equal(
    expUnits,
  );
};

const verifyDefendantBody = (body: any, expected: Record<string, any>, expectedOrganisation: boolean) => {
  // top-level
  expectCommonTop(body, expected);
  expect(body.defendant, 'defendant').to.equal(parseVal(expected['defendant']));

  // nested reference_number
  expect(body.reference_number, 'reference_number').to.be.an('object');
  expect(body.reference_number.account_number, 'reference_number.account_number').to.equal(
    String(expected['account_number']),
  );
  expect(body.reference_number.prosecutor_case_reference, 'reference_number.prosecutor_case_reference').to.equal(
    parseVal(expected['prosecutor_case_reference']),
  );
  expect(body.reference_number.organisation, 'reference_number.organisation').to.equal(expectedOrganisation);
};

const verifyMinorCreditorBody = (body: any, expected: Record<string, any>) => {
  // top-level
  expectCommonTop(body, expected);
  expect(body.account_number, 'account_number').to.equal(String(expected['account_number']));
  if ('prosecutor_case_reference' in expected) {
    // check only if you list it in the table and API returns it
    if ('prosecutor_case_reference' in body) {
      expect(body.prosecutor_case_reference, 'prosecutor_case_reference').to.equal(
        parseVal(expected['prosecutor_case_reference']),
      );
    }
  }
  if ('creditor' in expected) {
    expect(body.creditor, 'creditor').to.equal(parseVal(expected['creditor']));
  }
};

Then('the intercepted defendant search call #1 contains', (table: DataTable) => {
  const expected = table.rowsHash();

  cy.wait('@defendantSearch').should((def1) => {
    const b = def1.request.body;
    console.log('defendant #1 body:', JSON.stringify(b));
    //organisation false for first call
    verifyDefendantBody(b, expected, false);
  });
});

// Second defendant call
Then('the intercepted defendant search call #2 contains', (table: DataTable) => {
  const expected = table.rowsHash();

  cy.wait('@defendantSearch').should((def2) => {
    const b = def2.request.body;
    console.log('defendant #2 body:', JSON.stringify(b));
    //organisation true for second call
    verifyDefendantBody(b, expected, true);
  });
});

//Minor creditor call
Then('the intercepted minor creditor search call contains', (table: DataTable) => {
  const expected = table.rowsHash();

  cy.wait('@minorCreditorSearch').should((m) => {
    const b = m.request.body;
    console.log('minor creditor body:', JSON.stringify(b));
    verifyMinorCreditorBody(b, expected);
  });
});
