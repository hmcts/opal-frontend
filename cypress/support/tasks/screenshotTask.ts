/**
 * @file screenshot.ts
 * @description Plugin-side tasks for moving Cypress screenshots into the shared account evidence folder when invoked from browser helpers.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const evidenceDir = path.join(process.cwd(), 'functional-output', 'account_evidence');

type SaveEvidenceInput = {
  from: string;
  filename?: string;
};

// Copy an existing Cypress screenshot into the shared evidence folder.
async function saveEvidenceScreenshot(input: SaveEvidenceInput): Promise<string | null> {
  if (!input?.from) return null;
  const source = path.resolve(input.from);
  const destinationName = input.filename || path.basename(source);
  const destination = path.join(evidenceDir, 'screenshots', destinationName);

  if (source === destination) {
    return destination;
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);

  return destination;
}

/**
 * @description Register screenshot evidence tasks with Cypress.
 * @param on - Cypress plugin event emitter.
 */
export function registerScreenshotTasks(on: Cypress.PluginEvents): void {
  on('task', {
    'screenshot:saveEvidence': saveEvidenceScreenshot,
  });
}
