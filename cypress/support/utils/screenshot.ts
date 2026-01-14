/**
 * @file screenshot.ts
 * @description Browser-side helper for capturing scenario-scoped screenshots with consistent naming; delegates persistence to a plugin task and attaches the image to Cucumber reports.
 */
import { attach } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentScenarioTitle } from './scenarioContext';

/**
 * @description Capture a screenshot with the current scenario name prefixed.
 * @param tag - Short tag describing the moment (e.g., "before-submit").
 * @param options - Optional Cypress screenshot options.
 * @example captureScenarioScreenshot('before-submit');
 */
export function captureScenarioScreenshot(
  tag: string,
  options?: Partial<Cypress.ScreenshotOptions>,
): Cypress.Chainable<void> {
  const scenario =
    getCurrentScenarioTitle()
      .replace(/[^\w-]+/g, '-')
      .toLowerCase() || 'scenario';
  const safeTag = (tag || 'capture').replace(/[^\w-]+/g, '-').toLowerCase();
  const filename = `scenario-${scenario}-${safeTag}`;

  // Capture a screenshot using Cypress defaults, then mirror it into the evidence folder via a task.
  const targetFileName = `${filename}.png`;

  return cy
    .screenshot(filename, { capture: 'fullPage', ...options })
    .then((details) => {
      const screenshotPath = (details as Cypress.ScreenshotDetails | undefined)?.path;
      if (!screenshotPath) {
        return undefined;
      }
      return cy
        .task('screenshot:saveEvidence', { from: screenshotPath, filename: targetFileName }, { log: false })
        .then((savedPath) => savedPath || screenshotPath)
        .then((finalPath) =>
          cy.readFile(finalPath as string, 'base64').then((base64) => {
            const buffer = Cypress.Buffer.from(base64, 'base64');
            attach(buffer.buffer as ArrayBuffer, { mediaType: 'image/png', fileName: targetFileName });
          }),
        );
    })
    .then(() => undefined) as Cypress.Chainable<void>;
}
