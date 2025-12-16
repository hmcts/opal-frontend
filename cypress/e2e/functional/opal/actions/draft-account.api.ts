/**
 * @file draft-account.api.ts
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
 */

import merge from 'lodash/merge';
import get from 'lodash/get';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

import { convertDataTableToNestedObject } from '../../../../support/utils/table';
import { getDraftPayloadFileForAccountType, type DefendantType } from '../../../../support/utils/payloads';
import { readDraftIdFromBody } from '../../../../support/draftAccounts';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { DraftAccountsInterceptActions } from './draft-accounts.intercepts';

const log = createScopedLogger('DraftAccountApiActions');
const intercepts = new DraftAccountsInterceptActions();
const approvedDraftSummaries: any[] = [];
type ApprovedAccountType = DefendantType | 'fixedPenalty' | 'fixedPenaltyCompany';

/**
 * Path builder for a draft account resource.
 * @param id - Draft account identifier.
 * @returns REST path for the draft resource.
 */
const pathForAccount = (id: number | string) => `/opal-fines-service/draft-accounts/${id}`;

/**
 * Read a strong (non-weak) ETag from response headers.
 * @param headers - Response headers map.
 * @returns Strong ETag value.
 * @throws Assertion error if ETag is missing or weak.
 */
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
 * Resolve the approved payload fixture filename for the provided account type.
 * @param accountType - Account type used for the approved stub.
 * @returns Fixture filename for the approved draft payload.
 * @throws Error when the account type is unsupported.
 */
function getApprovedPayloadFileForAccountType(accountType: ApprovedAccountType): string {
  switch (accountType) {
    case 'company':
    case 'fixedPenaltyCompany':
      return 'approvedCompanyPayload.json';
    case 'adultOrYouthOnly':
      return 'approvedAccountPayload.json';
    case 'pgToPay':
      return 'approvedParentOrGuardianPayload.json';
    case 'fixedPenalty':
      return 'approvedAccountPayload.json';
    default:
      throw new Error(`Unsupported account type for approved stub: ${accountType}`);
  }
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
  accountType: ApprovedAccountType,
  newStatus: string,
  table: DataTable,
): Cypress.Chainable<void> {
  const overrides = convertDataTableToNestedObject(table);
  const draftFixture = getDraftPayloadFileForAccountType(accountType);
  const isInReview = newStatus.trim().toLowerCase() === 'in review';

  log('action', `Creating ${accountType} draft and setting status to ${newStatus}`, {
    accountType,
    newStatus,
    overrides,
  });

  // If "Approved" is requested, stub the approved listings instead of patching the backend.
  if (newStatus.toLowerCase() === 'approved') {
    const approvedFixture = getApprovedPayloadFileForAccountType(accountType);

    return cy
      .fixture(`draftAccounts/${approvedFixture}`)
      .then((base) => {
        const summary = merge({}, base, overrides);
        // Prefer explicit account_snapshot overrides; fall back to existing fixture value.
        const overrideSnapshotName = get(overrides, 'account_snapshot.defendant_name');
        if (overrideSnapshotName) {
          summary.account_snapshot = {
            ...(summary.account_snapshot ?? {}),
            defendant_name: overrideSnapshotName,
          };
        }

        const approvedDate =
          get(summary, 'account_status_date') ||
          get(summary, 'created_at') ||
          get(summary, 'account_snapshot.created_date') ||
          new Date().toISOString();
        const approvedTime = Date.parse(approvedDate);
        const now = new Date();
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysAgo =
          Number.isNaN(approvedTime) || approvedTime > now.getTime()
            ? 0
            : Math.floor((now.setHours(0, 0, 0, 0) - new Date(approvedTime).setHours(0, 0, 0, 0)) / msPerDay);
        summary.created_at = approvedDate;
        summary.account_status_date = approvedDate;
        summary.__approvedDays = `${daysAgo} days ago`;

        return summary;
      })
      .then((summary) => {
        approvedDraftSummaries.push(summary);
        intercepts.stubApprovedDraftListings([...approvedDraftSummaries]);
        Cypress.env('approvedDraftSummaries', [...approvedDraftSummaries]);
        cy.wrap(summary, { log: false }).as('approvedDraftAccount');
      })
      .then(() => undefined as void);
  }

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
        log('action', 'POST /draft-accounts', { requestBody });
        cy.request({
          method: 'POST',
          url: '/opal-fines-service/draft-accounts',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: requestBody,
          failOnStatusCode: false,
        })
          .as('postDraftAccount')
          .then((postResp) => {
            log('debug', 'POST /draft-accounts response', {
              status: postResp.status,
              body: postResp.body,
              requestBody,
            });
            cy.log(
              `POST /draft-accounts -> ${postResp.status}: ${JSON.stringify(postResp.body).slice(0, 500)}`,
            );
            if (postResp.status !== 201) {
              log('assert', 'POST /draft-accounts failed', {
                status: postResp.status,
                body: postResp.body,
                requestBody,
              });
            }
            expect(postResp.status, 'POST /draft-accounts').to.eq(201);

            createdId = readDraftIdFromBody(postResp.body);
            log('done', 'Draft account created', { createdId });
            cy.wrap(createdId, { log: false }).as('lastCreatedDraftId');
          });
      })

      // 1) POST create
      // 2) GET for strong ETag and prepare PATCH body
      .then(() => {
        if (isInReview) {
          log('info', 'Skipping GET/PATCH status update for in-review drafts');
          return undefined as void;
        }

        return cy
          .request({ method: 'GET', url: pathForAccount(createdId), failOnStatusCode: false })
          .as('getDraftAccount')
          .then((getResp) => {
            expect(getResp.status, 'GET account').to.eq(200);
            beforeEtag = readStrongEtag(getResp.headers as Record<string, unknown>);

            const body = (getResp.body ?? {}) as Record<string, unknown>;
            const business_unit_id = Number(body['business_unit_id'] ?? body['businessUnitId']);
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

            log('done', 'Prepared PATCH body and captured strong ETag', {
              beforeEtag,
              business_unit_id,
              validated_by,
            });

            return cy
              .request({
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
                  log('assert', 'PATCH /draft-accounts/{id} failed', {
                    status: patchResp.status,
                    responseBody: patchResp.body,
                    sentBody: patchBody,
                    ifMatch: beforeEtag,
                  });
                }

                expect([200, 204], 'PATCH success').to.include(patchResp.status);

                afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);

                if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
                  expect(afterEtag, 'ETag should change after update').not.to.eq(beforeEtag);
                }

                // 3) Extract account number from response (if present)
                // Optional chaining + bracket notation for index signature access
                const accRaw = (patchResp.body as Record<string, unknown> | null | undefined)?.['account_number'];
                numberForUI = typeof accRaw === 'string' ? accRaw : null;

                // 4) Alias metadata for downstream tests
                log('action', `Alias @etagUpdate created (Account ${numberForUI ?? 'unknown'})`, {
                  etagBefore: beforeEtag,
                  etagAfter: afterEtag,
                  accountId: createdId,
                  accountNumber: numberForUI,
                  status: patchResp.status,
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
          });
      })

      // Keep public type: Cypress.Chainable<void>
      .then(() => undefined as void)
  );
}
