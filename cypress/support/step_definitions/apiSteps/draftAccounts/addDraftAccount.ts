// Steps for Draft Account API flows using strong ETag / If-Match concurrency.

import { DataTable, When, Then, After } from '@badeball/cypress-cucumber-preprocessor';
import merge from 'lodash/merge';
import set from 'lodash/set';

/** Track created account IDs so later steps (and cleanup) can find them. */
let createdIds: Array<number> = [];

/** Save the last created ID (also in env as a fallback across step files if needed). */
function recordCreatedId(id: number): void {
  createdIds.push(id);
  Cypress.env('lastDraftAccountId', String(id));
}

/** Return the last created ID or fail the test with a message. */
function lastCreatedIdOrFail(): number {
  const fromArray = createdIds.at(-1);
  const fromEnv = Cypress.env('lastDraftAccountId');
  const last = fromArray ?? (fromEnv ? Number(fromEnv) : undefined);
  expect(last, 'at least one created account').to.exist;
  return Number(last);
}

/** Clear in-memory and env state. */
function clearCreatedIds(): void {
  createdIds = [];
  Cypress.env('lastDraftAccountId', undefined as any);
}

/** Build Authorization header from env (set CYPRESS_TOKEN or in cypress.env.json). */
const auth = () => (Cypress.env('TOKEN') ? { Authorization: `Bearer ${Cypress.env('TOKEN')}` } : {});

/** Build path for a draft account */
const pathForAccount = (id: number | string) => `/opal-fines-service/draft-accounts/${encodeURIComponent(String(id))}`;

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
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

/** GET an account and return its strong ETag + body as a Cypress chainable. */
function getAccountAndStrongEtag(id: number | string) {
  return cy
    .request({
      method: 'GET',
      url: pathForAccount(id),
      headers: { ...auth(), Accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((resp) => {
      // Breadcrumbs in the runner (visible in Cypress command log)
      cy.log(`GET ${pathForAccount(id)} → ${resp.status}`);
      cy.log(`content-type: ${resp.headers['content-type'] || '<none>'}`);
      cy.log(`all headers: ${JSON.stringify(resp.headers, null, 2)}`);

      // Status + content-type
      expect(resp.status, 'GET status').to.be.oneOf([200, 304]);
      expect(String(resp.headers['content-type'] || ''), 'content-type').to.include('application/json');

      // ETag (header keys are lowercased in Node/Cypress)
      const etag = resp.headers['etag'] as string | undefined;
      expect(
        etag,
        `ETag header missing for ${pathForAccount(id)}; headers were: ${JSON.stringify(resp.headers, null, 2)}`,
      ).to.exist;

      // Strong + quoted
      expect(etag!.startsWith('W/'), 'ETag must be strong (no W/) for If-Match').to.be.false;
      expect(/^".+"$/.test(etag!), 'ETag should be quoted').to.be.true;

      cy.log(`etag {}`, etag);

      // Return a Cypress-wrapped object
      return cy.wrap({ etag: etag!, body: resp.body }, { log: false });
    });
}

/** Timeline helper */
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

When('I create a {string} draft account with the following details:', (accountType: DefendantType, data: DataTable) => {
  const overrides = convertDataTableToNestedObject(data);
  const payloadFile = getPayloadFileForAccountType(accountType);

  return cy.fixture(`draftAccounts/${payloadFile}`).then((base) => {
    const requestBody = merge({}, base, overrides);

    return cy
      .request({
        method: 'POST',
        url: '/opal-fines-service/draft-accounts',
        headers: { ...auth(), Accept: 'application/json' },
        body: requestBody,
        failOnStatusCode: false,
      })
      .then((response) => {
        expect(response.status, 'POST /draft-accounts').to.eq(201);

        const draftAccountId = Number(response.body?.draft_account_id);
        expect(draftAccountId, 'draft_account_id').to.be.a('number');

        // record locally
        recordCreatedId(draftAccountId);
        cy.log(`Created draft_account_id=${draftAccountId}`);
      });
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Step: Update last created with status — store before/after in @etagUpdate
// ────────────────────────────────────────────────────────────────────────────────

type EtagUpdate = {
  status: number;
  etagBefore: string;
  etagAfter: string | null;
  accountId: number;
};

When('I update the last created draft account with status {string}', (newStatus: string) => {
  const id = lastCreatedIdOrFail();

  return getAccountAndStrongEtag(id).then(({ etag: beforeEtag, body }) => {
    // Build a minimally valid PATCH body based on current resource
    const patchBody: any = {
      account_status: newStatus,
      business_unit_id: body.business_unit_id,
      timeline_data:
        Array.isArray(body.timeline_data) && body.timeline_data.length
          ? body.timeline_data
          : timeline('opal-test', newStatus),
      validated_by: body.validated_by || 'opal-test',
    };

    return cy
      .request({
        method: 'PATCH',
        url: pathForAccount(id),
        headers: {
          ...auth(),
          'If-Match': beforeEtag,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: patchBody,
        failOnStatusCode: false,
      })
      .then((patchResp) => {
        cy.log(`PATCH ${pathForAccount(id)} → ${patchResp.status}`);
        cy.log(`PATCH response body: ${JSON.stringify(patchResp.body || {}, null, 2)}`);
        cy.log(`PATCH response headers: ${JSON.stringify(patchResp.headers || {}, null, 2)}`);

        expect(patchResp.status, 'PATCH status').to.be.oneOf([200, 204]);

        const afterEtag = patchResp.headers['etag'] as string | undefined;
        expect(afterEtag, 'PATCH must return an ETag').to.exist;
        expect(afterEtag!.startsWith('W/'), 'ETag must be strong post-PATCH').to.be.false;
        expect(/^".+"$/.test(afterEtag!), 'ETag should be quoted post-PATCH').to.be.true;

        // Require the ETag to change
        expect(afterEtag, 'ETag should change after update').to.not.equal(beforeEtag);

        cy.wrap(
          { status: patchResp.status, etagBefore: beforeEtag, etagAfter: afterEtag!, accountId: id },
          { log: false },
        ).as('etagUpdate');
      });
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Then: assert the update succeeded and ETag changed
// ────────────────────────────────────────────────────────────────────────────────

Then('the update should succeed and return a new strong ETag', () => {
  return cy.get('@etagUpdate').then((raw: any) => {
    const { status, etagBefore, etagAfter } = raw as {
      status: number;
      etagBefore: string;
      etagAfter: string;
    };

    expect([200, 204], 'PATCH success status').to.include(status);
    expect(etagAfter, 'new ETag present').to.exist;

    expect(etagAfter.startsWith('W/'), 'Updated ETag must be strong (no W/)').to.be.false;
    expect(etagAfter, 'ETag should change after update').not.to.eq(etagBefore);
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Negative: stale ETag → 409 Conflict
// ────────────────────────────────────────────────────────────────────────────────

When('I try to update the last created draft account with a stale ETag I should get a conflict', () => {
  const id = lastCreatedIdOrFail();

  return getAccountAndStrongEtag(id).then(({ etag: etag1, body }) => {
    // Build a minimally valid PATCH body based on the current resource
    const patchBody: any = {
      account_status: 'Publishing Pending',
      business_unit_id: body.business_unit_id,
      validated_by: body.validated_by || 'opal-test',
      timeline_data:
        Array.isArray(body.timeline_data) && body.timeline_data.length
          ? body.timeline_data
          : timeline('opal-test', 'Publishing Pending'),
    };

    // PATCH #1 with a fresh ETag – should succeed (200/204)
    return cy
      .request({
        method: 'PATCH',
        url: pathForAccount(id),
        headers: {
          ...auth(),
          'If-Match': etag1,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: patchBody,
        failOnStatusCode: false,
      })
      .then((first) => {
        cy.log(`PATCH#1 ${pathForAccount(id)} → ${first.status}`);
        cy.log(`PATCH#1 headers: ${JSON.stringify(first.headers || {}, null, 2)}`);
        cy.log(`PATCH#1 body: ${JSON.stringify(first.body || {}, null, 2)}`);

        expect([200, 204], 'first PATCH should succeed').to.include(first.status);

        // PATCH #2 reusing the *stale* ETag – should now conflict
        return cy
          .request({
            method: 'PATCH',
            url: pathForAccount(id),
            headers: {
              ...auth(),
              'If-Match': etag1, // stale on purpose
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: patchBody,
            failOnStatusCode: false,
          })
          .then((second) => {
            cy.log(`PATCH#2 ${pathForAccount(id)} → ${second.status}`);
            cy.log(`PATCH#2 headers: ${JSON.stringify(second.headers || {}, null, 2)}`);
            cy.log(`PATCH#2 body: ${JSON.stringify(second.body || {}, null, 2)}`);

            expect(second.status, 'stale If-Match should conflict').to.eq(409);
          });
      });
  });
});

// ────────────────────────────────────────────────────────────────────────────────
// Cleanup: DELETE each created account using strong If-Match when possible.
// ────────────────────────────────────────────────────────────────────────────────

After(() => {
  const ids = [...createdIds];
  clearCreatedIds();

  return cy.wrap(ids, { log: false }).each((id: number) => {
    // 1) Try to read the ETag
    return cy
      .request({
        method: 'GET',
        url: pathForAccount(id),
        headers: { ...auth(), Accept: 'application/json' },
        failOnStatusCode: false,
      })
      .then((getResp) => {
        cy.log(`cleanup GET ${id} → ${getResp.status}`);

        if (getResp.status === 404) {
          // Already gone – optionally send a tolerant delete to clear any caches
          return cy.request({
            method: 'DELETE',
            url: `${pathForAccount(id)}?ignore_missing=true`,
            headers: { ...auth(), Accept: 'application/json' },
            failOnStatusCode: false,
          });
        }

        const etag = getResp.headers['etag'] as string | undefined;

        // 2) Prefer If-Match when we have a strong ETag, otherwise fall back to ignore_missing
        const doDelete = () =>
          etag && !etag.startsWith('W/')
            ? cy.request({
                method: 'DELETE',
                url: pathForAccount(id),
                headers: { ...auth(), 'If-Match': etag, Accept: 'application/json' },
                failOnStatusCode: false,
              })
            : cy.request({
                method: 'DELETE',
                url: `${pathForAccount(id)}?ignore_missing=true`,
                headers: { ...auth(), Accept: 'application/json' },
                failOnStatusCode: false,
              });

        return doDelete().then((delResp) => {
          cy.log(`cleanup DELETE ${id} → ${delResp.status}`);
          // Be tolerant here to avoid failing the *scenario* because of teardown.
          // If you need stricter behaviour, tighten this list.
          if (![200, 204, 404, 409, 406].includes(delResp.status)) {
            expect.fail(`Unexpected cleanup status ${delResp.status} for id=${id}`);
          }
        });
      });
  });
});
