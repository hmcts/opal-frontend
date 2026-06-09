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
import { getDraftPayloadFile, type DraftPayloadType } from '../../../../../support/utils/payloads';
import { readDraftIdFromBody, recordCreatedId } from '../../../../../support/draftAccounts';
import {
  extractAccountNumber,
  extractCreatedTimestamp,
  extractUpdatedTimestamp,
  recordCreatedAccount,
  recordFailedAccount,
  summarizeErrorPayload,
} from '../../../../../support/utils/accountCapture';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { performLogin } from '../login.actions';
import {
  findBusinessUnitUser,
  readUserDisplayName,
  requestLoggedInUserState,
  type UserStateRecord,
} from '../user-state.actions';

// Scoped logger used by all draft-account API actions in this module.
const log = createScopedLogger('DraftAccountApiActions');
// Base endpoint for draft-account create requests.
const createDraftEndpoint = '/opal-fines-service/draft-accounts';
// Maximum number of GET retries when waiting for a strong draft ETag.
const DRAFT_ETAG_RETRY_ATTEMPTS = 3;
// Delay between GET retries while waiting for the draft to become patchable.
const DRAFT_ETAG_RETRY_DELAY_MS = 750;
// Short wait after login before sending the draft PATCH request.
const DRAFT_PREPATCH_WAIT_MS = 500;
// Poll window for the published account search index used by downstream UI journeys.
const PUBLISHED_ACCOUNT_SEARCH_RETRY_ATTEMPTS = 6;
const PUBLISHED_ACCOUNT_SEARCH_RETRY_DELAY_MS = 1_000;

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
  // ETag value read from either lowercase or canonical response headers.
  const etag = (headers['etag'] ?? headers['ETag'] ?? '') as string;
  expect(etag, 'ETag header must exist').to.be.a('string').and.not.be.empty;
  expect(etag.startsWith('W/'), 'ETag must be strong (no W/)').to.be.false;
  return etag;
}

// Narrowing helper for plain object checks before property access.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Safe ETag reader that returns an empty string instead of throwing.
const safeReadStrongEtag = (headers: Record<string, unknown>): string => {
  try {
    return readStrongEtag(headers);
  } catch {
    return '';
  }
};

// Redacts an error payload down to a small set of safe diagnostic fields.
const extractSafeErrorDetails = (payload: unknown): Record<string, unknown> => {
  if (!isRecord(payload)) return {};
  // Allow-list of response keys safe to include in Cypress and task logs.
  const allowedKeys = ['status', 'code', 'errorCode', 'traceId', 'correlationId', 'path'];
  // Accumulator for the redacted error details returned to callers.
  const details: Record<string, unknown> = {};
  allowedKeys.forEach((key) => {
    // Current payload value for the allow-listed key being processed.
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

// Produces a short, log-safe string summary of any response payload.
const summarizeResponseBodyForLog = (payload: unknown): string => {
  if (payload === undefined) {
    return '(empty response body)';
  }

  try {
    // Serialized form used when the payload can be JSON-stringified safely.
    const serialized = JSON.stringify(payload);
    if (typeof serialized === 'string') {
      return serialized.slice(0, 500);
    }
  } catch {
    // Fall through to String(payload) when JSON serialization fails.
  }

  return String(payload).slice(0, 500);
};

const isCompanyDraftRequest = (payload: Record<string, unknown>): boolean => {
  const account = isRecord(payload['account']) ? payload['account'] : undefined;
  const defendant = account && isRecord(account['defendant']) ? account['defendant'] : undefined;

  return account?.['defendant_type'] === 'company' || defendant?.['company_flag'] === true;
};

const buildPublishedAccountNumberSearchPayload = (
  accountNumber: string,
  isCompany: boolean,
): Record<string, unknown> => ({
  active_accounts_only: false,
  consolidation_search: false,
  business_unit_ids: null,
  reference_number: {
    account_number: accountNumber,
    prosecutor_case_reference: null,
    organisation: isCompany,
  },
  defendant: null,
});

const hasSearchResult = (payload: unknown): boolean => {
  if (!isRecord(payload)) return false;

  const count = payload['count'];
  if (typeof count === 'number' && count > 0) return true;

  const defendantAccounts = payload['defendant_accounts'];
  if (Array.isArray(defendantAccounts) && defendantAccounts.length > 0) return true;

  const searchData = payload['searchData'];
  return Array.isArray(searchData) && searchData.length > 0;
};

/**
 * Removes any account-status override coming from DataTable payload overrides.
 *
 * Status is controlled by `newStatus` via `resolveTargetStatus()` and, when required,
 * the subsequent PATCH request. Keeping `account_status` in the POST body can cause
 * environment-specific validation failures (e.g. 400 in CI), so we strip it here to
 * keep create-and-update behavior deterministic.
 * @param overrides - Object containing overrides from the DataTable payload.
 * @returns A sanitized object with any account_status keys removed.
 */
const stripAccountStatusOverride = (overrides: Record<string, unknown>): Record<string, unknown> => {
  // Shallow clone so the caller's override object is not mutated.
  const sanitized = { ...overrides };
  // Matching override keys that should not be forwarded into the POST payload.
  const removedKeys = Object.keys(sanitized).filter((key) => key.trim().toLowerCase() === 'account_status');
  removedKeys.forEach((key) => {
    delete sanitized[key];
  });
  if (removedKeys.length) {
    log('warn', 'Ignoring account_status override from table for POST payload', { removedKeys });
  }
  return sanitized;
};

// Removes backend-owned fields from draft account request payloads.
const stripBackendOwnedDraftRequestFields = (
  payload: Record<string, unknown>,
  context: string,
): Record<string, unknown> => {
  const sanitized = { ...payload };
  const removedKeys = ['timeline_data'].filter((key) => Object.prototype.hasOwnProperty.call(sanitized, key));

  removedKeys.forEach((key) => {
    delete sanitized[key];
  });

  if (removedKeys.length) {
    log('warn', `Omitting backend-owned fields from ${context} payload`, { removedKeys });
  }

  return sanitized;
};

// Reads the draft/account identifier from any of the known response field names.
const readNumericId = (body: Record<string, unknown>): number | undefined => {
  // Raw identifier value before coercion to a numeric id.
  const raw = body['draft_account_id'] ?? body['id'] ?? body['account_id'];
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && /^\d+$/.test(raw)) return Number(raw);
  return undefined;
};

// Builds a compact summary of a PATCH response for JSON evidence output.
const buildPatchResponseSummary = (
  patchResp: Cypress.Response<unknown>,
  etag: string,
  updatedAt?: string,
): Record<string, unknown> => {
  // Response body narrowed to a plain object when available.
  const body = isRecord(patchResp.body) ? patchResp.body : undefined;
  // Base response summary persisted alongside the PATCH evidence payload.
  const summary: Record<string, unknown> = {
    status: patchResp.status,
    etag,
    updatedAt,
  };

  if (body) {
    summary['responseKeys'] = Object.keys(body);

    // Response fields safe to copy into the persisted summary.
    const allowedKeys = [
      'draft_account_id',
      'business_unit_id',
      'created_at',
      'submitted_by',
      'submitted_by_name',
      'account_type',
      'account_status',
      'account_status_date',
      'account_number',
      'timeline_data',
    ];

    allowedKeys.forEach((key) => {
      // Current response value for the allow-listed summary field.
      const value = body[key];
      if (value !== undefined) {
        summary[key] = value;
      }
    });

    // Normalized status date read from either of the known backend field names.
    const statusDate =
      typeof body['account_status_date'] === 'string'
        ? body['account_status_date']
        : typeof body['status_date'] === 'string'
          ? body['status_date']
          : undefined;
    if (statusDate && summary['account_status_date'] === undefined) {
      summary['account_status_date'] = statusDate;
    }

    // Numeric draft/account identifier extracted from the PATCH response body.
    const accountId = readNumericId(body);
    if (typeof accountId === 'number') summary['account_id'] = accountId;

    if (summary['account_number'] === undefined) {
      // Nested account object used as a fallback source for the account number.
      const account = isRecord(body['account']) ? body['account'] : null;
      // Account number read from the nested account object when present.
      const nestedAccountNumber = account ? account['account_number'] : undefined;
      if (typeof nestedAccountNumber === 'string' && nestedAccountNumber.trim()) {
        summary['account_number'] = nestedAccountNumber;
      }
    }
  }

  return summary;
};

// String guard used when normalizing optional API values.
const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

// Resolves the current user's BU-specific business user id for the target business unit.
const readBusinessUnitUserId = (
  userStateBody: UserStateRecord,
  businessUnitId: number,
  fallback?: string | null,
): string | null => {
  // Membership record that matches the draft's business unit id.
  const matchedBusinessUnit = findBusinessUnitUser(userStateBody, businessUnitId);

  if (!isRecord(matchedBusinessUnit)) {
    return fallback ?? null;
  }

  // Business-unit user id taken from the matched membership record.
  const businessUnitUserId = matchedBusinessUnit['business_unit_user_id'];
  return isNonEmptyString(businessUnitUserId) ? businessUnitUserId : (fallback ?? null);
};

// Builds a UI-like PATCH payload for status changes on an existing draft.
const buildDraftPatchPayload = (
  draftBody: Record<string, unknown>,
  userStateBody: UserStateRecord,
  status: string,
  reasonText: string | null = null,
): Record<string, unknown> => {
  // Draft business unit id, normalized from either snake_case or camelCase fields.
  const business_unit_id = Number(draftBody['business_unit_id'] ?? draftBody['businessUnitId']);
  // Existing validated_by value used as a fallback when user-state lookup fails.
  const existingValidatedBy = isNonEmptyString(draftBody['validated_by']) ? draftBody['validated_by'] : null;
  // Current checker's business-unit user id for the draft business unit.
  const validatedBy = readBusinessUnitUserId(userStateBody, business_unit_id, existingValidatedBy);
  // Human-readable checker name used in patch metadata.
  const validatedByName = readUserDisplayName(userStateBody);

  return {
    account_status: status,
    business_unit_id,
    reason_text: reasonText,
    validated_by: status.toLowerCase() === 'rejected' ? null : validatedBy,
    validated_by_name: status.toLowerCase() === 'rejected' ? null : validatedByName,
    version: String(draftBody['version'] ?? '0'),
  };
};

const applyCurrentSubmitterToDraftRequest = (
  draftBody: Record<string, unknown>,
  userStateBody: UserStateRecord,
): void => {
  const businessUnitId = Number(draftBody['business_unit_id'] ?? draftBody['businessUnitId']);
  if (!Number.isFinite(businessUnitId)) return;

  const submittedBy = readBusinessUnitUserId(userStateBody, businessUnitId, null);
  if (submittedBy) {
    draftBody['submitted_by'] = submittedBy;
  }

  if (!isNonEmptyString(draftBody['submitted_by_name'])) {
    const submittedByName = readUserDisplayName(userStateBody);
    if (submittedByName) {
      draftBody['submitted_by_name'] = submittedByName;
    }
  }

  log('info', 'Prepared draft submitter from current user state', {
    businessUnitId,
    hasSubmittedBy: isNonEmptyString(draftBody['submitted_by']),
    hasSubmittedByName: isNonEmptyString(draftBody['submitted_by_name']),
  });
};

// Logs a PATCH failure in a redacted, evidence-friendly format.
const logPatchFailure = (
  context: string,
  endpoint: string,
  patchResp: Cypress.Response<unknown>,
  patchBody: Record<string, unknown>,
  ifMatch: string,
): Cypress.Chainable<Cypress.Response<unknown>> => {
  // Safe subset of the error response body to include in diagnostics.
  const safeDetails = extractSafeErrorDetails(patchResp.body);
  // Structured failure details sent to the Cypress log and task logger.
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
  return cy
    .task('log:message', { message: 'PATCH /draft-accounts failed', details: logDetails }, { log: false })
    .then(() => patchResp);
};

type DraftForPatchResult = { response: Cypress.Response<unknown>; etag: string };

// Fetches the latest draft plus a strong ETag, retrying until one is available.
const getDraftForPatch = (
  accountId: number,
  attempts: number = DRAFT_ETAG_RETRY_ATTEMPTS,
  delayMs: number = DRAFT_ETAG_RETRY_DELAY_MS,
): Cypress.Chainable<DraftForPatchResult> => {
  // Recursive retry helper used while waiting for the draft to become patchable.
  const attempt = (remaining: number): Cypress.Chainable<DraftForPatchResult> =>
    cy.request({ method: 'GET', url: pathForAccount(accountId), failOnStatusCode: false }).then((getResp) => {
      // Strong ETag value read when the draft GET succeeds.
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

const waitForPublishedAccountSearchable = (
  accountNumber: string,
  isCompany: boolean,
  attempts: number = PUBLISHED_ACCOUNT_SEARCH_RETRY_ATTEMPTS,
  delayMs: number = PUBLISHED_ACCOUNT_SEARCH_RETRY_DELAY_MS,
): Cypress.Chainable<void> => {
  const body = buildPublishedAccountNumberSearchPayload(accountNumber, isCompany);

  const attempt = (remaining: number): Cypress.Chainable<void> =>
    cy
      .request({
        method: 'POST',
        url: '/opal-fines-service/defendant-account/search',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
        failOnStatusCode: false,
      })
      .then((searchResp) => {
        const matched = searchResp.status === 200 && hasSearchResult(searchResp.body);
        if (matched) {
          log('done', 'Published account is searchable', { accountNumber, isCompany });
          return undefined;
        }

        if (remaining <= 1) {
          throw new Error(
            `Published account ${accountNumber} was not searchable after ${attempts} attempts. ` +
              `Last status ${searchResp.status}: ${summarizeResponseBodyForLog(searchResp.body)}`,
          );
        }

        log('warn', 'Published account search not ready, retrying', {
          accountNumber,
          isCompany,
          status: searchResp.status,
          remaining: remaining - 1,
        });
        return cy.wait(delayMs, { log: false }).then(() => attempt(remaining - 1)) as unknown as void;
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
 * @param overrides - Nested override object for the draft payload (values can include Account_status).
 * @param user - Identifier for the user performing the publishing action (for logging/evidence).
 * @param returnToUser - Identifier for the user to return to after status update (for logging/evidence).
 * @returns A Cypress chainable that resolves when the draft is created and updated
 *
 * @remarks
 * - Fixtures default `account_status` to "Submitted"; POST alone leaves the draft in that state.
 * - Any other status requires a PATCH after creation; we skip PATCH when the target is effectively "Submitted" (including the "In review" alias).
 * - Status source order: explicit step argument (e.g., `set status "Rejected"`) > `Account_status` row in the table > helper defaults.
 */
export function createDraftAndSetStatus(
  draftType: DraftPayloadType,
  newStatus: string,
  overrides: Record<string, unknown>,
  user: string,
  returnToUser: string,
): Cypress.Chainable<void> {
  /**
   * Normalizes a requested status into an API-compatible value and determines
   * whether a PATCH call is required to update the draft after creation.
   *
   * @param status - Raw status string provided by the test
   * @returns An object containing:
   *  - canonicalStatus: the status value understood by the API
   *  - skipPatch: whether the status PATCH request should be skipped
   */
  const resolveTargetStatus = (status: string): { canonicalStatus: string; skipPatch: boolean } => {
    /** Trim whitespace to prevent accidental mismatches */
    const trimmed = status.trim();
    /** Lowercased version used strictly for comparison logic */
    const normalized = trimmed.toLowerCase();

    /**
     * The API does not recognize "In review" as a valid state.
     * Drafts awaiting review must be created in the "Submitted" state.
     *
     * In this case, we:
     * - Map "In review" to "Submitted"
     * - Skip the PATCH call because the draft is already created
     *   in the correct backend state
     */
    if (normalized === 'in review') {
      // API only understands "Submitted" for drafts awaiting review; map "In review" inputs to that state and skip PATCH.
      return { canonicalStatus: 'Submitted', skipPatch: true };
    }

    /**
     * Default handling for all other statuses:
     * - Use the trimmed status value as-is
     * - Skip PATCH only when the target status is "Submitted",
     *   since drafts are created in that state by default
     */
    return { canonicalStatus: trimmed, skipPatch: normalized === 'submitted' };
  };

  /** Resolve the final API-compatible status and PATCH behavior */
  const { canonicalStatus, skipPatch } = resolveTargetStatus(newStatus);
  /**
   * Sanitize the override object before merging it into the draft payload.
   */
  const sanitizedOverrides = stripAccountStatusOverride(overrides);

  /** Load the base draft payload fixture for the specified draft type */
  const draftFixture = getDraftPayloadFile(draftType);

  log('action', `Creating ${draftType} draft and setting status to ${canonicalStatus}`, {
    draftType,
    newStatus,
    canonicalStatus,
    overrides: sanitizedOverrides,
    user,
    returnToUser,
  });

  // Local state accumulated across steps (used for evidence + ETag tracking).
  let requestBody: Record<string, unknown> = {};
  let patchBody: Record<string, unknown> = {};
  let createdId = 0;
  let beforeEtag = '';
  let afterEtag = '';
  let numberForUI: string | null = null;
  let postAccountNumber: string | undefined;
  let createdAtFromApi: string | undefined;
  let updatedAtFromApi: string | undefined;
  // Ordered request/response payloads recorded as JSON evidence for the created draft.
  const requestPayloads: Array<{
    source: 'api';
    endpoint?: string;
    method?: string;
    timestamp: string;
    payload: Record<string, unknown>;
    direction?: 'request' | 'response';
  }> = [];

  return (
    cy
      // Load base fixture and merge overrides before creating the draft.
      .fixture(`draftAccounts/${draftFixture}`)
      .then((base) => {
        requestBody = stripBackendOwnedDraftRequestFields(merge({}, base, sanitizedOverrides), 'POST /draft-accounts');
      })
      .then(() =>
        requestLoggedInUserState().then((userStateBody) => {
          applyCurrentSubmitterToDraftRequest(requestBody, userStateBody);
          return cy.wrap<void>(undefined, { log: false });
        }),
      )

      // 1) POST create the draft account.
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
            cy.log(`POST /draft-accounts -> ${postResp.status}: ${summarizeResponseBodyForLog(postResp.body)}`);
            createdAtFromApi = extractCreatedTimestamp(postResp.body as unknown) ?? createdAtFromApi;
            // Capture failures in evidence even before assertions.
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

            // Draft id returned by POST /draft-accounts for downstream PATCH and aliases.
            const draftId = readDraftIdFromBody(postResp.body);
            if (draftId === undefined) {
              throw new Error(`Expected draft_account_id in response body: ${JSON.stringify(postResp.body)}`);
            }
            createdId = draftId;
            recordCreatedId(createdId);
            postAccountNumber = extractAccountNumber(postResp.body as unknown);
            log('done', 'Draft account created', { createdId });
            cy.wrap(createdId, { log: false }).as('lastCreatedDraftId');
          });
      })

      // 2) GET for strong ETag and prepare PATCH body (if status change needed).
      .then(() => {
        if (skipPatch) {
          log('info', 'Skipping GET/PATCH status update for drafts already in submitted state');
          return undefined as void;
        }

        return getDraftForPatch(createdId)
          .then(({ response: getResp, etag }) => {
            beforeEtag = etag;
            createdAtFromApi = extractCreatedTimestamp(getResp.body as unknown) ?? createdAtFromApi;

            log('info', `Switching to user ${user} for status update`, { user });
            performLogin(user);

            return cy.wait(DRAFT_PREPATCH_WAIT_MS, { log: false }).then(() =>
              requestLoggedInUserState().then((userStateBody) => {
                // Latest draft snapshot used to build the status PATCH payload.
                const body = (getResp.body ?? {}) as Record<string, unknown>;
                patchBody = buildDraftPatchPayload(body, userStateBody, canonicalStatus);

                log('done', 'Prepared PATCH body and captured strong ETag', {
                  beforeEtag,
                  patchBodyKeys: Object.keys(patchBody),
                  validated_by: patchBody['validated_by'],
                  validated_by_name: patchBody['validated_by_name'],
                  version: patchBody['version'],
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
                  .as('patchDraftAccount');
              }),
            );
          })
          .then((patchResp) => {
            if (![200, 204].includes(patchResp.status)) {
              return logPatchFailure(
                'createDraftAndSetStatus',
                pathForAccount(createdId),
                patchResp,
                patchBody,
                beforeEtag,
              );
            }
            return cy.wrap(patchResp, { log: false });
          })
          .then((patchResp) => {
            expect([200, 204], 'PATCH success').to.include(patchResp.status);

            afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);
            updatedAtFromApi = extractUpdatedTimestamp(patchResp.body as unknown) ?? updatedAtFromApi;

            // Optional guard when the test suite expects a new ETag after updates.
            if (Cypress.env('EXPECT_ETAG_CHANGE') === true) {
              expect(afterEtag, 'ETag should change after update').not.to.eq(beforeEtag);
            }

            // a) Extract account number from response (if publish succeeds).
            // Optional chaining + bracket notation for index signature access
            const accRaw = (patchResp.body as Record<string, unknown> | null | undefined)?.['account_number'];
            numberForUI = typeof accRaw === 'string' ? accRaw : null;

            // b) Alias metadata for downstream tests.
            log('action', `Alias @etagUpdate created (Account ${numberForUI ?? 'unknown'})`, {
              etagBefore: beforeEtag,
              etagAfter: afterEtag,
              accountId: createdId,
              accountNumber: numberForUI,
              status: patchResp.status,
            });

            // Record PATCH request/response metadata for evidence output.
            if (Object.keys(patchBody).length) {
              requestPayloads.push({
                source: 'api',
                endpoint: pathForAccount(createdId),
                method: 'PATCH',
                timestamp: updatedAtFromApi ?? new Date().toISOString(),
                payload: { ...patchBody },
                direction: 'request',
              });
              requestPayloads.push({
                source: 'api',
                endpoint: pathForAccount(createdId),
                method: 'PATCH',
                timestamp: updatedAtFromApi ?? new Date().toISOString(),
                payload: buildPatchResponseSummary(patchResp, afterEtag, updatedAtFromApi),
                direction: 'response',
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

            performLogin(returnToUser);
            log('info', `Returned to user ${returnToUser} after status update`, { returnToUser });

            const publishedAccountNumber = numberForUI ?? postAccountNumber ?? null;
            if (publishedAccountNumber) {
              return waitForPublishedAccountSearchable(publishedAccountNumber, isCompanyDraftRequest(requestBody));
            }

            return undefined;
          });
      })

      // 3) Persist evidence for created drafts (JSON artifacts).
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
      .then(() => undefined as void) as Cypress.Chainable<void>
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
    // Strong ETag captured before PATCHing the existing draft.
    let beforeEtag = '';

    return getDraftForPatch(accountId)
      .then(({ response: getResp, etag }) => {
        beforeEtag = etag;
        return cy.wait(DRAFT_PREPATCH_WAIT_MS, { log: false }).then(() =>
          requestLoggedInUserState().then((userStateBody) => {
            // PATCH body built from the current draft snapshot and logged-in user.
            const patchBody = buildDraftPatchPayload(
              (getResp.body ?? {}) as Record<string, unknown>,
              userStateBody,
              newStatus,
            );

            log('debug', 'Prepared PATCH body for existing draft', { patchBody, beforeEtag });

            return cy.request({
              method: 'PATCH',
              url: pathForAccount(accountId),
              headers: {
                'If-Match': beforeEtag,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: patchBody,
              failOnStatusCode: false,
            });
          }),
        );
      })
      .then((patchResp) => {
        // Minimal failure context used if the PATCH response is unsuccessful.
        const patchBodyKeys = { account_status: newStatus };
        if (![200, 204].includes(patchResp.status)) {
          return logPatchFailure(
            'updateLastCreatedDraftAccountStatus',
            pathForAccount(accountId),
            patchResp,
            patchBodyKeys,
            beforeEtag,
          );
        }
        return cy.wrap(patchResp, { log: false });
      })
      .then((patchResp) => {
        expect([200, 204], 'PATCH success').to.include(patchResp.status);

        // Updated strong ETag returned after the draft status PATCH.
        const afterEtag = readStrongEtag(patchResp.headers as Record<string, unknown>);
        // Account number surfaced from the PATCH response for downstream assertions.
        const accRaw = (patchResp.body as Record<string, unknown> | null | undefined)?.['account_number'];
        const accountNumber = typeof accRaw === 'string' ? accRaw : null;

        // Alias payload exposed to later steps after a successful status update.
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
  // Whether the assertion should require the ETag to change across the update.
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

    // Original strong ETag intentionally reused across both PATCH requests.
    let etagUsed = '';
    // HTTP status returned by the first PATCH request.
    let firstStatus = 0;
    // Shared PATCH body used for both the initial update and the stale retry.
    let patchBody: Record<string, unknown> = {};

    return cy
      .request({ method: 'GET', url: pathForAccount(accountId), failOnStatusCode: false })
      .then((getResp) => {
        expect(getResp.status, 'GET account').to.eq(200);
        etagUsed = readStrongEtag(getResp.headers as Record<string, unknown>);
        return requestLoggedInUserState().then((userStateBody) => {
          // PATCH body built once so the second request can intentionally reuse it.
          patchBody = buildDraftPatchPayload((getResp.body ?? {}) as Record<string, unknown>, userStateBody, newStatus);

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
        // Captured conflict details exposed for later stale If-Match assertions.
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
