// e2e/functional/opal/actions/search/search.problem.actions.ts

import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { AccountSearchProblemLocators as L } from '../../../../../shared/selectors/account-search/account.search.problem.locators';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountSearchProblemActions');

/**
 * Actions for the "There is a problem" / problem view shown when cross-section validation fails.
 */
export class AccountSearchProblemActions {
  private readonly common = new CommonActions();

  /**
   * Assert the problem page root exists and the expected main heading is visible.
   */
  public assertProblemPageDisplayed(): void {
    log('assert', 'Verifying problem page root and heading');
    cy.get(L.root, { timeout: 10_000 }).should('exist').and('be.visible');
    cy.get(L.heading, { timeout: 10_000 }).should('be.visible').and('have.text', 'There is a problem');
  }

  /**
   * Assert generic GOV.UK “There is a problem” page is shown.
   */
  public assertProblemPage(): void {
    log('assert', 'Asserting GOV.UK problem page');
    cy.contains('h1.govuk-heading-l', 'There is a problem', this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Assert the descriptive paragraph (the "there is a problem" message) matches the expected text.
   *
   * @param expected The expected description text (exact or substring).
   */
  public assertProblemDescription(expected: string): void {
    log('assert', `Verifying problem description contains: "${expected}"`);
    cy.get(L.description, { timeout: 10_000 })
      .should('be.visible')
      .and(($p) => {
        const text = $p.text().trim();
        // allow either exact or substring match
        expect(text.includes(expected), `problem description contains "${expected}"`).to.be.true;
      });
  }

  /**
   * Assert the bullet list contains the expected CSV list of options (comma separated).
   * Example expectedCSV: "account number, reference or case number, selected tab"
   *
   * This method normalises whitespace and lowercases items to make assertions robust.
   * @param expectedCSV - Comma-separated list of expected bullet items.
   */
  public assertProblemBulletedOptions(expectedCSV: string): void {
    const expectedItems = expectedCSV
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    log('assert', `Verifying problem bullet list contains: [${expectedItems.join(', ')}]`);

    cy.get(L.bulletList, { timeout: 10_000 })
      .should('be.visible')
      .within(() => {
        cy.get('li').then(($lis) => {
          const actual = Array.from($lis).map((li) => li.textContent?.trim().toLowerCase() ?? '');
          // Ensure each expected item appears in the list (order-insensitive)
          for (const expectedItem of expectedItems) {
            const matchFound = actual.some((a) => a.includes(expectedItem));
            expect(matchFound, `expected bullet list to include "${expectedItem}" — actual: ${JSON.stringify(actual)}`)
              .to.be.true;
          }
        });
      });
  }

  /**
   * Click the "Go back" link on the problem page.
   */
  public clickBackLink(): void {
    log('action', 'Clicking Go back link on problem page');
    cy.get(L.actions.backLink, { timeout: 10_000 }).should('be.visible').click();
  }
}
