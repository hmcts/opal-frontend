// cypress/e2e/steps/draftAccount/addDraftAccount.ts
// Creates a draft account from a DataTable payload and provides ETag-based update flows.

import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import merge from 'lodash/merge';
import set from 'lodash/set';
import _ from 'lodash';
import {
  installDraftAccountCleanup,
  recordCreatedId,
  lastCreatedIdOrFail,
  pathForAccount,
  readDraftIdFromBody,
} from '../../../../support/draftAccounts';

/** Ensure global cleanup hook is installed (safe to call multiple times). */
installDraftAccountCleanup();

/* ------------------------- type-safe body utilities ------------------------- */

/**
 * Narrow an unknown value to a plain record (object) at runtime.
 */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Read a finite number from a known property (if present) on an unknown object.
 * Returns `undefined` when the property is missing or not a finite number.
 */
function readNumber(obj: unknown, key: string): number | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

/**
 * Read a string from a known property (if present) on an unknown object.
 * Returns `undefined` when the property is missing or not a string.
 */
function readString(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Read an array from a known property (if present) on an unknown object.
 * Returns `undefined` when the property is missing or not an array.
 */
function readArray(obj: unknown, key: string): unknown[] | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return Array.isArray(v) ? v : undefined;
}

/**
 * Read and validate a **strong** (non-weak) quoted ETag from arbitrary headers.
 * Throws with a clear message if the ETag is missing, weak, or unquoted.
 */
function readStrongEtag(headers: unknown): string {
  if (!isRecord(headers)) {
    throw new Error('Response headers not an object');
  }
  const raw = headers['etag'];
  const etag = typeof raw === 'string' ? raw : undefined; // ← no assertions/casts

  if (!etag) throw new Error('Missing ETag header');
  if (etag.startsWith('W/')) throw new Error('Weak ETag received where strong ETag is required');
  if (!/^".+"$/.test(etag)) throw new Error('ETag should be quoted');

  return etag;
}

/* ------------------------ Cucumber data-table helpers ----------------------- */

/**
 * Convert a Cucumber DataTable with dot-path keys into a nested object.
 * Each cell is JSON-parsed when possible; otherwise left as a string.
 */
function convertDataTableToNestedObject(dataTable: DataTable): Record<string, unknown> {
  const overrides: Record<string, unknown> = {};
  const rows = dataTable.rowsHash();
  for (const [path, value] of Object.entries(rows)) {
    let parsed: unknown = value;
    try {
      parsed = JSON.parse(value);
    } catch {
      /* keep string */
    }
    set(overrides, path, parsed);
  }
  return overrides;
}

type DefendantType = 'company' | 'adultOrYouthOnly' | 'pgToPay';

/**
 * Resolve payload fixture filename for a given account type.
 */
function getPayloadFileForAccountType(accountType: DefendantType): string {
  return {
    company: 'companyPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    pgToPay: 'parentOrGuardianPayload.json',
  }[accountType];
}

/* --------------------------------- steps ----------------------------------- */

/**
 * GET an account and return its strong ETag + body
 */
function getAccountAndStrongEtag(id: number | string) {
  const url = pathForAccount(id);
  return cy
    .request({
      method: 'GET',
      url,
      headers: { Accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((resp) => {
      cy.log(`GET ${url} → ${resp.status}`);
      expect(resp.status, 'GET status').to.be.oneOf([200, 304]);
      expect(String(resp.headers['content-type'] || ''), 'content-type').to.include('application/json');

      // Type-safe ETag read (no assertions)
      const etag = readStrongEtag(resp.headers);
      return cy.wrap({ etag, body: resp.body }, { log: false });
    });
}

/**
 * Create a minimal valid timeline payload for PATCH when the server body has none.
 */
function timeline(username: string, status: string) {
  return [
    {
      username,
      status,
      status_date: new Date().toISOString(),
      reason_text: 'Test reason',
    },
  ];
}

// ────────────────────────────────────────────────────────────────────────────────
// Create a draft account (DataTable-driven)
// ────────────────────────────────────────────────────────────────────────────────

When('I create a {string} draft account with the following details:', (accountType: DefendantType, data: DataTable) => {
  const overrides = convertDataTableToNestedObject(data);
  const payloadFile = getPayloadFileForAccountType(accountType);

  return cy.fixture(`draftAccounts/${payloadFile}`).then((base) => {
    const requestBody = merge({}, base, overrides);

    return cy
      .request({
        method: 'POST',
        url: '/opal-fines-service/draft-accounts',
        body: requestBody,
        failOnStatusCode: false, // assert explicitly
      })
      .then((response) => {
        expect(response.status, 'POST /draft-accounts').to.eq(201);

        // Uses bracket access internally and parses to number
        const id = readDraftIdFromBody(response.body);
        recordCreatedId(id);
        cy.log(`Created draft_account_id=${id}`);
      });
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Update last created with status — capture before/after ETag
// ────────────────────────────────────────────────────────────────────────────────

type EtagUpdate = {
  status: number;
  etagBefore: string;
  etagAfter: string;
  accountId: number;
};

When('I update the last created draft account with status {string}', (newStatus: string) => {
  const id = lastCreatedIdOrFail();

  return getAccountAndStrongEtag(id).then(({ etag: beforeEtag, body }) => {
    const business_unit_id = readNumber(body, 'business_unit_id');
    const existingTimeline = readArray(body, 'timeline_data');
    const validated_by = readString(body, 'validated_by') ?? 'opal-test';

    const patchBody: Record<string, unknown> = {
      account_status: newStatus,
      business_unit_id,
      timeline_data:
        existingTimeline && existingTimeline.length > 0
          ? existingTimeline.concat(timeline('opal-test', newStatus))
          : timeline('opal-test', newStatus),
      validated_by,
    };

    return cy
      .request({
        method: 'PATCH',
        url: pathForAccount(id),
        headers: {
          'If-Match': beforeEtag,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: patchBody,
        failOnStatusCode: false,
      })
      .as('patchRequest')
      .then((patchResp) => {
        expect([200, 204], 'PATCH success').to.include(patchResp.status);

        const afterEtag = readStrongEtag(patchResp.headers);

        cy.wrap(
          {
            status: patchResp.status,
            etagBefore: beforeEtag,
            etagAfter: afterEtag,
            accountId: Number(id),
          } as EtagUpdate,
          { log: false },
        ).as('etagUpdate');
      });
  });
});

Then('the update should succeed and return a new strong ETag', () => {
  return cy.get<EtagUpdate>('@etagUpdate').then(({ status, etagBefore, etagAfter }) => {
    expect([200, 204], 'PATCH success status').to.include(status);
    expect(etagAfter.startsWith('W/'), 'Updated ETag must be strong (no W/)').to.be.false;

    if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
      expect(etagAfter, 'ETag should change after update').not.to.eq(etagBefore);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Negative: stale ETag → 409 Conflict
// ────────────────────────────────────────────────────────────────────────────────

When('I try to update the last created draft account with a stale ETag I should get a conflict', () => {
  const id = lastCreatedIdOrFail();

  return getAccountAndStrongEtag(id).then(({ etag: etag1, body }) => {
    const business_unit_id = readNumber(body, 'business_unit_id');
    const existingTimeline = readArray(body, 'timeline_data');
    const validated_by = readString(body, 'validated_by') ?? 'opal-test';

    const patchBody: Record<string, unknown> = {
      account_status: 'Publishing Pending',
      business_unit_id,
      validated_by,
      timeline_data:
        existingTimeline && existingTimeline.length > 0
          ? existingTimeline
          : timeline('opal-test', 'Publishing Pending'),
    };

    // First PATCH should succeed
    return cy
      .request({
        method: 'PATCH',
        url: pathForAccount(id),
        headers: { 'If-Match': etag1, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: patchBody,
        failOnStatusCode: false,
      })
      .then((first) => {
        expect([200, 204], 'first PATCH should succeed').to.include(first.status);

        // Second PATCH with the stale If-Match should 409
        return cy
          .request({
            method: 'PATCH',
            url: pathForAccount(id),
            headers: { 'If-Match': etag1, 'Content-Type': 'application/json', Accept: 'application/json' }, // stale
            body: patchBody,
            failOnStatusCode: false,
          })
          .then((second) => {
            expect(second.status, 'stale If-Match should conflict').to.eq(409);
          });
      });
  });
});

let createdAccounts: string[] = [];

When('I create a {string} draft account with the following detail:', (accountType: DefendantType, data: DataTable) => {
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

When('I update the last created draft account with the status {string}', (status: string) => {
  cy.wrap(createdAccounts)
    .its(createdAccounts.length - 1)
    .then((accountId) => {
      // Fetch the current draft account to get required fields
      cy.request('GET', `opal-fines-service/draft-accounts/${accountId}`).then((getResp) => {
        const account = getResp.body;
        const business_unit_id = account.business_unit_id;
        const version = account.version;
        const validated_by = account.submitted_by || 'opal-test';
        const now = new Date().toISOString().split('T')[0];
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

          const body = response.body || {};
          const accNum = body.account_number ?? body.accountNumber;
          Cypress.env('lastAccountNumber', accNum);
        });
      });
    });
});

Then('I click the published account link', () => {
  const num = Cypress.env('lastAccountNumber');
  expect(num, 'lastAccountNumber').to.be.a('string');
  cy.window().then((win) => {
    cy.stub(win, 'open').callsFake((url) => {
      win.location.href = url;
    });
  });
  cy.contains('a.govuk-link', String(num)).click();
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
