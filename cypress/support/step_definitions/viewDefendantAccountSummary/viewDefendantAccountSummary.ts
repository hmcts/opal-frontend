import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Step to intercept the defendant account update API call so we can assert against the live amendments payload.
 */
When('I intercept the amendments API call', () => {
  cy.intercept('PATCH', '**/opal-fines-service/defendant-accounts/**', (req) => {
    console.log('defendantAccountUpdate →', {
      method: req.method,
      url: req.url,
      requestBody: req.body,
    });

    const accountIdFromUrl = req.url.split('/').pop() ?? '';
    const numericAccountId = Number(accountIdFromUrl);
    const defendantAccountId = Number.isNaN(numericAccountId) ? accountIdFromUrl : numericAccountId;
    Cypress.env('lastDefendantAccountId', defendantAccountId);

    const businessUnitHeader =
      (req.headers && (req.headers['business-unit-id'] as string | undefined)) ??
      (req.headers && (req.headers['Business-Unit-Id'] as string | undefined));
    const businessUnitIdValue = businessUnitHeader ?? null;
    const parsedBusinessUnitId =
      businessUnitIdValue === null || businessUnitIdValue === undefined
        ? null
        : Number.isNaN(Number(businessUnitIdValue))
          ? businessUnitIdValue
          : Number(businessUnitIdValue);

    if (parsedBusinessUnitId !== null && parsedBusinessUnitId !== undefined) {
      Cypress.env('lastBusinessUnitId', parsedBusinessUnitId);
    }

    req.continue((res) => {
      console.log('defendantAccountUpdate response (live) →', {
        status: res.statusCode,
        responseBody: res.body,
      });
    });
  }).as('defendantAccountUpdate');
});

/**
 * This validates all AC7 requirements for the amendments API
 */
Then('the intercepted amendments API call contains the following parameters:', (table: DataTable) => {
  const expectedParams = table.rowsHash();

  // Wait for the defendant account update call
  cy.wait('@defendantAccountUpdate').then((interception) => {
    const updateBody = interception.request.body;
    const accountId = interception.request.url.split('/').pop();
    const envAccountId = Cypress.env('lastDefendantAccountId');
    const accountIdFromUrl = accountId ?? envAccountId ?? '';

    console.log('Defendant account update body:', JSON.stringify(updateBody, null, 2));
    console.log('Account ID from URL:', accountId);

    const commentData = (updateBody as { comment_and_notes?: Record<string, unknown> }).comment_and_notes ?? {};
    const accountComment = (commentData as { account_comment?: unknown }).account_comment;
    const responseBody = interception.response?.body ?? {};
    const amendmentEntries: Array<Record<string, unknown>> = Array.isArray(
      (responseBody as { amendments?: unknown }).amendments,
    )
      ? ((responseBody as { amendments: Record<string, unknown>[] }).amendments ?? [])
      : [];
    expect(
      amendmentEntries.length,
      'PATCH /defendant-accounts response should include at least one amendment entry',
    ).to.be.greaterThan(0);
    const expectedFieldCode = expectedParams['field_code'] ?? 'ACC_COMMENT';
    const capturedAmendment =
      amendmentEntries.find((entry) => String(entry['field_code'] ?? '') === expectedFieldCode) ?? amendmentEntries[0];

    console.log('Captured amendments payload:', JSON.stringify(amendmentEntries, null, 2));

    expect(capturedAmendment, 'amendment payload from intercepted response').to.exist;
    const amendmentRecord = capturedAmendment as Record<string, unknown>;
    const requestHeaders = interception.request.headers ?? {};
    const resolveExpectedToken = (raw: string) => {
      switch (raw) {
        case 'null':
          return null;
        case 'account-id':
        case 'from-url':
          return accountIdFromUrl;
        case 'env:last-defendant-account-id':
          return envAccountId;
        case 'env:last-business-unit-id':
          return Cypress.env('lastBusinessUnitId');
        case 'request:business-unit-id':
          return (
            (requestHeaders['business-unit-id'] as string | undefined) ??
            (requestHeaders['Business-Unit-Id'] as string | undefined) ??
            null
          );
        default:
          return raw;
      }
    };

    // AC7a - amendment_id validation (auto-generated unique ID)
    if (expectedParams['amendment_id']) {
      const actualAmendmentId = amendmentRecord['amendment_id'];
      expect(actualAmendmentId, 'amendment_id should exist on amendment payload').to.exist;
      if (expectedParams['amendment_id'] === 'auto-generated') {
        expect(String(actualAmendmentId)).to.not.equal('');
      } else {
        expect(String(actualAmendmentId)).to.equal(expectedParams['amendment_id']);
      }
      console.log('AC7a VALIDATED: amendment_id should be auto-generated unique ID');
    }

    // AC7b - business_unit_id validation (from defendant account business unit)
    if (expectedParams['business_unit_id']) {
      const actualBusinessUnitId = amendmentRecord['business_unit_id'];
      const expectedBusinessUnit = resolveExpectedToken(expectedParams['business_unit_id']);
      expect(String(actualBusinessUnitId)).to.equal(String(expectedBusinessUnit));
      console.log(`AC7b VALIDATED: business_unit_id = ${actualBusinessUnitId}`);
    }

    // AC7c - associated_record_type validation
    if (expectedParams['associated_record_type']) {
      expect(String(amendmentRecord['associated_record_type'] ?? '')).to.equal(
        expectedParams['associated_record_type'],
      );
      console.log('AC7c VALIDATED: associated_record_type = "defendant account"');
    }

    // AC7d - associated_record_id validation (account ID from URL)
    if (expectedParams['associated_record_id']) {
      const expectedAssociated = resolveExpectedToken(expectedParams['associated_record_id']);
      expect(String(amendmentRecord['associated_record_id'] ?? '')).to.equal(String(expectedAssociated));
      console.log(`AC7d VALIDATED: associated_record_id = ${amendmentRecord['associated_record_id']}`);
    }

    // AC7e - amended_date validation (system date)
    if (expectedParams['amended_date']) {
      const amendmentDate = String(amendmentRecord['amended_date'] ?? '');
      expect(amendmentDate, 'amended_date should be provided').to.not.equal('');
      const dateOnly = amendmentDate.split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      if (expectedParams['amended_date'] === 'system-date') {
        expect(dateOnly).to.equal(today);
        console.log(`AC7e VALIDATED: amended_date should be system date (${today})`);
      } else {
        expect(dateOnly).to.equal(expectedParams['amended_date']);
        console.log(`AC7e VALIDATED: amended_date = ${dateOnly}`);
      }
    }

    // AC7f - amended_by validation (username from access token)
    if (expectedParams['amended_by']) {
      const amendedBy = amendmentRecord['amended_by'];
      expect(String(amendedBy)).to.equal(expectedParams['amended_by']);
      console.log(`AC7f VALIDATED: amended_by = ${amendedBy}`);
    }

    // AC7g - field_code validation (based on field being amended)
    if (expectedParams['field_code']) {
      expect(String(amendmentRecord['field_code'] ?? '')).to.equal(expectedParams['field_code']);
      console.log('AC7g VALIDATED: field_code = "ACC_COMMENT"');
    }

    // AC7h - old_value validation (value before amendment)
    if (expectedParams['old_value']) {
      const actualOldValue = amendmentRecord['old_value'] ?? null;
      if (expectedParams['old_value'] === 'null') {
        expect(actualOldValue, 'old_value should be null').to.be.null;
        console.log('AC7h VALIDATED: old_value = null (new comment)');
      } else {
        expect(String(actualOldValue ?? '')).to.equal(expectedParams['old_value']);
        console.log(`AC7h VALIDATED: old_value = ${actualOldValue}`);
      }
    }

    // AC7i - new_value validation (amended value)
    if (expectedParams['new_value']) {
      const expectedNewValue = resolveExpectedToken(expectedParams['new_value']);
      const actualNewValue = amendmentRecord['new_value'] ?? null;
      if (expectedNewValue === null) {
        expect(actualNewValue, 'new_value should be null').to.be.null;
      } else {
        expect(String(actualNewValue ?? '')).to.equal(String(expectedNewValue));
      }
      if (accountComment !== undefined && expectedNewValue !== null) {
        expect(accountComment).to.equal(expectedNewValue);
      }
      console.log(`AC7i VALIDATED: new_value = ${amendmentRecord['new_value']}`);
    }

    // AC7j - case_reference validation (should be null for manual amendments)
    if (expectedParams['case_reference']) {
      if (expectedParams['case_reference'] === 'null') {
        expect(amendmentRecord['case_reference'] ?? null, 'case_reference should be null').to.be.null;
        console.log('AC7j VALIDATED: case_reference = null (manual amendment)');
      } else {
        expect(String(amendmentRecord['case_reference'] ?? '')).to.equal(expectedParams['case_reference']);
        console.log(`AC7j VALIDATED: case_reference = ${amendmentRecord['case_reference']}`);
      }
    }

    // AC7k - function_code validation (should be 'AE' for Account Enquiry)
    if (expectedParams['function_code']) {
      expect(String(amendmentRecord['function_code'] ?? '')).to.equal(expectedParams['function_code']);
      console.log('AC7k VALIDATED: function_code = "AE" (Account Enquiry)');
    }
  });
});
