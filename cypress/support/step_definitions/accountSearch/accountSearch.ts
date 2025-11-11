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
    case 'reference':
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

//Helper method
const parseVal = (v: unknown) => {
  if (v == null) return v;
  if (Array.isArray(v)) return v;
  if (typeof v !== 'string') return v;

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
  expectCommonTop(body, expected);
  expect(body.defendant, 'defendant').to.equal(parseVal(expected['defendant']));
  expect(body.reference_number, 'reference_number').to.be.an('object');
  expect(body.reference_number.account_number, 'reference_number.account_number').to.equal(
    parseVal(expected['account_number']),
  );
  expect(body.reference_number.prosecutor_case_reference, 'reference_number.prosecutor_case_reference').to.equal(
    parseVal(expected['prosecutor_case_reference']),
  );
  expect(body.reference_number.organisation, 'reference_number.organisation').to.equal(expectedOrganisation);
};

const verifyMinorCreditorBody = (body: any, expected: Record<string, any>) => {
  expectCommonTop(body, expected);
  expect(body.account_number, 'account_number').to.equal(String(expected['account_number']));
  if ('prosecutor_case_reference' in expected && 'prosecutor_case_reference' in body) {
    expect(body.prosecutor_case_reference, 'prosecutor_case_reference').to.equal(
      parseVal(expected['prosecutor_case_reference']),
    );
  }
  if ('creditor' in expected) {
    expect(body.creditor, 'creditor').to.equal(parseVal(expected['creditor']));
  }
};

/**
 * grabs both defendant calls
 * and asserts one has org=false, the other org=true
 */
Then('the intercepted defendant search calls contain expected parameters', (table: DataTable) => {
  const expected = table.rowsHash();

  cy.wait(['@defendantSearch', '@defendantSearch']).then((defs: any[]) => {
    const bodies = defs.map((d) => d.request.body);
    console.log('Defendant bodies:', JSON.stringify(bodies, null, 2));

    expect(bodies, 'Should have 2 defendant calls').to.have.length(2);

    const orgFalse = bodies.find((b) => b.reference_number?.organisation === false);
    const orgTrue = bodies.find((b) => b.reference_number?.organisation === true);

    expect(orgFalse, 'Expected a defendant call with organisation=false').to.exist;
    expect(orgTrue, 'Expected a defendant call with organisation=true').to.exist;

    verifyDefendantBody(orgFalse, expected, false);
    verifyDefendantBody(orgTrue, expected, true);
  });
});

// Verify minor creditor body
Then('the intercepted minor creditor search call contains', (table: DataTable) => {
  const expected = table.rowsHash();

  cy.wait('@minorCreditorSearch').should((m) => {
    const b = m.request.body;
    console.log('minor creditor body:', JSON.stringify(b));
    verifyMinorCreditorBody(b, expected);
  });
});
