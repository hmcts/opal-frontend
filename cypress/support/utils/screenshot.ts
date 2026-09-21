/**
 * @file screenshot.ts
 * Browser-side helper for capturing scenario-scoped screenshots with consistent naming; delegates persistence to a
 * plugin task and attaches the image to Cucumber reports.
 */
import { attach } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentScenarioFeaturePath, getCurrentScenarioTitle } from './scenarioContext';
import { isEvidenceCaptureEnabled } from './evidenceMode';

type SavedEvidenceScreenshot = {
  base64: string;
};

const isSavedEvidenceScreenshot = (value: unknown): value is SavedEvidenceScreenshot =>
  value !== null && typeof value === 'object' && 'base64' in value && typeof value.base64 === 'string';

const uatTechnicalEvidenceTags = /@(?:UAT-Technical|R1BDrop[12]UatTech(?:JCDE|Preprod)?)\b/i;
const uatTechnicalEvidenceCaptures = new Set<string>();

const getEnvString = (name: string): string => {
  const value = Cypress.env(name);
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value === undefined || value === null ? '' : String(value);
};

/**
 * Determine whether UAT Technical evidence screenshots should be captured.
 * @returns True for legacy evidence runs scoped by UAT Technical tags.
 */
export function isUatTechnicalEvidenceCaptureEnabled(): boolean {
  if (!isEvidenceCaptureEnabled()) {
    return false;
  }

  const tagExpression = [getEnvString('TAGS'), getEnvString('CYPRESS_TAGS'), getEnvString('grepTags')].join(' ');
  return uatTechnicalEvidenceTags.test(tagExpression);
}

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
  if (!isEvidenceCaptureEnabled()) {
    return cy.then(() => undefined) as Cypress.Chainable<void>;
  }
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
  const evidencePath = `${relativeName}.png`;

  // Capture a screenshot using Cypress defaults, then mirror it into the evidence folder via a task.
  const targetFileName = evidencePath;
  let capturedPath: string | undefined;
  const userAfterScreenshot = options?.onAfterScreenshot;
  const screenshotOptions: Partial<Cypress.ScreenshotOptions> = {
    capture: 'fullPage',
    ...options,
    onAfterScreenshot: ($el, props) => {
      capturedPath = props.path;
      if (typeof userAfterScreenshot === 'function') {
        userAfterScreenshot($el, props);
      }
    },
  };

  return cy
    .screenshot(relativeName, screenshotOptions)
    .then(() =>
      cy
        .task(
          'screenshot:saveEvidence',
          capturedPath ? { from: capturedPath, evidencePath } : { filename: targetFileName, evidencePath },
          { log: false },
        )
        .then((savedEvidence) => {
          if (!isSavedEvidenceScreenshot(savedEvidence)) {
            return undefined;
          }

          attach(savedEvidence.base64, { mediaType: 'base64:image/png', fileName: targetFileName });
          return undefined;
        }),
    )
    .then(() => undefined) as Cypress.Chainable<void>;
}

/**
 * Capture a deduplicated UAT Technical evidence screenshot for a named page or tab.
 * @param tag - Short tag describing the page or tab.
 * @param options - Optional Cypress screenshot options.
 * @returns Cypress chainable for the screenshot capture.
 */
export function captureUatTechnicalEvidenceScreenshot(
  tag: string,
  options?: Partial<Cypress.ScreenshotOptions>,
): Cypress.Chainable<void> {
  if (!isUatTechnicalEvidenceCaptureEnabled()) {
    return cy.then(() => undefined) as Cypress.Chainable<void>;
  }

  const safeTag = (tag || 'capture').replace(/[^\w-]+/g, '-').toLowerCase();
  const key = `${getCurrentScenarioFeaturePath()}::${getCurrentScenarioTitle()}::${safeTag}`;
  if (uatTechnicalEvidenceCaptures.has(key)) {
    return cy.then(() => undefined) as Cypress.Chainable<void>;
  }

  uatTechnicalEvidenceCaptures.add(key);
  return captureScenarioScreenshot(`uat-technical-${safeTag}`, options);
}
