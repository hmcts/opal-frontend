import { AccountParentOrGuardianDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.parent.guardian.details.locators';

export class AccountDetailsParentGuardianActions {
  /**
   * Clicks the top-right "Change" link in the Parent or guardian tab header.
   *
   * Ensures the tab is active and its header is visible, scrolls the link into view,
   * then clicks it. Optionally waits for a supplied form selector to appear.
   *
   * @param opts Optional behaviour overrides.
   * @param opts.timeout Max time to wait for elements (default 10_000ms).
   * @param opts.formSelector If provided, waits for this form to be visible after clicking.
   */
  public change(opts?: { timeout?: number; formSelector?: string }): void {
    const timeout = opts?.timeout ?? 10_000;

    // Scope to page shell to avoid cross-page bleed
    cy.get(L.shell, { timeout }).should('be.visible');

    // Ensure the Parent or guardian tab is active
    cy.get(L.tabs.parentOrGuardianTab, { timeout }).should('be.visible').scrollIntoView().click({ force: true });

    // Confirm the tab header is present (intent: we're at Parent/Guardian details)
    cy.get(L.parentOrGuardianTabHeader.title, { timeout }).should('be.visible');

    // Click the "Change" link in the Parent or guardian tab header
    cy.get(L.parentOrGuardianTabHeader.changeLink, { timeout })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    // Optionally wait for the edit form to appear
    if (opts?.formSelector) {
      cy.get(opts.formSelector, { timeout }).should('be.visible');
    }
  }

  /**
   * Asserts the Parent/Guardian name on the summary card contains the expected value.
   *
   * @param expected Text expected in the name field.
   */
  public assertNameContains(expected: string): void {
    cy.get(L.parentOrGuardian.fields.name, { timeout: 10_000 }).should('contain.text', expected);
  }

  /**
   * Asserts the Parent/Guardian section header contains expected text.
   *
   * @param expected Expected header text.
   */
  public assertSectionHeader(expected: string): void {
    cy.get(L.parentOrGuardianTabHeader.title, { timeout: 10_000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => expect(t.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }
}
