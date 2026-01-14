/**
 * @file accessibility.actions.ts
 * @description Axe-based accessibility helpers used by steps/flows to keep
 * accessibility checks consistent, logged, and reusable across journeys.
 */
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccessibilityActions');

/**
 * Accessibility helpers for running axe checks within flows.
 */
export class AccessibilityActions {
  /**
   * Injects axe and runs an accessibility audit on the current page.
   * Logs violations and fails the test if any are found.
   */
  public checkAccessibilityOnly(): void {
    log('a11y', 'Running axe-core accessibility audit on current page');

    cy.injectAxe();
    cy.checkA11y(undefined, undefined, (violations) => {
      if (violations.length) {
        log('a11y', `${violations.length} violation(s) found`, { violations });
        assert.fail(`${violations.length} accessibility violation(s) detected.`);
      }
    });
  }

  /**
   * Runs an accessibility audit on the current page, then navigates back.
   * Optionally verifies the returned path.
   * @param opts - Optional navigation/timeout configuration.
   * @param opts.verifyPath - Path regex to assert after navigating back.
   * @param opts.timeoutMs - Timeout (ms) for location assertions.
   */
  public checkAccessibilityAndNavigateBack(opts?: { verifyPath?: RegExp; timeoutMs?: number }): void {
    const timeout = opts?.timeoutMs ?? 10_000;

    this.checkAccessibilityOnly();

    log('a11y', 'Navigating back via browser history after accessibility audit');
    cy.go('back');

    if (opts?.verifyPath) {
      cy.location('pathname', { timeout }).should('match', opts.verifyPath);
    } else {
      // Generic sanity: not still on comments add/edit route
      cy.location('pathname', { timeout }).should('not.match', /\/comments\/(add|edit)$/i);
    }
  }

  /**
   * Visits each URL provided in a DataTable and performs an accessibility audit.
   * Expects a table with "url" and optional "header" columns.
   * @param dataTable - Table containing rows with `url` and optional `header` keys.
   */
  public checkAccessibilityForUrls(dataTable: DataTable): void {
    const rows = dataTable.hashes();

    for (const row of rows) {
      const url = row['url'];
      const header = row['header'];

      if (!url) {
        throw new Error('Accessibility: DataTable row is missing required "url" column.');
      }

      let message = `Navigating to ${url}`;
      if (header) message += ` and verifying header "${header}"`;
      log('a11y', message, { url, header });

      cy.visit(url);

      if (header) {
        cy.get('.govuk-heading-l', { timeout: 10_000 }).should('be.visible').and('contain.text', header);
      }

      cy.injectAxe();
      cy.checkA11y(undefined, undefined, (violations) => {
        if (violations.length) {
          const violationMsg = `${violations.length} violation(s) found on ${url}`;
          log('a11y', violationMsg, { url, violations });
          assert.fail(`${violations.length} accessibility violation(s) detected on ${url}.`);
        }
      });
    }
  }
}

/** Singleton factory for steps */
export const accessibilityActions = (() => {
  let instance: AccessibilityActions | null = null;
  return () => (instance ??= new AccessibilityActions());
})();
