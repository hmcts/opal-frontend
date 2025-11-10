/**
 * @file draftAccount.api.ts
 * @description
 * Cypress **API Action module** for creating and updating draft accounts in the
 * HMCTS Opal application. Handles account creation, ETag validation, and
 * status updates via direct REST calls (bypassing the UI).
 *
 * @remarks
 * - Used primarily by setup steps in feature files to prepare test data quickly.
 * - Enforces strong ETag semantics (`If-Match` headers) to detect stale updates.
 * - Exposes metadata via the `@etagUpdate` alias for downstream UI tests.
 * - Includes Cypress logging for traceability in test reports.
 *
 * @example
 * ```ts
 * // Create and publish a company draft account
 * createDraftAndSetStatus('company', 'Published', table);
 *
 * // Later in a flow:
 * cy.get('@etagUpdate').then((etag) => {
 *   cy.log(`Account ${etag.accountNumber} created`);
 * });
 * ```
 *
 * @see {@link convertDataTableToNestedObject}
 * @see {@link getDraftPayloadFileForAccountType}
 * @see {@link readDraftIdFromBody}
 */

import merge from 'lodash/merge';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

import { convertDataTableToNestedObject } from '../../../../support/utils/table';
import { getDraftPayloadFileForAccountType, type DefendantType } from '../../../../support/utils/payloads';
import { readDraftIdFromBody } from '../../../../support/draftAccounts';

/** Path builder for a draft account resource */
const pathForAccount = (id: number | string) => `/opal-fines-service/draft-accounts/${id}`;

/** Read a strong (non-weak) ETag from response headers */
function readStrongEtag(headers: Record<string, unknown>): string {
  const etag = (headers['etag'] ?? headers['ETag'] ?? '') as string;
  expect(etag, 'ETag header must exist').to.be.a('string').and.not.be.empty;
  expect(etag.startsWith('W/'), 'ETag must be strong (no W/)').to.be.false;
  return etag;
}

/** Alias payload structure exposed as @etagUpdate */
export interface EtagUpdate {
  status: number;
  etagBefore: string;
  etagAfter: string;
  accountId: number;
  accountNumber?: string | null;
}

/**
 * Create a draft account, set its status, and expose ETag/ID metadata via @etagUpdate.
 *
 * @param accountType - 'individual' | 'company'
 * @param newStatus - e.g., 'Published'
 * @param table - Cucumber DataTable of overrides
 * @returns Cypress.Chainable<void>
 */
export function createDraftAndSetStatus(
  accountType: DefendantType,
  newStatus: string,
  table: DataTable,
): Cypress.Chainable<void> {
  const overrides = convertDataTableToNestedObject(table);
  const draftFixture = getDraftPayloadFileForAccountType(accountType);

  Cypress.log({
    name: 'api',
    displayName: 'Draft Account',
    message: `Creating ${accountType} draft and setting status to ${newStatus}`,
    consoleProps: () => ({ accountType, newStatus, overrides }),
  });

  // Local state accumulated across steps
  let requestBody: Record<string, unknown> = {};
  let patchBody: Record<string, unknown> = {};
  let createdId = 0;
  let beforeEtag = '';
  let afterEtag = '';
  let numberForUI: string | null = null;

  return (
    cy
      // Load base fixture and merge overrides
      .fixture(`draftAccounts/${draftFixture}`)
      .then((base) => {
        requestBody = merge({}, base, overrides);
      })

      // 1) POST create
      .then(() => {
        Cypress.log({ name: 'request', message: 'POST /draft-accounts' });
        cy.request({
          method: 'POST',
          url: '/opal-fines-service/draft-accounts',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: requestBody,
          failOnStatusCode: false,
        })
          .as('postDraftAccount')
          .then((postResp) => {
            if (postResp.status !== 201) {
              Cypress.log({
                name: 'error',
                message: 'POST /draft-accounts failed',
                consoleProps: () => ({
                  status: postResp.status,
                  body: postResp.body,
                  requestBody,
                }),
              });
            }
            expect(postResp.status, 'POST /draft-accounts').to.eq(201);

            createdId = readDraftIdFromBody(postResp.body);
            cy.wrap(createdId, { log: false }).as('lastCreatedDraftId');
          });
      })

      // 2) GET for strong ETag and prepare PATCH body
      .then(() => {
        Cypress.log({ name: 'request', message: `GET /draft-accounts/${createdId}` });
        cy.request({ method: 'GET', url: pathForAccount(createdId), failOnStatusCode: false })
          .as('getDraftAccount')
          .then((getResp) => {
            expect(getResp.status, 'GET account').to.eq(200);
            beforeEtag = readStrongEtag(getResp.headers as Record<string, unknown>);

            const body = (getResp.body ?? {}) as Record<string, unknown>;
            const business_unit_id = Number(body['business_unit_id']);
            const validated_by =
              typeof body['validated_by'] === 'string' && body['validated_by'] ? body['validated_by'] : 'opal-test';

            patchBody = {
              account_status: newStatus,
              business_unit_id,
              validated_by,
            };

            if (Array.isArray(body['timeline_data'])) {
              patchBody['timeline_data'] = body['timeline_data'];
            }
          });
      })

      // 3) PATCH status update
      .then(() => {
        Cypress.log({ name: 'request', message: `PATCH /draft-accounts/${createdId}` });
        cy.request({
          method: 'PATCH',
          url: pathForAccount(createdId),
          headers: {
            'If-Match': beforeEtag,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: patchBody,
          failOnStatusCode: false,
        })
          .as('patchDraftAccount')
          .then((patchResp) => {
            if (![200, 204].includes(patchResp.status)) {
              Cypress.log({
                name: 'error',
                message: 'PATCH /draft-accounts/{id} failed',
                consoleProps: () => ({
                  status: patchResp.status,
                  responseBody: patchResp.body,
                  sentBody: patchBody,
                  ifMatch: beforeEtag,
                }),
              });
            }

            expect([200, 204], 'PATCH success').to.include(patchResp.status);

            afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);

            if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
              expect(afterEtag, 'ETag should change after update').not.to.eq(beforeEtag);
            }

            // Optional chaining + bracket notation for index signature access
            const accRaw = (patchResp.body as Record<string, unknown> | null | undefined)?.['account_number'];
            numberForUI = typeof accRaw === 'string' ? accRaw : null;

            // 4) Alias metadata for downstream tests
            Cypress.log({
              name: 'alias',
              message: `Alias @etagUpdate created (Account ${numberForUI ?? 'unknown'})`,
              consoleProps: () => ({
                etagBefore: beforeEtag,
                etagAfter: afterEtag,
                accountId: createdId,
                accountNumber: numberForUI,
              }),
            });

            cy.wrap(
              {
                status: patchResp.status,
                etagBefore: beforeEtag,
                etagAfter: afterEtag,
                accountId: createdId,
                accountNumber: numberForUI,
              } as EtagUpdate,
              { log: false },
            ).as('etagUpdate');
          });
      })

      // Keep public type: Cypress.Chainable<void>
      .then(() => undefined as void)
  );
}
