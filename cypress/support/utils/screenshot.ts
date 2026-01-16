/**
 * @file screenshot.ts
 * Browser-side helper for capturing scenario-scoped screenshots with consistent naming; delegates persistence to a
 * plugin task and attaches the image to Cucumber reports.
 */
import { attach } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentScenarioFeaturePath, getCurrentScenarioTitle } from './scenarioContext';

/**
 * Capture a screenshot with the current scenario name prefixed.
 * @param tag - Short tag describing the moment (e.g., "before-submit").
 * @param options - Optional Cypress screenshot options.
 * @returns Cypress chainable for the screenshot capture.
 * @example captureScenarioScreenshot('before-submit');
 */
export function captureScenarioScreenshot(
  tag: string,
  options?: Partial<Cypress.ScreenshotOptions>,
): Cypress.Chainable<void> {
  const featurePath = getCurrentScenarioFeaturePath()
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join('/');
  const scenario =
    getCurrentScenarioTitle()
      .replace(/[^\w-]+/g, '-')
      .toLowerCase() || 'scenario';
  const safeTag = (tag || 'capture').replace(/[^\w-]+/g, '-').toLowerCase();
  const filename = `scenario-${scenario}-${safeTag}`;
  const relativeName = featurePath ? `${featurePath}/${filename}` : filename;

  // Capture a screenshot using Cypress defaults, then mirror it into the evidence folder via a task.
  const targetFileName = `${relativeName}.png`;

  return cy
    .screenshot(relativeName, { capture: 'fullPage', ...options })
    .then(() =>
      cy.task('screenshot:saveEvidence', { filename: targetFileName }, { log: false }).then((savedPath) => {
        if (!savedPath) return undefined;
        return cy.readFile(savedPath as string, 'base64').then((base64) => {
          attach(base64, { mediaType: 'base64:image/png', fileName: targetFileName });
        });
      }),
    )
    .then(() => undefined) as Cypress.Chainable<void>;
}
