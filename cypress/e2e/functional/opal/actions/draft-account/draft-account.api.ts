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
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

import { convertDataTableToNestedObject } from '../../../../../support/utils/table';
import { getDraftPayloadFile, type DraftPayloadType } from '../../../../../support/utils/payloads';
import { readDraftIdFromBody } from '../../../../../support/draftAccounts';
import {
  extractAccountNumber,
  extractCreatedTimestamp,
  extractUpdatedTimestamp,
  recordCreatedAccount,
  recordFailedAccount,
  summarizeErrorPayload,
} from '../../../../../support/utils/accountCapture';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('DraftAccountApiActions');
const createDraftEndpoint = '/opal-fines-service/draft-accounts';
const DRAFT_ETAG_RETRY_ATTEMPTS = 3;
const DRAFT_ETAG_RETRY_DELAY_MS = 750;
const DRAFT_PREPATCH_WAIT_MS = 500;

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const safeReadStrongEtag = (headers: Record<string, unknown>): string => {
  try {
    return readStrongEtag(headers);
  } catch {
    return '';
  }
};

const extractSafeErrorDetails = (payload: unknown): Record<string, unknown> => {
  if (!isRecord(payload)) return {};
  const allowedKeys = ['status', 'code', 'errorCode', 'traceId', 'correlationId', 'path'];
  const details: Record<string, unknown> = {};
  allowedKeys.forEach((key) => {
    const value = payload[key];
    if (typeof value === 'number' || typeof value === 'boolean') {
      details[key] = value;
      return;
    }
    if ((key === 'traceId' || key === 'correlationId' || key === 'path') && typeof value === 'string') {
      details[key] = payload[key];
    }
  });
  return details;
};

const logPatchFailure = (
  context: string,
  endpoint: string,
  patchResp: Cypress.Response<unknown>,
  patchBody: Record<string, unknown>,
  ifMatch: string,
): void => {
  const safeDetails = extractSafeErrorDetails(patchResp.body);
  const logDetails = {
    context,
    endpoint,
    status: patchResp.status,
    responseKeys: isRecord(patchResp.body) ? Object.keys(patchResp.body) : undefined,
    responseDetails: safeDetails,
    patchBodyKeys: Object.keys(patchBody),
    ifMatchPresent: Boolean(ifMatch),
  };

  log('assert', 'PATCH /draft-accounts/{id} failed', logDetails);
  cy.task('log:message', { message: 'PATCH /draft-accounts failed', details: logDetails }, { log: false });
};

type DraftForPatchResult = { response: Cypress.Response<unknown>; etag: string };

const getDraftForPatch = (
  accountId: number,
  attempts: number = DRAFT_ETAG_RETRY_ATTEMPTS,
  delayMs: number = DRAFT_ETAG_RETRY_DELAY_MS,
): Cypress.Chainable<DraftForPatchResult> => {
  const attempt = (remaining: number): Cypress.Chainable<DraftForPatchResult> =>
    cy.request({ method: 'GET', url: pathForAccount(accountId), failOnStatusCode: false }).then((getResp) => {
      const etag = getResp.status === 200 ? safeReadStrongEtag(getResp.headers as Record<string, unknown>) : '';
      if (getResp.status === 200 && etag) {
        return { response: getResp, etag };
      }
      if (remaining <= 1) {
        expect(getResp.status, 'GET account').to.eq(200);
        return { response: getResp, etag: readStrongEtag(getResp.headers as Record<string, unknown>) };
      }
      log('warn', 'GET /draft-accounts retrying before PATCH', {
        accountId,
        status: getResp.status,
        remaining: remaining - 1,
      });
      return cy.wait(delayMs, { log: false }).then(() => attempt(remaining - 1)) as unknown as DraftForPatchResult;
    });

  return attempt(attempts);
};

/** Alias payload structure exposed as @etagUpdate */
export interface EtagUpdate {
  status: number;
  etagBefore: string;
  etagAfter: string;
  accountId: number;
  accountNumber?: string | null;
}

/**
 * @description Captures the result of a stale If-Match update attempt.
 */
export interface EtagConflictResult {
  accountId: number;
  firstStatus: number;
  conflictStatus: number;
  etagUsed: string;
  patchBody: Record<string, unknown>;
}

/**
 * Create a draft account, set its status, and expose ETag/ID metadata via @etagUpdate.
 *
 * @param draftType - Draft account type from payloads.ts (e.g., company, pgToPay, fixedPenalty).
 * @param newStatus - Target status after creation (e.g., "Submitted", "In review", "Rejected").
 * @param table - Cucumber DataTable of overrides (values can include Account_status).
 * @returns Cypress.Chainable<void>
 *
 * @remarks
 * - Fixtures default `account_status` to "Submitted"; POST alone leaves the draft in that state.
 * - Any other status requires a PATCH after creation; we skip PATCH when the target is effectively "Submitted" (including the "In review" alias).
 * - Status source order: explicit step argument (e.g., `set status "Rejected"`) > `Account_status` row in the table > helper defaults.
 */
export function createDraftAndSetStatus(
  draftType: DraftPayloadType,
  newStatus: string,
  table: DataTable,
): Cypress.Chainable<void> {
  const resolveTargetStatus = (status: string): { canonicalStatus: string; skipPatch: boolean } => {
    const trimmed = status.trim();
    const normalized = trimmed.toLowerCase();

    if (normalized === 'in review') {
      // API only understands "Submitted" for drafts awaiting review; map "In review" inputs to that state and skip PATCH.
      return { canonicalStatus: 'Submitted', skipPatch: true };
    }

    return { canonicalStatus: trimmed, skipPatch: normalized === 'submitted' };
  };

  const { canonicalStatus, skipPatch } = resolveTargetStatus(newStatus);
  const overrides = convertDataTableToNestedObject(table);
  const draftFixture = getDraftPayloadFile(draftType);

  log('action', `Creating ${draftType} draft and setting status to ${canonicalStatus}`, {
    draftType,
    newStatus,
    canonicalStatus,
    overrides,
  });

  // Local state accumulated across steps
  let requestBody: Record<string, unknown> = {};
  let patchBody: Record<string, unknown> = {};
  let createdId = 0;
  let beforeEtag = '';
  let afterEtag = '';
  let numberForUI: string | null = null;
  let postAccountNumber: string | undefined;
  let createdAtFromApi: string | undefined;
  let updatedAtFromApi: string | undefined;
  const requestPayloads: Array<{
    source: 'api';
    endpoint?: string;
    method?: string;
    timestamp: string;
    payload: Record<string, unknown>;
  }> = [];

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
          url: createDraftEndpoint,
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
            cy.log(`POST /draft-accounts -> ${postResp.status}: ${JSON.stringify(postResp.body).slice(0, 500)}`);
            createdAtFromApi = extractCreatedTimestamp(postResp.body as unknown) ?? createdAtFromApi;
            if (postResp.status !== 201) {
              log('assert', 'POST /draft-accounts failed', {
                status: postResp.status,
                body: postResp.body,
                requestBody,
              });
              recordFailedAccount({
                source: 'api',
                accountType: draftType,
                httpStatus: postResp.status,
                errorSummary: summarizeErrorPayload(postResp.body as unknown),
                requestSummary: {
                  endpoint: createDraftEndpoint,
                  method: 'POST',
                },
              });
            }
            expect(postResp.status, 'POST /draft-accounts').to.eq(201);

            createdId = readDraftIdFromBody(postResp.body);
            postAccountNumber = extractAccountNumber(postResp.body as unknown);
            log('done', 'Draft account created', { createdId });
            cy.wrap(createdId, { log: false }).as('lastCreatedDraftId');
          });
      })

      // 2) GET for strong ETag and prepare PATCH body
      .then(() => {
        if (skipPatch) {
          log('info', 'Skipping GET/PATCH status update for drafts already in submitted state');
          return undefined as void;
        }

        return getDraftForPatch(createdId)
          .then(({ response: getResp, etag }) => {
            beforeEtag = etag;
            createdAtFromApi = extractCreatedTimestamp(getResp.body as unknown) ?? createdAtFromApi;

            const body = (getResp.body ?? {}) as Record<string, unknown>;
            const business_unit_id = Number(body['business_unit_id'] ?? body['businessUnitId']);
            const validated_by =
              typeof body['validated_by'] === 'string' && body['validated_by'] ? body['validated_by'] : 'opal-test';

            patchBody = {
              account_status: canonicalStatus,
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

            return cy.wait(DRAFT_PREPATCH_WAIT_MS, { log: false }).then(() =>
              cy
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
                .as('patchDraftAccount'),
            );
          })
          .then((patchResp) => {
            if (![200, 204].includes(patchResp.status)) {
              logPatchFailure('createDraftAndSetStatus', pathForAccount(createdId), patchResp, patchBody, beforeEtag);
            }
            return patchResp;
          })
          .then((patchResp) => {
            expect([200, 204], 'PATCH success').to.include(patchResp.status);

            afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);
            updatedAtFromApi = extractUpdatedTimestamp(patchResp.body as unknown) ?? updatedAtFromApi;

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

            if (Object.keys(patchBody).length) {
              requestPayloads.push({
                source: 'api',
                endpoint: pathForAccount(createdId),
                method: 'PATCH',
                timestamp: updatedAtFromApi ?? new Date().toISOString(),
                payload: { ...patchBody },
              });
            }

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
      .then(() =>
        recordCreatedAccount(
          {
            source: 'api',
            accountType: draftType,
            status: canonicalStatus,
            accountId: createdId,
            accountNumber: numberForUI ?? postAccountNumber ?? undefined,
            createdAt: createdAtFromApi,
            requestSummary: {
              endpoint: createDraftEndpoint,
              method: 'POST',
            },
            requestPayloads: requestPayloads.length ? requestPayloads : undefined,
          },
          requestBody,
        ),
      )
      .then(() => undefined as void)
  );
}

/**
 * Update the most recently created draft account to the provided status.
 *
 * @param newStatus - Status to apply (e.g., "Deleted", "Rejected", "In review").
 * @returns ETag metadata for the update exposed via @etagUpdate.
 *
 * @remarks
 * - Expects `@lastCreatedDraftId` to be set by a prior call to {@link createDraftAndSetStatus}.
 * - Uses GET to capture a strong ETag, then PATCHes the status. No PATCH is skipped here.
 */
export function updateLastCreatedDraftAccountStatus(newStatus: string): Cypress.Chainable<EtagUpdate> {
  return cy.get<number>('@lastCreatedDraftId').then((accountId) => {
    log('action', 'Updating last created draft account status', { accountId, newStatus });
    let beforeEtag = '';

    return getDraftForPatch(accountId)
      .then(({ response: getResp, etag }) => {
        beforeEtag = etag;

        const body = (getResp.body ?? {}) as Record<string, unknown>;
        const business_unit_id = Number(body['business_unit_id'] ?? body['businessUnitId']);
        const validated_by =
          typeof body['validated_by'] === 'string' && body['validated_by'] ? body['validated_by'] : 'opal-test';

        const patchBody: Record<string, unknown> = {
          account_status: newStatus,
          business_unit_id,
          validated_by,
        };

        if (Array.isArray(body['timeline_data'])) {
          patchBody['timeline_data'] = body['timeline_data'];
        }

        log('debug', 'Prepared PATCH body for existing draft', { patchBody, beforeEtag });

        return cy.wait(DRAFT_PREPATCH_WAIT_MS, { log: false }).then(() =>
          cy.request({
            method: 'PATCH',
            url: pathForAccount(accountId),
            headers: {
              'If-Match': beforeEtag,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: patchBody,
            failOnStatusCode: false,
          }),
        );
      })
      .then((patchResp) => {
        const patchBodyKeys = { account_status: newStatus };
        if (![200, 204].includes(patchResp.status)) {
          logPatchFailure(
            'updateLastCreatedDraftAccountStatus',
            pathForAccount(accountId),
            patchResp,
            patchBodyKeys,
            beforeEtag,
          );
        }
        return patchResp;
      })
      .then((patchResp) => {
        expect([200, 204], 'PATCH success').to.include(patchResp.status);

        const afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);
        const accRaw = (patchResp.body as Record<string, unknown> | null | undefined)?.['account_number'];
        const accountNumber = typeof accRaw === 'string' ? accRaw : null;

        const etagUpdate: EtagUpdate = {
          status: patchResp.status,
          etagBefore: beforeEtag,
          etagAfter: afterEtag,
          accountId,
          accountNumber,
        };

        log('action', `Alias @etagUpdate created (Account ${accountNumber ?? 'unknown'})`, { etagUpdate });
        return cy.wrap(etagUpdate, { log: false }).as('etagUpdate');
      });
  });
}

/**
 * Assert the latest draft account update produced a strong ETag (optionally requiring a change).
 *
 * @param requireChange - Whether to require the after ETag to differ from the before ETag. Defaults to
 *                        `Cypress.env('EXPECT_ETAG_CHANGE') === true`.
 * @returns Cypress chainable that performs the assertion.
 * @example
 *   assertLatestDraftUpdateHasStrongEtag();
 */
export function assertLatestDraftUpdateHasStrongEtag(requireChange?: boolean): Cypress.Chainable<void> {
  const shouldChange = requireChange ?? Cypress.env('EXPECT_ETAG_CHANGE') === true;

  return cy
    .get<EtagUpdate>('@etagUpdate')
    .then(({ status, etagBefore, etagAfter }) => {
      log('assert', 'Asserting strong ETag for last draft update', { status, shouldChange });
      expect([200, 204], 'PATCH success status').to.include(status);
      expect(etagAfter, 'Updated ETag').to.be.a('string').and.not.be.empty;
      expect(etagAfter.startsWith('W/'), 'Updated ETag must be strong (no W/)').to.be.false;

      if (shouldChange) {
        expect(etagAfter, 'ETag should change after update').not.to.eq(etagBefore);
      }
    })
    .then(() => Promise.resolve());
}

/**
 * Perform two PATCH requests using the same If-Match header to trigger a conflict on the second request.
 *
 * @param newStatus - Status to apply in the PATCH payload.
 * @returns EtagConflictResult aliased as @etagConflict for later assertions.
 * @example
 *   simulateStaleIfMatchConflict('Publishing Pending');
 */
export function simulateStaleIfMatchConflict(newStatus: string): Cypress.Chainable<EtagConflictResult> {
  return cy.get<number>('@lastCreatedDraftId').then((accountId) => {
    log('action', 'Simulating stale If-Match conflict on draft account', { accountId, newStatus });

    let etagUsed = '';
    let firstStatus = 0;
    let patchBody: Record<string, unknown> = {};

    return cy
      .request({ method: 'GET', url: pathForAccount(accountId), failOnStatusCode: false })
      .then((getResp) => {
        expect(getResp.status, 'GET account').to.eq(200);
        etagUsed = readStrongEtag(getResp.headers as Record<string, unknown>);

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

        log('debug', 'Prepared stale If-Match patch body', { patchBody, etagUsed });

        return cy.request({
          method: 'PATCH',
          url: pathForAccount(accountId),
          headers: {
            'If-Match': etagUsed,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: patchBody,
          failOnStatusCode: false,
        });
      })
      .then((firstPatch) => {
        firstStatus = firstPatch.status;

        return cy.request({
          method: 'PATCH',
          url: pathForAccount(accountId),
          headers: {
            'If-Match': etagUsed,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: patchBody,
          failOnStatusCode: false,
        });
      })
      .then((secondPatch) => {
        const conflict: EtagConflictResult = {
          accountId,
          firstStatus,
          conflictStatus: secondPatch.status,
          etagUsed,
          patchBody,
        };

        log('action', 'Captured stale If-Match conflict result', { ...conflict });
        return cy.wrap(conflict, { log: false }).as('etagConflict');
      });
  });
}

/**
 * Assert that the previously simulated stale If-Match update resulted in a conflict.
 *
 * @param expectedStatus - Expected HTTP status for the conflict (default: 409).
 * @returns Cypress chainable for assertions.
 * @example
 *   assertStaleIfMatchConflict();
 */
export function assertStaleIfMatchConflict(expectedStatus: number = 409): Cypress.Chainable<void> {
  return cy
    .get<EtagConflictResult>('@etagConflict')
    .then(({ firstStatus, conflictStatus, etagUsed, accountId }) => {
      log('assert', 'Asserting stale If-Match conflict outcome', {
        accountId,
        firstStatus,
        conflictStatus,
        expectedStatus,
      });

      expect([200, 204], 'Initial PATCH success status').to.include(firstStatus);
      expect(conflictStatus, 'Stale If-Match should conflict').to.eq(expectedStatus);
      expect(etagUsed, 'ETag used for If-Match').to.be.a('string').and.not.be.empty;
    })
    .then(() => Promise.resolve());
}
