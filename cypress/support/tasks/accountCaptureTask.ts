/**
 * @file accountCaptureTask.ts
 * @description Node-side helpers and Cypress tasks for persisting per-run account creation/failure metadata. Typical call order: resolveBuildId/resolveEnvironment → buildRunMeta → initArtifactIfNeeded (before:run) → recordCreated/recordFailed via Cypress tasks during tests → flushArtifacts (after:run).
 *
 * Status semantics (set by action helpers, persisted here):
 * - API create: status comes from the canonical draft status (e.g., Submitted/Rejected) in createDraftAndSetStatus.
 * - UI submit: status is "Created" for new drafts, "Updated" for resubmits; updatedAt is set on updates only.
 * - Failures: go to accounts.failed with httpStatus + errorSummary; no created entry is written.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

type Source = 'api' | 'ui';
type SourceCombined = `${Source}+${Source}`;
type SourceField = Source | SourceCombined;

type RequestPayloadEntry = {
  source: Source;
  endpoint?: string;
  method?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  direction?: 'request' | 'response';
};

type AccountCreated = {
  source: SourceField;
  scenario: string;
  scenarioStartedAt?: string;
  scenarioFinishedAt?: string;
  featurePath?: string;
  accountType: string;
  status?: string;
  uniq: string;
  accountId: number;
  accountNumber?: string;
  imposingCourtId?: string;
  createdAt: string;
  updatedAt?: string;
  requestPayloads?: RequestPayloadEntry[];
};

type AccountFailed = {
  source: SourceField;
  scenario: string;
  scenarioStartedAt?: string;
  scenarioFinishedAt?: string;
  featurePath?: string;
  accountType: string;
  uniq: string;
  httpStatus: number;
  errorSummary: string;
  requestSummary: {
    endpoint: string;
    method: string;
  };
  timestamp: string;
};

type RunMeta = {
  buildId: string;
  environment: string;
  timestamp: string;
  testStage: string;
  testMode: string;
  browser: string;
};

type AccountsPayload = {
  created: AccountCreated[];
  failed: AccountFailed[];
};

type AccountArtifact = {
  runMeta: RunMeta;
  accounts: AccountsPayload;
};

const evidenceDir = path.join(process.cwd(), 'functional-output', 'account_evidence');
const artifactPath = path.join(evidenceDir, 'created-accounts.json');
const lockPath = path.join(evidenceDir, 'created-accounts.lock');
const resetLockPath = path.join(process.cwd(), 'functional-output', 'account_evidence.reset.lock');
let cachedRunMeta: RunMeta | null = null;

/**
 * @description Read an environment variable by key.
 * @param key - Environment variable name.
 * @returns Value from process.env, if defined.
 */
const readEnv = (key: string): string | undefined => process.env[key];

/**
 * @description Determine whether evidence capture is enabled (legacy mode only).
 * @returns True when evidence capture should run.
 */
function isLegacyEvidenceEnabled(): boolean {
  const legacyEnabled = readEnv('LEGACY_ENABLED');
  if (legacyEnabled && legacyEnabled.trim()) {
    const normalized = legacyEnabled.trim().toLowerCase();
    if (normalized === 'true' || normalized === 'legacy' || normalized === '1') {
      return true;
    }
  }
  const mode = (readEnv('DEV_DEFAULT_APP_MODE') || readEnv('DEFAULT_APP_MODE') || '').trim().toLowerCase();
  return mode === 'legacy';
}

/**
 * @description Resolve a build identifier from well-known CI environment variables, falling back to "local".
 * @returns Build identifier string.
 * @example const buildId = resolveBuildId();
 */
function resolveBuildId(): string {
  return (
    readEnv('BUILD_ID') ||
    readEnv('BUILD_NUMBER') ||
    readEnv('BUILD_TAG') ||
    readEnv('GITHUB_RUN_ID') ||
    readEnv('CIRCLE_WORKFLOW_ID') ||
    readEnv('CI_PIPELINE_ID') ||
    readEnv('ACCOUNT_CAPTURE_RUN_ID') ||
    `LocalDate-${Date.now()}`
  );
}

/**
 * @description Resolve the current test environment/stage for artifact metadata.
 * @returns Environment name string.
 * @example const env = resolveEnvironment();
 */
function resolveEnvironment(): string {
  const stage = resolveTestStage();
  const nodeEnv = readEnv('NODE_ENV');
  return stage || nodeEnv || 'local';
}

/**
 * @description Resolve the current test stage (DEV/STAGING/local) from env.
 * @returns Normalized stage label.
 */
function resolveTestStage(): string {
  const raw = readEnv('TEST_STAGE') || readEnv('TEST_ENV');
  if (!raw) return 'local';
  const normalized = raw.trim().toLowerCase();
  if (normalized.startsWith('dev')) return 'DEV';
  if (normalized.startsWith('stg') || normalized.includes('stag')) return 'STAGING';
  return raw;
}

/**
 * @description Resolve the current test mode (e.g., OPAL/LEGACY) from env.
 * @returns Test mode string.
 */
function resolveTestMode(): string {
  return readEnv('TEST_MODE') || 'OPAL';
}

/**
 * @description Resolve the current browser under test from env.
 * @returns Browser name.
 */
function resolveBrowser(): string {
  return readEnv('BROWSER_TO_RUN') || readEnv('BROWSER') || 'edge';
}

/**
 * @description Construct and cache the run metadata used across artifact writes.
 * @returns Run metadata object.
 * @example const meta = buildRunMeta();
 */
function buildRunMeta(): RunMeta {
  const meta = {
    buildId: resolveBuildId(),
    environment: resolveEnvironment(),
    testStage: resolveTestStage(),
    testMode: resolveTestMode(),
    browser: resolveBrowser(),
    timestamp: new Date().toISOString(),
  };
  cachedRunMeta = meta;
  return meta;
}

/**
 * @description Build run metadata defaults without mutating the cached run meta.
 * @param existing - Optional prior meta to reuse timestamps/values.
 * @returns Resolved run metadata.
 */
function resolveRunMetaDefaults(existing?: RunMeta): RunMeta {
  return {
    buildId: existing?.buildId ?? resolveBuildId(),
    environment: existing?.environment ?? resolveEnvironment(),
    testStage: existing?.testStage ?? existing?.environment ?? resolveTestStage(),
    testMode: existing?.testMode ?? resolveTestMode(),
    browser: existing?.browser ?? resolveBrowser(),
    timestamp: existing?.timestamp ?? new Date().toISOString(),
  };
}

/**
 * @description Ensure the artifacts directory exists before writing files.
 * @returns Promise that resolves once the directory exists.
 * @example await ensureArtifactsDir();
 */
async function ensureArtifactsDir(): Promise<void> {
  await fs.mkdir(path.dirname(artifactPath), { recursive: true });
}

/**
 * @description Remove the entire evidence directory to start a clean run.
 * @returns Promise that resolves once evidence is cleared.
 * @example await clearAccountEvidence();
 */
export async function clearAccountEvidence(): Promise<void> {
  await fs.rm(evidenceDir, { recursive: true, force: true });
}

/**
 * @description Acquire the per-run reset lock so only one worker clears evidence.
 * @returns File handle when the lock is acquired, or null when another worker owns it.
 */
async function acquireResetLock(): Promise<fs.FileHandle | null> {
  await fs.mkdir(path.dirname(resetLockPath), { recursive: true });
  try {
    return await fs.open(resetLockPath, 'wx');
  } catch (err: any) {
    if (err && err.code === 'EEXIST') {
      return null;
    }
    throw err;
  }
}

/**
 * @description Remove the per-run evidence reset lock (used between Cypress runs).
 * @returns Promise that resolves once the reset lock is removed.
 */
export async function releaseEvidenceResetLock(): Promise<void> {
  await fs.rm(resetLockPath, { force: true });
}

/**
 * @description Fully reset evidence for a new Cypress run: clear folder and seed a fresh artifact.
 * @returns Promise that resolves once evidence is reset.
 */
export async function resetEvidenceForRun(): Promise<void> {
  if (!isLegacyEvidenceEnabled()) {
    return;
  }
  const lockHandle = await acquireResetLock();
  if (!lockHandle) {
    return;
  }

  try {
    await clearAccountEvidence();
    cachedRunMeta = null;
    const fresh = emptyArtifact();
    await writeArtifact(fresh);
  } finally {
    await lockHandle.close();
  }
}

/**
 * @description Run an async operation under a simple file lock to avoid concurrent writes.
 * @param operation - Callback to execute while holding the lock.
 * @returns Result from the provided operation.
 * @example await withLock(async () => writeArtifact(payload));
 */
async function withLock<T>(operation: () => Promise<T>): Promise<T> {
  await ensureArtifactsDir();

  const acquire = async (attempt = 0): Promise<fs.FileHandle> => {
    try {
      return await fs.open(lockPath, 'wx');
    } catch (err: any) {
      if (err && err.code === 'EEXIST' && attempt < 20) {
        await new Promise((resolve) => setTimeout(resolve, 50 + attempt * 10));
        return acquire(attempt + 1);
      }
      throw err;
    }
  };

  const handle = await acquire();
  try {
    return await operation();
  } finally {
    await handle.close();
    await fs.unlink(lockPath).catch(() => undefined);
  }
}

/**
 * @description Read the persisted artifact from disk, returning null if missing.
 * @returns Artifact payload or null when missing.
 * @example const artifact = await readArtifact();
 */
async function readArtifact(): Promise<AccountArtifact | null> {
  try {
    const raw = await fs.readFile(artifactPath, 'utf8');
    return JSON.parse(raw) as AccountArtifact;
  } catch (err: any) {
    if (err && err.code !== 'ENOENT') {
      // eslint-disable-next-line no-console
      console.error('Failed to read account artifact:', err);
    }
    return null;
  }
}

/**
 * @description Produce an empty artifact seeded with the current run metadata.
 * @returns Empty artifact payload.
 * @example const artifact = emptyArtifact();
 */
function emptyArtifact(): AccountArtifact {
  const meta = cachedRunMeta ?? buildRunMeta();
  return {
    runMeta: meta,
    accounts: { created: [], failed: [] },
  };
}

/**
 * @description Normalise a possibly partial artifact into a safe structure with defaults.
 * @param input - Artifact read from disk (or null).
 * @returns Normalized artifact payload.
 * @example const safe = normalizeArtifact(await readArtifact());
 */
function normalizeArtifact(input: AccountArtifact | null): AccountArtifact {
  if (!input) return emptyArtifact();
  const rawMeta = cachedRunMeta ?? input.runMeta;
  const meta = resolveRunMetaDefaults(rawMeta);
  cachedRunMeta = meta;
  return {
    runMeta: meta,
    accounts: {
      created: Array.isArray(input.accounts?.created) ? input.accounts.created : [],
      failed: Array.isArray(input.accounts?.failed) ? input.accounts.failed : [],
    },
  };
}

/**
 * @description Safely stringify a value for de-duplication keys.
 * @param value - Value to serialize.
 * @returns JSON string when possible, otherwise a string fallback.
 */
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * @description Merge and de-duplicate request payload entries.
 * @param base - Existing payload entries.
 * @param incoming - New payload entries.
 * @returns Merged payload list or undefined when empty.
 */
function mergeRequestPayloads(
  base: RequestPayloadEntry[] | undefined,
  incoming: RequestPayloadEntry[] | undefined,
): RequestPayloadEntry[] | undefined {
  const merged = [...(base ?? []), ...(incoming ?? [])];
  if (!merged.length) return undefined;

  const seen = new Set<string>();
  const result: RequestPayloadEntry[] = [];
  for (const entry of merged) {
    const key = [
      entry.source,
      entry.direction ?? '',
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

type ScenarioArtifact = {
  runMeta: RunMeta;
  scenario: {
    title: string;
    featurePath?: string;
    startedAt?: string;
    finishedAt?: string;
  };
  accounts: AccountsPayload;
};

/**
 * @description Normalize a feature path into safe path segments.
 * @param value - Feature path or relative spec path.
 * @returns Normalized segments.
 */
function normalizePathSegments(value?: string): string[] {
  if (!value) return [];
  return value
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

/**
 * @description Convert a scenario title into a safe filename slug.
 * @param value - Scenario title.
 * @returns Normalized slug string.
 */
function toSafeScenarioSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

/**
 * @description Resolve the output file path for a scenario evidence artifact.
 * @param scenario - Scenario title.
 * @param featurePath - Relative feature path for the scenario.
 * @returns Absolute file path for the scenario JSON.
 */
function resolveScenarioFilePath(scenario: string, featurePath?: string): string {
  const segments = normalizePathSegments(featurePath);
  const scenarioDir = path.join(evidenceDir, ...segments);
  const slug = toSafeScenarioSlug(scenario || 'unknown-scenario');
  return path.join(scenarioDir, `scenario-${slug}.json`);
}

/**
 * @description Read a scenario artifact from disk.
 * @param filePath - Full file path to the scenario artifact.
 * @returns Parsed scenario artifact or null if missing.
 */
async function readScenarioArtifact(filePath: string): Promise<ScenarioArtifact | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as ScenarioArtifact;
  } catch (err: any) {
    if (err && err.code !== 'ENOENT') {
      // eslint-disable-next-line no-console
      console.error('Failed to read scenario artifact:', err);
    }
    return null;
  }
}

/**
 * @description Write a scenario artifact to disk, ensuring directories exist.
 * @param filePath - Full file path to the scenario artifact.
 * @param artifact - Scenario artifact payload.
 * @returns Promise that resolves once written.
 */
async function writeScenarioArtifact(filePath: string, artifact: ScenarioArtifact): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(artifact, null, 2));
}

/**
 * @description Collect all created/failed entries for a scenario (and optional start time).
 * @param artifact - Run-level account artifact.
 * @param scenario - Scenario title.
 * @param scenarioStartedAt - Optional scenario start timestamp.
 * @returns Account payloads scoped to the scenario.
 */
function collectScenarioEntries(
  artifact: AccountArtifact,
  scenario: string,
  scenarioStartedAt?: string,
): AccountsPayload {
  const matchesScenario = (entry: { scenario?: string; scenarioStartedAt?: string }): boolean => {
    if (!entry.scenario || entry.scenario !== scenario) return false;
    if (!scenarioStartedAt) return true;
    return entry.scenarioStartedAt === scenarioStartedAt;
  };

  return {
    created: artifact.accounts.created.filter((entry) => matchesScenario(entry)),
    failed: artifact.accounts.failed.filter((entry) => matchesScenario(entry)),
  };
}

/**
 * @description Write or update the scenario artifact derived from the current run artifact.
 * @param artifact - Run-level account artifact.
 * @param scenario - Scenario title.
 * @param featurePath - Feature path for the scenario.
 * @param scenarioStartedAt - Optional scenario start timestamp.
 * @param scenarioFinishedAt - Optional scenario finish timestamp.
 * @returns Promise that resolves once the scenario artifact is updated.
 */
async function upsertScenarioArtifact(
  artifact: AccountArtifact,
  scenario: string,
  featurePath?: string,
  scenarioStartedAt?: string,
  scenarioFinishedAt?: string,
): Promise<void> {
  if (!scenario) return;

  const accounts = collectScenarioEntries(artifact, scenario, scenarioStartedAt);
  const resolvedFeaturePath = featurePath ?? accounts.created[0]?.featurePath ?? accounts.failed[0]?.featurePath;
  const filePath = resolveScenarioFilePath(scenario, resolvedFeaturePath);
  const existing = await readScenarioArtifact(filePath);
  if (!accounts.created.length && !accounts.failed.length && !existing) {
    return;
  }

  const scenarioMeta = {
    title: scenario,
    featurePath: resolvedFeaturePath ?? existing?.scenario.featurePath,
    startedAt: scenarioStartedAt ?? existing?.scenario.startedAt,
    finishedAt: scenarioFinishedAt ?? existing?.scenario.finishedAt,
  };

  await writeScenarioArtifact(filePath, {
    runMeta: cachedRunMeta ?? artifact.runMeta ?? buildRunMeta(),
    scenario: scenarioMeta,
    accounts,
  });
}

/**
 * @description Persist the artifact to disk (ensuring directories exist).
 * @param artifact - Artifact to write.
 * @returns Persisted artifact payload.
 * @example await writeArtifact(artifact);
 */
async function writeArtifact(artifact: AccountArtifact): Promise<AccountArtifact> {
  await ensureArtifactsDir();
  await fs.writeFile(artifactPath, JSON.stringify(artifact, null, 2));
  return artifact;
}

/**
 * @description Initialise or reset the artifact when build/environment context changes.
 * @returns Resolved artifact after initialization.
 * @example const artifact = await initArtifactIfNeeded();
 */
async function initArtifactIfNeeded(): Promise<AccountArtifact> {
  return withLock(async () => {
    const raw = await readArtifact();
    const existing = normalizeArtifact(raw);
    const hasArtifact = raw !== null;
    const isParallelThread = Boolean(process.env['CYPRESS_THREAD']);

    if (hasArtifact && isParallelThread) {
      cachedRunMeta = existing.runMeta;
      return existing;
    }

    const currentMeta = cachedRunMeta ?? buildRunMeta();

    const shouldReset =
      !hasArtifact ||
      existing.runMeta.buildId !== currentMeta.buildId ||
      existing.runMeta.environment !== currentMeta.environment;

    if (shouldReset) {
      const fresh = {
        runMeta: currentMeta,
        accounts: { created: [], failed: [] },
      };
      return writeArtifact(fresh);
    }

    // Keep the existing meta and arrays when build/environment match
    cachedRunMeta = existing.runMeta;
    return existing;
  });
}

/**
 * @description Append a created/failed entry to the appropriate array and persist the artifact.
 * @param kind - Whether to append to "created" or "failed".
 * @param entry - Entry payload to add.
 * @returns Promise that resolves once the entry is persisted.
 * @example await appendEntry('created', createdEntry);
 */
async function appendEntry(kind: 'created' | 'failed', entry: AccountCreated | AccountFailed): Promise<void> {
  await withLock(async () => {
    const artifact = normalizeArtifact(await readArtifact());
    const next: AccountArtifact = {
      runMeta: cachedRunMeta ?? artifact.runMeta ?? buildRunMeta(),
      accounts: {
        created: artifact.accounts.created.slice(),
        failed: artifact.accounts.failed.slice(),
      },
    };

    if (kind === 'created') {
      const incoming = entry as AccountCreated;
      const incomingAccountNumber =
        typeof incoming.accountNumber === 'string' && incoming.accountNumber.trim()
          ? incoming.accountNumber.trim()
          : undefined;
      const existingIndexByAccountId = next.accounts.created.findIndex((item) => item.accountId === incoming.accountId);
      const existingIndexByAccountNumber = incomingAccountNumber
        ? next.accounts.created.findIndex((item) => item.accountNumber === incomingAccountNumber)
        : -1;
      const existingIndex = existingIndexByAccountId >= 0 ? existingIndexByAccountId : existingIndexByAccountNumber;
      if (existingIndex >= 0) {
        const existing = next.accounts.created[existingIndex];
        const sourceParts = new Set<string>([...(existing.source || '').split('+').filter(Boolean), incoming.source]);
        const mergedSource = Array.from(sourceParts).sort().join('+') as SourceField;

        next.accounts.created[existingIndex] = {
          ...existing,
          ...incoming,
          source: mergedSource,
          accountType: existing.accountType || incoming.accountType,
          status: incoming.status || existing.status,
          accountNumber: incoming.accountNumber ?? existing.accountNumber,
          imposingCourtId: incoming.imposingCourtId ?? existing.imposingCourtId,
          createdAt: existing.createdAt || incoming.createdAt,
          updatedAt: incoming.updatedAt ?? existing.updatedAt,
          scenario: existing.scenario || incoming.scenario,
          scenarioStartedAt: existing.scenarioStartedAt || incoming.scenarioStartedAt,
          scenarioFinishedAt: existing.scenarioFinishedAt || incoming.scenarioFinishedAt,
          featurePath: existing.featurePath || incoming.featurePath,
          uniq: existing.uniq || incoming.uniq,
          requestPayloads: mergeRequestPayloads(existing.requestPayloads, incoming.requestPayloads),
        };
      } else {
        next.accounts.created.push(entry as AccountCreated);
      }
    } else {
      next.accounts.failed.push(entry as AccountFailed);
    }

    await writeArtifact(next);
    await upsertScenarioArtifact(
      next,
      entry.scenario,
      entry.featurePath,
      entry.scenarioStartedAt,
      entry.scenarioFinishedAt,
    );
  });
}

/**
 * @description Task handler for recording created accounts (returns null per Cypress task contract).
 * @param entry - Created account payload.
 * @returns Null for Cypress task completion.
 * @example await recordCreated(entry);
 */
async function recordCreated(entry: AccountCreated): Promise<null> {
  if (!isLegacyEvidenceEnabled()) {
    return null;
  }
  await appendEntry('created', entry);
  return null;
}

/**
 * @description Task handler for recording failed account attempts (returns null per Cypress task contract).
 * @param entry - Failed account payload.
 * @returns Null for Cypress task completion.
 * @example await recordFailed(entry);
 */
async function recordFailed(entry: AccountFailed): Promise<null> {
  if (!isLegacyEvidenceEnabled()) {
    return null;
  }
  await appendEntry('failed', entry);
  return null;
}

type FinalizeScenarioInput = {
  scenario: string;
  scenarioStartedAt?: string;
  scenarioFinishedAt?: string;
};

/**
 * @description Update entries for a scenario with its finish timestamp.
 * @param input - Scenario identifiers and finish time.
 * @returns Null for Cypress task completion.
 * @example await finalizeScenario({ scenario: 'My Scenario', scenarioStartedAt, scenarioFinishedAt });
 */
async function finalizeScenario(input: FinalizeScenarioInput): Promise<null> {
  if (!isLegacyEvidenceEnabled()) {
    return null;
  }
  const scenario = (input?.scenario ?? '').trim();
  if (!scenario) return null;
  const finishedAt = (input?.scenarioFinishedAt ?? new Date().toISOString()).trim();
  const startedAt = input?.scenarioStartedAt?.trim();

  await withLock(async () => {
    const artifact = normalizeArtifact(await readArtifact());
    const matchesScenario = (entry: { scenario?: string; scenarioStartedAt?: string }): boolean => {
      if (!entry.scenario || entry.scenario !== scenario) return false;
      if (!startedAt) return true;
      return entry.scenarioStartedAt === startedAt;
    };

    const updatedCreated = artifact.accounts.created.map((entry) =>
      matchesScenario(entry)
        ? { ...entry, scenarioFinishedAt: finishedAt, scenarioStartedAt: entry.scenarioStartedAt ?? startedAt }
        : entry,
    );
    const updatedFailed = artifact.accounts.failed.map((entry) =>
      matchesScenario(entry)
        ? { ...entry, scenarioFinishedAt: finishedAt, scenarioStartedAt: entry.scenarioStartedAt ?? startedAt }
        : entry,
    );

    const next: AccountArtifact = {
      runMeta: cachedRunMeta ?? artifact.runMeta ?? buildRunMeta(),
      accounts: {
        created: updatedCreated,
        failed: updatedFailed,
      },
    };

    await writeArtifact(next);
    await upsertScenarioArtifact(next, scenario, undefined, startedAt, finishedAt);
  });

  return null;
}

/**
 * @description Flush the current in-memory artifact to disk (used after runs).
 * @returns Artifact payload after flush.
 * @example const finalArtifact = await flushArtifacts();
 */
async function flushArtifacts(): Promise<AccountArtifact> {
  if (!isLegacyEvidenceEnabled()) {
    return emptyArtifact();
  }
  return withLock(async () => {
    const artifact = normalizeArtifact(await readArtifact());
    const next = {
      runMeta: cachedRunMeta ?? artifact.runMeta ?? buildRunMeta(),
      accounts: artifact.accounts,
    };
    await writeArtifact(next);
    return next;
  });
}

/**
 * @description Prepare the per-run artifact file and ensure metadata is set.
 * @returns Promise that resolves once initialization completes.
 * @example await initializeAccountCapture();
 */
export async function initializeAccountCapture(): Promise<void> {
  if (!isLegacyEvidenceEnabled()) {
    return;
  }
  await initArtifactIfNeeded();
}

/**
 * @description Register Cypress tasks that append created/failed account entries.
 * @param on - Cypress plugin event emitter.
 * @returns void
 * @example registerAccountCaptureTasks(on);
 */
export function registerAccountCaptureTasks(on: Cypress.PluginEvents): void {
  on('task', {
    'accountCapture:recordCreated': recordCreated,
    'accountCapture:recordFailed': recordFailed,
    'accountCapture:finalizeScenario': finalizeScenario,
    'accountCapture:flush': flushArtifacts,
    'accountCapture:releaseResetLock': async () => {
      await releaseEvidenceResetLock();
      return null;
    },
    'accountCapture:resetEvidence': async () => {
      await resetEvidenceForRun();
      return null;
    },
  });
}

/**
 * @description Force a flush of the current artifact contents to disk.
 * @returns Promise that resolves once the artifact is flushed.
 * @example await ensureAccountCaptureFile();
 */
export async function ensureAccountCaptureFile(): Promise<void> {
  if (!isLegacyEvidenceEnabled()) {
    return;
  }
  await flushArtifacts();
}

/**
 * @description Return the full path to the created accounts artifact.
 * @returns Absolute artifact path
 * @example const path = getAccountArtifactPath();
 */
export function getAccountArtifactPath(): string {
  return artifactPath;
}
