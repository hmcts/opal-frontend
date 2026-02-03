/**
 * @file Accessibility.steps.ts
 * @description
 * Step definitions for accessibility-only checks used across Opal E2E tests.
 *
 * These steps:
 *  - Perform accessibility validation without modifying page state
 *  - Optionally navigate back after checks
 *  - Support bulk accessibility testing via DataTables
 *
 * All Cypress interactions are delegated to the AccessibilityActions class.
 * Steps remain thin, intent-based, and UI-agnostic.
 */
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { accessibilityActions } from '../../../e2e/functional/opal/actions/accessibility/accessibility.actions';
import { log } from '../../../support/utils/log.helper';

/**
 * @step I check the page for accessibility
 * @description
 * Runs accessibility checks against the **current page only**, without
 * changing navigation state.
 *
 * @example
 *  Then I check the page for accessibility
 */
Then('I check the page for accessibility', () => {
  log('step', 'Check current page for accessibility only');
  accessibilityActions().checkAccessibilityOnly();
});

/**
 * @step I check the page for accessibility and navigate back
 * @description
 * Runs accessibility checks against the current page and then navigates
 * back to the previous page when checks complete.
 *
 * @example
 *  Then I check the page for accessibility and navigate back
 */
Then('I check the page for accessibility and navigate back', () => {
  log('step', 'Check current page for accessibility and navigate back afterwards');
  accessibilityActions().checkAccessibilityAndNavigateBack();
});
