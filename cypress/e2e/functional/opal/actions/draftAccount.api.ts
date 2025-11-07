// cypress/e2e/functional/opal/actions/draftAccount.api.ts
import merge from 'lodash/merge';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

import { convertDataTableToNestedObject } from '../../../../support/utils/table';
import { getDraftPayloadFileForAccountType, type DefendantType } from '../../../../support/utils/payloads';

import { readDraftIdFromBody } from '../../../../support/draftAccounts';

const pathForAccount = (id: number | string) => `/opal-fines-service/draft-accounts/${id}`;

function readStrongEtag(headers: Record<string, any>): string {
  const etag = headers['etag'] ?? headers['ETag'] ?? '';
  expect(etag, 'ETag header must exist').to.be.a('string').and.not.be.empty;
  expect(etag.startsWith('W/'), 'ETag must be strong (no W/)').to.be.false;
  return etag;
}

const timeline = (user: string, newStatus: string) => [{ user, status: newStatus, at: new Date().toISOString() }];

export interface EtagUpdate {
  status: number;
  etagBefore: string;
  etagAfter: string;
  accountId: number;
  accountNumber?: string | null;
}

/**
 * High-level action: create a draft account, then set its status with ETag protection.
 * Exposes @lastCreatedDraftId and @etagUpdate aliases.
 */
export function createDraftAndSetStatus(accountType: DefendantType, newStatus: string, table: DataTable) {
  const overrides = convertDataTableToNestedObject(table);
  const draftFixture = getDraftPayloadFileForAccountType(accountType);

  return cy.fixture(`draftAccounts/${draftFixture}`).then((base) => {
    const requestBody = merge({}, base, overrides);

    // 1) CREATE
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
          // eslint-disable-next-line no-console
          console.error('POST /draft-accounts failed', { status: postResp.status, body: postResp.body, requestBody });
        }
        expect(postResp.status, 'POST /draft-accounts').to.eq(201);

        const id = readDraftIdFromBody(postResp.body);
        cy.wrap(id, { log: false }).as('lastCreatedDraftId');

        // 2) GET strong ETag
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
                // eslint-disable-next-line no-console
                console.error('PATCH /draft-accounts/{id} failed', {
                  status: patchResp.status,
                  responseBody: patchResp.body,
                  sentBody: patchBody,
                  ifMatch: beforeEtag,
                });
              }

              expect([200, 204], 'PATCH success').to.include(patchResp.status);

              const afterEtag = readStrongEtag(patchResp.headers);
              if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
                expect(afterEtag, 'ETag should change after update').not.to.eq(beforeEtag);
              }

              cy.wrap(
                {
                  status: patchResp.status,
                  etagBefore: beforeEtag,
                  etagAfter: afterEtag,
                  accountId: id,
                  accountNumber: (patchResp.body as any)?.['account_number'] ?? null,
                },
                { log: false },
              ).as('etagUpdate');
            });
        });
      });
  });
}
