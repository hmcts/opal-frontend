// cypress/support/draftAccounts.ts
import { After } from '@badeball/cypress-cucumber-preprocessor';

/** Store created draft account IDs for cleanup. */
const createdIds: number[] = [];

/** Check: is a plain record/object (not null, not array)? */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Convert unknown to a record or throw error */
function toRecord(v: unknown): Record<string, unknown> {
  if (!isRecord(v)) throw new Error('Expected an object record');
  return v;
}

/** Guard for a jQuery element without any casts. */
function isJQueryElement(input: unknown): input is JQuery<HTMLElement> {
  return (
    typeof input === 'object' &&
    input !== null &&
    'text' in input &&
    typeof (input as { text?: unknown }).text === 'function' &&
    'attr' in input &&
    typeof (input as { attr?: unknown }).attr === 'function'
  );
}

/**
 * - Return number if all digits; otherwise a string.
 */
function normalizeIdInput(input: number | string | JQuery<HTMLElement>): number | string {
  if (typeof input === 'number') return input;
  if (typeof input === 'string') return /^\d+$/.test(input) ? Number(input) : input;

  // jQuery path
  const byAttr = String(input.attr('data-id') ?? '').trim();
  const raw = byAttr.length > 0 ? byAttr : input.text().trim();
  return /^\d+$/.test(raw) ? Number(raw) : raw;
}

/** Build the API path for a draft account. Accepts number | string | jQuery element. */
export function pathForAccount(id: number | string | JQuery<HTMLElement>): string {
  let norm: number | string;
  if (isJQueryElement(id)) {
    norm = normalizeIdInput(id);
  } else if (typeof id === 'number' || typeof id === 'string') {
    norm = normalizeIdInput(id);
  } else {
    throw new Error('pathForAccount: id must be number, string, or jQuery element');
  }

  const asNum = typeof norm === 'number' ? norm : Number(norm);
  const finalId = Number.isFinite(asNum) ? String(asNum) : String(norm);
  return `/opal-fines-service/draft-accounts/${encodeURIComponent(finalId)}`;
}

//* Build the path for defendant accounts. Accepts number | string | jQuery element. */
export function pathForDefendantAccount(id: number | string | JQuery<HTMLElement>): string {
  let norm: number | string;
  if (isJQueryElement(id)) {
    norm = normalizeIdInput(id);
  } else if (typeof id === 'number' || typeof id === 'string') {
    norm = normalizeIdInput(id);
  } else {
    throw new Error('pathForDefendantAccount: id must be number, string, or jQuery element');
  }

  const asNum = typeof norm === 'number' ? norm : Number(norm);
  const finalId = Number.isFinite(asNum) ? String(asNum) : String(norm);
  return `/opal-fines-service/defendant-accounts/${encodeURIComponent(finalId)}`;
}

//* Build the testing support path for defendant accounts. Accepts number | string | jQuery element. */
export function pathForDefAccountTestSupport(id: number | string | JQuery<HTMLElement>): string {
  let norm: number | string;
  if (isJQueryElement(id)) {
    norm = normalizeIdInput(id);
  } else if (typeof id === 'number' || typeof id === 'string') {
    norm = normalizeIdInput(id);
  } else {
    throw new Error('pathForDefAccountTestSupport: id must be number, string, or jQuery element');
  }

  const asNum = typeof norm === 'number' ? norm : Number(norm);
  const finalId = Number.isFinite(asNum) ? String(asNum) : String(norm);
  return `opal-fines-service/testing-support/defendant-accounts/${encodeURIComponent(finalId)}`;
}

/** Extract an ID from a jQuery element’s text or a specific attribute. */
export function extractIdFromElement(
  $el: JQuery<HTMLElement>,
  source: 'text' | { attr: string } = 'text',
): number | string {
  const raw = source === 'text' ? $el.text().trim() : String($el.attr(source.attr) ?? '').trim();
  return /^\d+$/.test(raw) ? Number(raw) : raw;
}

/** Parse a value that must represent a numeric ID; throw if not */
export function parseNumericId(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value);
  throw new Error(`Expected numeric id, got: ${JSON.stringify(value)}`);
}

/** Read ['draft_account_id'] from an unknown response body */
export function readDraftIdFromBody(body: unknown): number {
  const rec = toRecord(body);
  const raw = rec['draft_account_id'];
  return parseNumericId(raw);
}

/** Record a created id and stash latest for cross-file access. */
export function recordCreatedId(id: number): void {
  createdIds.push(id);
  Cypress.env('lastDraftAccountId', String(id));
}

/** Return the last created id or fail. */
export function lastCreatedIdOrFail(): number {
  const fromArray = createdIds.at(-1);
  const fromEnv = Cypress.env('lastDraftAccountId');
  const envNum = typeof fromEnv === 'string' && /^\d+$/.test(fromEnv) ? Number(fromEnv) : undefined;
  const candidate = fromArray ?? envNum;
  expect(candidate, 'at least one created account').to.exist;
  return Number(candidate);
}

/** Collect all known IDs. */
function getAllIds(): number[] {
  const envStr = Cypress.env('lastDraftAccountId');
  const envNum = typeof envStr === 'string' && /^\d+$/.test(envStr) ? Number(envStr) : undefined;
  const all = [...createdIds, ...(envNum != null ? [envNum] : [])];
  return Array.from(new Set(all)).filter((n): n is number => Number.isFinite(n));
}

/** Clear the module store and the env fallback. */
function clearAllIds(): void {
  createdIds.length = 0;
  Cypress.env('lastDraftAccountId', null);
}

/** Read resource for cleanup and return {status, etag?} without assertions. */
function readForDelete(base: string) {
  return cy
    .request({ method: 'GET', url: base, headers: { Accept: 'application/json' }, failOnStatusCode: false })
    .then((resp) => {
      const hdrs = toRecord(resp.headers);
      const raw = hdrs['etag'];
      const etag = typeof raw === 'string' ? raw : undefined;
      // defendant account ID if its present in the body return it, else undefined
      const defAccId: number | undefined = resp.body.account_id;
      return { status: resp.status, etag, defAccId };
    });
}

/** DELETE */
function tolerantDelete(base: string) {
  return cy.request({ method: 'DELETE', url: `${base}?ignore_missing=true`, failOnStatusCode: false });
}

/** DELETE with strong If-Match when provided. */
function strongDelete(base: string, etag: string) {
  return cy.request({ method: 'DELETE', url: base, headers: { 'If-Match': etag }, failOnStatusCode: false });
}

/** Prefer strong If-Match delete when we have a strong ETag. */
function deleteWithPreference(base: string) {
  return readForDelete(base).then(({ status, etag }) => {
    if (status === 404) return tolerantDelete(base);
    if (typeof etag === 'string' && !etag.startsWith('W/')) {
      return strongDelete(base, etag);
    }
    return tolerantDelete(base);
  });
}

/** DELETE defendant account */
function deleteDefAccount(base: string) {
  return cy.request({ method: 'DELETE', url: base, headers: { Accept: 'application/json' }, failOnStatusCode: false });
}

/**
 * Delete Defendant Accounts and associated data.
 * When an account is promoted, rows are created in many tables.
 * As a result there exists a test support API endpoint to delete defendant accounts correctly.
 * This function will get the defendant account ID from the draft account details
 * and call the delete defendant account endpoint, this will be called for each draft account ID passed in.
 * The promotion of the account may also create a minor creditor account, this will also be deleted if it exists.
 */
function deleteDefAccountFromDraft(draftBase: string) {
  return readForDelete(draftBase).then(({ status, defAccId }) => {
    if (status === 404 || defAccId === undefined) return;
    const defAccBase = pathForDefAccountTestSupport(defAccId);
    //Future Delete associated minor creditor account first if it exists.

    // Now delete the defendant account
    return deleteDefAccount(defAccBase).then((delResp) => {
      const status = delResp.status;
      if (![200, 204, 404].includes(status)) {
        cy.log(`cleanup DELETE defendant account ${defAccId} → ${status}`);
      }
    });
  });
}

/** Global After hook that cleans up any created draft accounts. */
export function installDraftAccountCleanup(): void {
  afterEach(() => {
    const ids = getAllIds();
    clearAllIds();
    if (ids.length === 0) return;

    // First delete any promoted defendant accounts
    return cy.wrap(ids, { log: false }).each((idNum: number) => {
      const base = pathForAccount(idNum); // idNum is a number
      return deleteDefAccountFromDraft(base).then(() => {
        // Now delete the draft account itself
        return deleteWithPreference(base).then((delResp) => {
          const status = delResp.status;
          if (![200, 204, 404].includes(status)) {
            cy.log(`cleanup DELETE ${idNum} → ${status}`);
          }
        });
      });
    });
  });
}
