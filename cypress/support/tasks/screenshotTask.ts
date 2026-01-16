/**
 * @file screenshot.ts
 * @description Plugin-side tasks for moving Cypress screenshots into the shared account evidence folder when invoked from browser helpers.
 */
import fs from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import path from 'node:path';

const evidenceDir = path.join(process.cwd(), 'functional-output', 'account_evidence');
let screenshotsRoot = path.join(process.cwd(), 'cypress', 'screenshots');

type SaveEvidenceInput = {
  from: string;
  filename?: string;
};

type SaveEvidenceByNameInput = {
  filename: string;
};

type ScreenshotMatch = { path: string; mtimeMs: number };

/**
 * Find screenshot files by filename (including retry variants) under the screenshots root.
 * @param filename - Relative filename or path to locate (e.g., scenario-foo.png or feature/path/scenario-foo.png).
 * @returns Matching screenshot paths with modified times, newest first.
 */
async function findScreenshotsByName(filename: string): Promise<ScreenshotMatch[]> {
  const matches: ScreenshotMatch[] = [];
  const normalizedTarget = filename.replace(/\\/g, '/').replace(/^\/+/, '');
  const extension = path.extname(normalizedTarget) || '.png';
  const baseName = path.posix.basename(normalizedTarget, extension);
  const targetDir = path.posix.dirname(normalizedTarget);
  const targetDirPrefix = targetDir !== '.' ? `${targetDir}/` : '';
  const exactName = path.posix.basename(normalizedTarget);

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
          return;
        }
        if (entry.isFile()) {
          const relative = path.relative(screenshotsRoot, full).split(path.sep).join('/');
          if (targetDirPrefix && !relative.startsWith(targetDirPrefix)) return;
          const entryName = path.basename(relative);
          const matchesName =
            entryName === exactName || (entryName.startsWith(`${baseName} `) && entryName.endsWith(extension));
          if (!matchesName) return;
          const stat = await fs.stat(full);
          matches.push({ path: full, mtimeMs: stat.mtimeMs });
        }
      }),
    );
  };

  try {
    await walk(screenshotsRoot);
  } catch {
    return [];
  }

  return matches;
}

/**
 * Resolve screenshot source paths from a direct path or a filename lookup.
 * @param input - Screenshot task payload.
 * @returns Matching screenshot entries, newest first.
 */
async function resolveSources(input: SaveEvidenceInput | SaveEvidenceByNameInput): Promise<ScreenshotMatch[]> {
  if ('from' in input && input.from) {
    const resolved = path.resolve(input.from);
    try {
      const stat = await fs.stat(resolved);
      return [{ path: resolved, mtimeMs: stat.mtimeMs }];
    } catch {
      return [];
    }
  }
  if ('filename' in input && input.filename) {
    return findScreenshotsByName(input.filename);
  }
  return [];
}

// Copy an existing Cypress screenshot into the shared evidence folder, then remove the original.
/**
 * Move the latest screenshot into the evidence folder, removing older retries when requested by name.
 * @param input - Screenshot task payload.
 * @returns Evidence path for attaching to reports, or null when not found.
 */
async function saveEvidenceScreenshot(input: SaveEvidenceInput | SaveEvidenceByNameInput): Promise<string | null> {
  const sources = await resolveSources(input);
  if (!sources.length) return null;

  const ordered = sources.sort((left, right) => right.mtimeMs - left.mtimeMs);
  const [latest, ...rest] = ordered;

  const destinationName = path.basename(latest.path);
  const relative = path.relative(screenshotsRoot, latest.path);
  const destination =
    relative && !relative.startsWith('..') ? path.join(evidenceDir, relative) : path.join(evidenceDir, destinationName);

  if (latest.path !== destination) {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(latest.path, destination);
    await fs.unlink(latest.path).catch(() => undefined);
  }

  if ('filename' in input) {
    await Promise.all(rest.map((entry) => fs.unlink(entry.path).catch(() => undefined)));
  }

  return destination;
}

/**
 * @description Register screenshot evidence tasks with Cypress.
 * @param on - Cypress plugin event emitter.
 * @param config - Cypress config for determining the screenshot root folder.
 */
export function registerScreenshotTasks(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  const configuredRoot = config?.screenshotsFolder;
  if (typeof configuredRoot === 'string' && configuredRoot.trim()) {
    screenshotsRoot = path.resolve(configuredRoot);
  }
  on('task', {
    'screenshot:saveEvidence': saveEvidenceScreenshot,
    'screenshot:cleanupEmptyDirs': async () => {
      await cleanupEmptyScreenshotDirs();
      return null;
    },
  });
}

/**
 * Remove empty subdirectories recursively, skipping the root folder.
 * @param dir - Directory to scan.
 * @param isRoot - Whether this call is for the root folder.
 */
async function removeEmptyDirs(dir: string, isRoot: boolean): Promise<void> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err: any) {
    if (err && err.code === 'ENOENT') return;
    throw err;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    await removeEmptyDirs(full, false);
  }

  if (isRoot) return;

  const remaining = await fs.readdir(dir);
  if (remaining.length === 0) {
    await fs.rmdir(dir).catch(() => undefined);
  }
}

/**
 * Remove empty subdirectories under the screenshots root folder.
 * @param root - Optional screenshots root (defaults to the configured screenshots folder).
 */
export async function cleanupEmptyScreenshotDirs(root?: string): Promise<void> {
  const target = root && root.trim() ? path.resolve(root) : screenshotsRoot;
  await removeEmptyDirs(target, true);
}
