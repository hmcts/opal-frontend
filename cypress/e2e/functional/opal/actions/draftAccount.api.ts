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

/**
 * Constructs the API path for a specific draft account.
 * @param id - The draft account ID.
 */
const pathForAccount = (id: number | string) => `/opal-fines-service/draft-accounts/${id}`;

/**
 * Extracts and validates a strong (non-weak) ETag header from a response.
 *
 * @param headers - The response headers object.
 * @returns The strong ETag string.
 */
function readStrongEtag(headers: Record<string, any>): string {
  const etag = headers['etag'] ?? headers['ETag'] ?? '';
  expect(etag, 'ETag header must exist').to.be.a('string').and.not.be.empty;
  expect(etag.startsWith('W/'), 'ETag must be strong (no W/)').to.be.false;
  return etag;
}

/**
 * Example timeline array builder (unused helper, placeholder for auditing).
 * @param user - User who made the change.
 * @param newStatus - The new account status.
 */
const timeline = (user: string, newStatus: string) => [{ user, status: newStatus, at: new Date().toISOString() }];

/**
 * Structure of data exposed via the `@etagUpdate` alias.
 */
export interface EtagUpdate {
  status: number;
  etagBefore: string;
  etagAfter: string;
  accountId: number;
  accountNumber?: string | null;
}

/**
 * Creates a draft account, sets its status via PATCH, and exposes
 * metadata (ETags, ID, and account number) as `@etagUpdate`.
 *
 * @param accountType - Type of account to create (`individual` or `company`).
 * @param newStatus - The status to assign after creation (e.g., `"Published"`).
 * @param table - A Cucumber DataTable of field overrides for the base fixture.
 *
 * @returns `Cypress.Chainable<void>` resolving after the draft account is created and updated.
 *
 * @example
 * ```ts
 * createDraftAndSetStatus('company', 'Published', table);
 * cy.get('@etagUpdate').its('accountNumber').should('match', /^25/);
 * ```
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

  return cy.fixture(`draftAccounts/${draftFixture}`).then((base) => {
    const requestBody = merge({}, base, overrides);

    // 1️⃣ CREATE DRAFT ACCOUNT
    Cypress.log({ name: 'request', message: 'POST /draft-accounts' });
    return cy
      .request({
        method: 'POST',
        url: '/opal-fines-service/draft-accounts',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: requestBody,
        failOnStatusCode: false,
      })
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

        const id = readDraftIdFromBody(postResp.body);
        cy.wrap(id, { log: false }).as('lastCreatedDraftId');

        // 2️⃣ FETCH STRONG ETAG
        Cypress.log({ name: 'request', message: `GET /draft-accounts/${id}` });
        return cy.request({ method: 'GET', url: pathForAccount(id), failOnStatusCode: false }).then((getResp) => {
          expect(getResp.status, 'GET account').to.eq(200);
          const beforeEtag = readStrongEtag(getResp.headers);

          const body = (getResp.body ?? {}) as any;
          const business_unit_id = Number(body['business_unit_id']);
          const validated_by = body['validated_by'] || 'opal-test';

          const patchBody: Record<string, unknown> = {
            account_status: newStatus,
            business_unit_id,
            validated_by,
          };

          if (Array.isArray(body['timeline_data'])) {
            patchBody['timeline_data'] = body['timeline_data'];
          }

          // 3️⃣ PATCH STATUS UPDATE
          Cypress.log({ name: 'request', message: `PATCH /draft-accounts/${id}` });
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

              const afterEtag = readStrongEtag(patchResp.headers);

              if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
                expect(afterEtag, 'ETag should change after update').not.to.eq(beforeEtag);
              }

              // 4️⃣ ALIAS ETAG METADATA
              const numberForUI = (patchResp.body as any)?.['account_number'] ?? null;

              Cypress.log({
                name: 'alias',
                message: `Alias @etagUpdate created (Account ${numberForUI ?? 'unknown'})`,
                consoleProps: () => ({
                  etagBefore: beforeEtag,
                  etagAfter: afterEtag,
                  accountId: id,
                  accountNumber: numberForUI,
                }),
              });

              cy.wrap(
                {
                  status: patchResp.status,
                  etagBefore: beforeEtag,
                  etagAfter: afterEtag,
                  accountId: id,
                  accountNumber: numberForUI,
                },
                { log: false },
              ).as('etagUpdate');
            });
        });
      });
  });
}
