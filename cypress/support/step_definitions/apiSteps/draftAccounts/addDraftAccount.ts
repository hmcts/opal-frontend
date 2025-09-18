// Steps for Draft Account API flows using strong ETag / If-Match concurrency.

import { DataTable, When, Then, After } from '@badeball/cypress-cucumber-preprocessor';
import merge from 'lodash/merge';
import set from 'lodash/set';

// ────────────────────────────────────────────────────────────────────────────────
// Config & shared state
// ────────────────────────────────────────────────────────────────────────────────

/** Track created account IDs to tidy up after scenarios. */
let createdAccounts: number[] = [];

/** Build Authorization header from env (set CYPRESS_TOKEN or in cypress.env.json). */
const auth = () =>
  Cypress.env('TOKEN') ? { Authorization: `Bearer ${Cypress.env('TOKEN')}` } : {};

/** Build path for a draft account */
const pathForAccount = (id: number | string) =>
  `/opal-fines-service/draft-accounts/${encodeURIComponent(String(id))}`;

// ────────────────────────────────────────────────────────────────────────────────
/** Convert the Cucumber data table (dot-path keys) to a nested object. */
function convertDataTableToNestedObject(dataTable: DataTable): Record<string, unknown> {
  const overrides: Record<string, unknown> = {};
  const rows = dataTable.rowsHash();
  for (const [path, value] of Object.entries(rows)) {
    let parsed: unknown = value;
    try {
      parsed = JSON.parse(value);
    } catch {
      /* keep as string */
    }
    set(overrides, path, parsed);
  }
  return overrides;
}

type DefendantType = 'company' | 'adultOrYouthOnly' | 'pgToPay';

/** Resolve payload fixture name for a given account type. */
function getPayloadFileForAccountType(accountType: DefendantType): string {
  return {
    company: 'companyPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    pgToPay: 'parentOrGuardianPayload.json',
  }[accountType];
}

/**
 * GET an account and return its ETag + body.
 */
function getAccountAndStrongEtag(id: number | string) {
  return cy
    .request({
      method: 'GET',
      url: pathForAccount(id),
      headers: { ...auth(), Accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((resp) => {
      // Useful breadcrumbs in the Cypress runner
      cy.log(`GET ${pathForAccount(id)} → ${resp.status}`);
      cy.log(`content-type: ${resp.headers['content-type'] || '<none>'}`);
      cy.log(`all headers: ${JSON.stringify(resp.headers, null, 2)}`);

      // Sanity check we actually got JSON
      expect(resp.status, 'GET status').to.be.oneOf([200, 304]);
      expect(String(resp.headers['content-type'] || '')).to.include('application/json');

      // ETag (header keys are lowercased in Node)
      const etag = resp.headers['etag'] as string | undefined;
      expect(etag, `ETag header missing for ${pathForAccount(id)}; headers were: ${JSON.stringify(resp.headers, null, 2)}`).to.exist;

      // Strong + quoted
      expect(etag!.startsWith('W/'), 'ETag must be strong (no W/) for If-Match').to.be.false;
      expect(/^".+"$/.test(etag!), 'ETag should be quoted').to.be.true;

      return { etag: etag!, body: resp.body};
    });
}


/** Build a basic timeline entry. */
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
// Step: create a draft account (API)
// ────────────────────────────────────────────────────────────────────────────────

When(
  'I create a {string} draft account with the following details:',
  (accountType: DefendantType, data: DataTable) => {
    const overrides = convertDataTableToNestedObject(data);
    const payloadFile = getPayloadFileForAccountType(accountType);

    return cy.fixture(`draftAccounts/${payloadFile}`).then((base) => {
      const requestBody = merge({}, base, overrides);

      return cy
        .request({
          method: 'POST',
          url: '/opal-fines-service/draft-accounts',
          headers: auth(),
          body: requestBody,
          failOnStatusCode: false,
        })
        .then((response) => {
          expect(response.status).to.eq(201);
          const draftAccountId = Number((response.body).draft_account_id);
          expect(draftAccountId, 'draft_account_id').to.be.a('number');
          createdAccounts.push(draftAccountId);
        });
    });
  }
);

// ────────────────────────────────────────────────────────────────────────────────
// Step: Update last created with status — store before/after
// ────────────────────────────────────────────────────────────────────────────────

/** Type stored in @etagUpdate alias*/
type EtagUpdate = {
  status: number;
  etagBefore: string;
  etagAfter: string | null;
  accountId: number;
};

When('I update the last created draft account with status {string}', (status: string) => {
  return cy
    .wrap(createdAccounts, { log: false })
    .then((arr: number[]) => {
      expect(arr.length, 'at least one created account').to.be.greaterThan(0);
      return arr[arr.length - 1];
    })
    .then((accountId: number) => {
      return getAccountAndStrongEtag(accountId).then(({ etag, body }) => {
        const updateBody = {
          business_unit_id: body.business_unit_id,
          account_status: status,
          validated_by: body.submitted_by || 'opal-test',
          timeline_data: timeline(body.submitted_by || 'opal-test', status),
        };

        return cy
          .request({
            method: 'PATCH',
            url: pathForAccount(accountId),
            headers: { ...auth(), 'If-Match': etag }, // quoted strong ETag
            body: updateBody,
            failOnStatusCode: false, // assert in Then
          })
          .then((resp) => {
            const etagAfter = (resp.headers['etag'] as string | undefined) ?? null;
            cy.wrap<EtagUpdate>(
              { status: resp.status, etagBefore: etag, etagAfter, accountId },
              { log: false }
            ).as('etagUpdate');
          });
      });
    });
});

// ────────────────────────────────────────────────────────────────────────────────
// Then: assert the update succeeded and ETag changed
// ────────────────────────────────────────────────────────────────────────────────

Then('the update should succeed and return a new strong ETag', () => {
  return cy.get<EtagUpdate>('@etagUpdate').then(({ status, etagBefore, etagAfter }) => {
    expect(status, 'PATCH success status').to.eq(200);
    expect(etagAfter, 'new ETag present').to.not.be.null;

    const after = etagAfter as string;
    expect(after.startsWith('W/'), 'Updated ETag must be strong (no W/)').to.be.false;
    expect(after, 'ETag should change after update').not.to.eq(etagBefore);
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Negative: stale ETag → 409 Conflict
// ────────────────────────────────────────────────────────────────────────────────

When('I try to update the last created draft account with a stale ETag I should get a conflict', () => {
  cy.wrap(createdAccounts).its('length').should('be.gt', 0);
  const lastId = () => createdAccounts[createdAccounts.length - 1];

  return getAccountAndStrongEtag(lastId()).then(({ etag: etag1, body }) => {
    const updateBody = {
      business_unit_id: body.business_unit_id,
      account_status: 'QA-Bump',
      validated_by: 'opal-test',
      timeline_data: timeline('opal-test', 'QA-Bump'),
    };

    return cy
      .request({
        method: 'PATCH',
        url: pathForAccount(lastId()),
        headers: { ...auth(), 'If-Match': etag1 },
        body: updateBody,
        failOnStatusCode: false,
      })
      .its('status')
      .should('eq', 200)
      .then(() => {
        return cy
          .request({
            method: 'PATCH',
            url: pathForAccount(lastId()),
            headers: { ...auth(), 'If-Match': etag1 }, // stale on purpose
            body: updateBody,
            failOnStatusCode: false,
          })
          .then((resp) => {
            expect(resp.status, 'stale If-Match should conflict').to.eq(409);
          });
      });
  });
});

// ────────────────────────────────────────────────────────────────────────────────
/** Cleanup: DELETE each created account using strong If-Match. */
// ────────────────────────────────────────────────────────────────────────────────

After(() => {
  const ids = [...createdAccounts];
  createdAccounts = [];

  return cy.wrap(ids, { log: false }).each((id: number) => {
    return cy
      .request({
        method: 'GET',
        url: pathForAccount(id),
        headers: auth(),
        failOnStatusCode: false,
      })
      .then((getResp) => {
        if (getResp.status === 404) {
          // already gone
          return cy.request({
            method: 'DELETE',
            url: `${pathForAccount(id)}?ignoreMissing=true`,
            headers: auth(),
            failOnStatusCode: false,
          });
        }

        const etag = getResp.headers['etag'] as string | undefined;

        if (!etag || etag.startsWith('W/')) {
          // fallback path if ETag missing/weak
          return cy.request({
            method: 'DELETE',
            url: `${pathForAccount(id)}?ignoreMissing=true`,
            headers: auth(),
            failOnStatusCode: false,
          });
        }

        return cy
          .request({
            method: 'DELETE',
            url: pathForAccount(id),
            headers: { ...auth(), 'If-Match': etag },
            failOnStatusCode: false,
          })
          .then((resp) => {
            expect([200, 204, 404, 409]).to.include(resp.status);
          });
      });
  });
});
