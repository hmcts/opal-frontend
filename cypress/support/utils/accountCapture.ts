/**
 * @file accountCapture.ts
 * @description Browser-side helpers for capturing account creation/failure details during Cypress runs. Typical call order: deriveRequestSummary/summarizeErrorPayload → recordCreatedAccount/recordFailedAccount → Node tasks persist to disk.
 *
 * Status semantics (set by action helpers, persisted by Node task):
 * - API create: status comes from the canonical draft status (e.g., Submitted/Rejected) in createDraftAndSetStatus.
 * - UI submit: status is "Created" for new drafts, "Updated" for resubmits; updatedAt is set on updates only.
 * - Failures: go to accounts.failed with httpStatus + errorSummary; no created entry is written.
 */
import { getUniqSuffix } from './stringUtils';
import { getCurrentScenarioFinishedAt, getCurrentScenarioStartedAt, getCurrentScenarioTitle } from './scenarioContext';

type RequestLike = {
  url?: string;
  path?: string;
  method?: string;
};

type RequestPayloadEntry = {
  source: 'api' | 'ui';
  endpoint?: string;
  method?: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

type CreatedAccountInput = {
  source: 'api' | 'ui';
  accountType: string;
  status?: string;
  accountId?: number;
  accountNumber?: string | null;
  uniq?: string;
  scenario?: string;
  createdAt?: string;
  updatedAt?: string;
  scenarioStartedAt?: string;
  scenarioFinishedAt?: string;
  requestSummary?: {
    endpoint: string;
    method: string;
  };
  requestPayloads?: RequestPayloadEntry[];
};

type FailedAccountInput = {
  source: 'api' | 'ui';
  accountType: string;
  httpStatus: number;
  errorSummary?: string;
  requestSummary: {
    endpoint: string;
    method: string;
  };
  uniq?: string;
  scenario?: string;
  timestamp?: string;
  scenarioStartedAt?: string;
  scenarioFinishedAt?: string;
};

type AccountFailedRecord = FailedAccountInput & {
  scenario: string;
  uniq: string;
  errorSummary: string;
  timestamp: string;
  scenarioStartedAt: string;
  scenarioFinishedAt?: string;
};

type AccountCreatedRecord = Omit<CreatedAccountInput, 'requestSummary'> & {
  scenario: string;
  uniq: string;
  createdAt: string;
  accountId: number;
  updatedAt?: string;
  scenarioStartedAt: string;
  scenarioFinishedAt?: string;
};

// Allow a generous error summary length to aid debugging while keeping artifacts readable.
const ERROR_MAX_LENGTH = 4000;

/**
 * @description Truncate a string to a maximum length, appending an ellipsis when shortened.
 * @param value - The input string to truncate.
 * @param max - Optional maximum length (defaults to ERROR_MAX_LENGTH).
 * @example truncate('long message', 10) // "long messa…"
 */
function truncate(value: string, max: number = ERROR_MAX_LENGTH): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

/**
 * @description Type guard to check if a value is a non-null, non-array object.
 * @param value - The value to test.
 * @example if (isRecord(payload)) {
 *   // safely access keys
 * }
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @description Attempt to parse arbitrary input into a plain object.
 * @param raw - Unknown value to parse.
 * @example const body = parseBody(response.body);
 */
function parseBody(raw: unknown): Record<string, unknown> | null {
  if (isRecord(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * @description Normalize a URL/path to its pathname, preserving input on parse failures.
 * @param endpoint - Raw endpoint or URL string.
 * @example const pathOnly = normalizeEndpoint('/opal-fines-service/draft-accounts');
 */
function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return '';
  try {
    const url = new URL(endpoint, 'http://placeholder.local');
    return url.pathname || endpoint;
  } catch {
    return endpoint;
  }
}

const CREATED_TIMESTAMP_KEYS = ['created_date', 'createdDate', 'created_at', 'createdAt'];
const UPDATED_TIMESTAMP_KEYS = [
  'account_status_date',
  'accountStatusDate',
  'updated_date',
  'updatedDate',
  'updated_at',
  'updatedAt',
  'status_date',
  'statusDate',
];

/**
 * @description Normalize a timestamp string if parseable.
 * @param value - Raw value to normalize.
 * @example const createdAt = normalizeTimestamp(record.created_date);
 */
function normalizeTimestamp(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? trimmed : new Date(parsed).toISOString();
}

/**
 * @description Read a timestamp value from a record by checking known keys.
 * @param record - Record to scan.
 * @param keys - Candidate keys to check.
 * @example const createdAt = readTimestamp(record, CREATED_TIMESTAMP_KEYS);
 */
function readTimestamp(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const normalized = normalizeTimestamp(record[key]);
    if (normalized) return normalized;
  }
  return undefined;
}

/**
 * @description Safely stringify a value for de-duplication keys.
 * @param value - Value to serialize.
 * @example const key = safeStringify(payload);
 */
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * @description Normalize the request payload into a structured entry when possible.
 * @param source - Capture source (api/ui).
 * @param requestSummary - Optional request summary for endpoint/method.
 * @param timestamp - Timestamp to associate with this payload.
 * @param body - Request body to normalize.
 * @example const entry = buildRequestPayloadEntry('api', summary, createdAt, request.body);
 */
function buildRequestPayloadEntry(
  source: 'api' | 'ui',
  requestSummary: { endpoint?: string; method?: string } | undefined,
  timestamp: string,
  body: unknown,
): RequestPayloadEntry | undefined {
  const payload = parseBody(body);
  if (!payload) return undefined;

  const endpoint = normalizeEndpoint(String(requestSummary?.endpoint || ''));
  const method = requestSummary?.method ? String(requestSummary.method).toUpperCase() : undefined;
  const entry: RequestPayloadEntry = {
    source,
    timestamp,
    payload,
  };

  if (endpoint) entry.endpoint = endpoint;
  if (method) entry.method = method;

  return entry;
}

/**
 * @description Merge and de-duplicate request payload entries.
 * @param base - Existing payload entries.
 * @param incoming - New payload entry or entries.
 * @example const payloads = mergeRequestPayloads(existing, newEntry);
 */
function mergeRequestPayloads(
  base: RequestPayloadEntry[] | undefined,
  incoming: RequestPayloadEntry | RequestPayloadEntry[] | undefined,
): RequestPayloadEntry[] | undefined {
  const merged: RequestPayloadEntry[] = [...(base ?? [])];
  if (incoming) {
    if (Array.isArray(incoming)) {
      merged.push(...incoming);
    } else {
      merged.push(incoming);
    }
  }
  if (!merged.length) return undefined;

  const seen = new Set<string>();
  const result: RequestPayloadEntry[] = [];
  for (const entry of merged) {
    const key = [
      entry.source,
      entry.method ?? '',
      entry.endpoint ?? '',
      entry.timestamp,
      safeStringify(entry.payload),
    ].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
  }

  const methodPriority: Record<string, number> = {
    POST: 0,
    PUT: 1,
    PATCH: 2,
    DELETE: 3,
  };

  return result.sort((left, right) => {
    const leftTime = Date.parse(left.timestamp);
    const rightTime = Date.parse(right.timestamp);
    const leftHasTime = Number.isFinite(leftTime);
    const rightHasTime = Number.isFinite(rightTime);

    if (leftHasTime && rightHasTime && leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    if (leftHasTime !== rightHasTime) {
      return leftHasTime ? -1 : 1;
    }

    const leftPriority = methodPriority[(left.method ?? '').toUpperCase()] ?? 99;
    const rightPriority = methodPriority[(right.method ?? '').toUpperCase()] ?? 99;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return 0;
  });
}

/**
 * @description Extract a created timestamp from response bodies when available.
 * @param body - Response body to inspect.
 * @example const createdAt = extractCreatedTimestamp(response.body);
 */
export function extractCreatedTimestamp(body: unknown): string | undefined {
  const record = parseBody(body);
  if (!record) return undefined;
  const direct = readTimestamp(record, CREATED_TIMESTAMP_KEYS);
  if (direct) return direct;

  const account = isRecord(record['account']) ? record['account'] : null;
  if (account) {
    const nested = readTimestamp(account, CREATED_TIMESTAMP_KEYS);
    if (nested) return nested;
  }

  const snapshot = isRecord(record['account_snapshot']) ? record['account_snapshot'] : null;
  if (snapshot) {
    const nested = readTimestamp(snapshot, CREATED_TIMESTAMP_KEYS);
    if (nested) return nested;
  }

  return undefined;
}

/**
 * @description Extract an updated/status timestamp from response bodies when available.
 * @param body - Response body to inspect.
 * @example const updatedAt = extractUpdatedTimestamp(response.body);
 */
export function extractUpdatedTimestamp(body: unknown): string | undefined {
  const record = parseBody(body);
  if (!record) return undefined;
  const direct = readTimestamp(record, UPDATED_TIMESTAMP_KEYS);
  if (direct) return direct;

  const account = isRecord(record['account']) ? record['account'] : null;
  if (account) {
    const nested = readTimestamp(account, UPDATED_TIMESTAMP_KEYS);
    if (nested) return nested;
  }

  const snapshot = isRecord(record['account_snapshot']) ? record['account_snapshot'] : null;
  if (snapshot) {
    const nested = readTimestamp(snapshot, UPDATED_TIMESTAMP_KEYS);
    if (nested) return nested;
  }

  return undefined;
}

/**
 * @description Read a draft/account ID from a response body without throwing on missing values.
 * @param body - Response body that may contain draft/account id fields.
 * @example const id = safeReadDraftId(response.body);
 */
export function safeReadDraftId(body: unknown): number | undefined {
  const record = parseBody(body);
  if (!record) return undefined;
  const raw = record['draft_account_id'] ?? record['id'] ?? record['account_id'];
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && /^\d+$/.test(raw)) return Number(raw);
  return undefined;
}

/**
 * @description Attempt to extract an account number from response bodies or headers.
 * @param body - Response body to inspect.
 * @param headers - Optional response headers to fall back to (Location, etc).
 * @example const accountNumber = extractAccountNumber(resp.body, resp.headers);
 */
export function extractAccountNumber(body: unknown, headers?: Record<string, unknown>): string | undefined {
  const record = parseBody(body);
  if (record) {
    const raw = record['account_number'] ?? record['accountNumber'];
    if (typeof raw === 'string' && raw.trim()) return raw.trim();
  }
  if (headers) {
    const location = headers['location'] ?? headers['Location'];
    if (typeof location === 'string' && location.includes('/accounts/')) {
      const parts = location.split('/');
      const candidate = parts[parts.length - 1];
      if (candidate) return candidate.trim();
    }
  }
  return undefined;
}

/**
 * @description Produce a short, human-readable error summary from any payload.
 * @param payload - Error body/string to summarise.
 * @example const summary = summarizeErrorPayload(response.body);
 */
export function summarizeErrorPayload(payload: unknown): string {
  if (typeof payload === 'string') {
    return truncate(payload.trim());
  }
  if (isRecord(payload)) {
    const message =
      typeof payload['message'] === 'string'
        ? payload['message']
        : typeof payload['error'] === 'string'
          ? payload['error']
          : typeof payload['detail'] === 'string'
            ? payload['detail']
            : null;
    if (message) {
      return truncate(message);
    }
  }
  try {
    return truncate(JSON.stringify(payload));
  } catch {
    return 'Unknown error';
  }
}

/**
 * @description Build a normalized created-account record or return null when no numeric id is present.
 * @param input - Raw created account data.
 * @param requestBody - Optional request body to enrich derived fields.
 * @example const record = buildCreatedRecord(input, request.body);
 */
function buildCreatedRecord(input: CreatedAccountInput, requestBody?: unknown): AccountCreatedRecord | null {
  const { requestSummary, requestPayloads: inputPayloads, ...rest } = input;
  const accountId = Number(input.accountId);
  if (!Number.isFinite(accountId)) return null;

  const scenario = (input.scenario || getCurrentScenarioTitle()).trim() || 'Unknown scenario';
  const uniq = input.uniq || getUniqSuffix();
  const scenarioStartedAt = input.scenarioStartedAt || getCurrentScenarioStartedAt();
  const scenarioFinishedAt = input.scenarioFinishedAt || getCurrentScenarioFinishedAt() || undefined;
  const createdAt = input.createdAt || new Date().toISOString();
  const accountNumber = input.accountNumber ?? undefined;
  const payloadTimestamp = input.updatedAt ?? createdAt;
  const derivedPayload = buildRequestPayloadEntry(input.source, requestSummary, payloadTimestamp, requestBody);
  const requestPayloads = mergeRequestPayloads(inputPayloads, derivedPayload);

  return {
    ...rest,
    accountId,
    accountNumber: accountNumber ?? undefined,
    createdAt,
    updatedAt: input.updatedAt ?? undefined,
    scenario,
    uniq,
    scenarioStartedAt,
    scenarioFinishedAt,
    requestPayloads,
  };
}

/**
 * @description Build a normalized failed-account record including request summary and timestamps.
 * @param input - Raw failed attempt data.
 * @example const record = buildFailedRecord(input);
 */
function buildFailedRecord(input: FailedAccountInput): AccountFailedRecord {
  const scenario = (input.scenario || getCurrentScenarioTitle()).trim() || 'Unknown scenario';
  const uniq = input.uniq || getUniqSuffix();
  const scenarioStartedAt = input.scenarioStartedAt || getCurrentScenarioStartedAt();
  const scenarioFinishedAt = input.scenarioFinishedAt || getCurrentScenarioFinishedAt() || undefined;
  const timestamp = input.timestamp || new Date().toISOString();
  const endpoint = normalizeEndpoint(input.requestSummary?.endpoint || '');
  const method = String(input.requestSummary?.method || 'POST').toUpperCase();

  return {
    ...input,
    scenario,
    uniq,
    timestamp,
    errorSummary: truncate(input.errorSummary || `HTTP ${input.httpStatus}`, ERROR_MAX_LENGTH),
    requestSummary: { endpoint, method },
    scenarioStartedAt,
    scenarioFinishedAt,
  };
}

/**
 * @description Send a created-account entry to the Node-side task for persistence.
 * @param input - Details about the created account (source, ids, status).
 * @param requestBody - Optional request body to capture a pretty request payload entry.
 * @example recordCreatedAccount({ source: 'api', accountType: 'company', accountId: 1 });
 */
export function recordCreatedAccount(input: CreatedAccountInput, requestBody?: unknown): Cypress.Chainable<void> {
  const record = buildCreatedRecord(input, requestBody);
  if (!record) {
    return cy.then(() => undefined as void) as Cypress.Chainable<void>;
  }

  return cy
    .task('accountCapture:recordCreated', record, { log: false })
    .then(() => undefined as void) as Cypress.Chainable<void>;
}

/**
 * @description Send a failed-account entry to the Node-side task for persistence.
 * @param input - Details about the failed attempt (source, HTTP status, request summary).
 * @example recordFailedAccount({ source: 'ui', accountType: 'manualCreate', httpStatus: 400, requestSummary: { endpoint: '/path', method: 'POST' } });
 */
export function recordFailedAccount(input: FailedAccountInput): Cypress.Chainable<void> {
  const record = buildFailedRecord(input);
  return cy
    .task('accountCapture:recordFailed', record, { log: false })
    .then(() => undefined as void) as Cypress.Chainable<void>;
}

/**
 * @description Derive a minimal request summary (endpoint + method) from a Cypress interception request.
 * @param request - Cypress request-like object.
 * @example const summary = deriveRequestSummary(interception.request);
 */
export function deriveRequestSummary(request: RequestLike | undefined): { endpoint: string; method: string } {
  const endpoint = normalizeEndpoint(String(request?.url || request?.path || ''));
  const method = String(request?.method || 'POST').toUpperCase();
  return { endpoint, method };
}
