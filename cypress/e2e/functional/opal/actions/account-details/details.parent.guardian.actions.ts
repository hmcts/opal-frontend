/**
 * @file details.parent.guardian.actions.ts
 * @description Actions for the Parent/Guardian section on Account Details, including navigation
 * to the change form and summary assertions.
 */
import { AccountParentOrGuardianDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.parent-guardian.details.locators';
import { CommonActions } from '../common/common.actions';

/** Actions for the Parent/Guardian section on Account Details. */
export class AccountDetailsParentGuardianActions {
  private readonly common = new CommonActions();

  /**
   * Normalizes visible text for stable whitespace-insensitive assertions.
   *
   * @param value - Raw text content read from the page.
   * @returns Text with non-breaking spaces replaced and whitespace collapsed.
   */
  private normalize(value: string): string {
    return value
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Asserts a map of label/value pairs within a specific Parent or guardian summary card.
   *
   * @param expected - Expected values keyed by visible label text.
   * @param fieldSelectors - Mapping of normalized labels to locators.
   * @param scope - Root selector that must be visible before assertions run.
   */
  private assertMappedValues(
    expected: Record<string, string>,
    fieldSelectors: Record<string, string>,
    scope: string,
  ): void {
    cy.get(scope, this.common.getTimeoutOptions()).should('be.visible');

    Object.entries(expected).forEach(([label, value]) => {
      const normalizedLabel = label.trim().toLowerCase();
      const selector = fieldSelectors[normalizedLabel];

      if (!selector) {
        throw new Error(
          `Unsupported Parent or guardian tab label "${label}". Supported labels: ${Object.keys(fieldSelectors).join(
            ', ',
          )}`,
        );
      }

      cy.get(selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((text) => expect(this.normalize(text)).to.contain(this.normalize(value)));
    });
  }

  /**
   * Clicks the "Change" link in the Parent or guardian details summary card.
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

    // Click the "Change" link in the Parent or guardian details summary card
    cy.get(L.parentOrGuardianTabHeader.changeLink, { timeout })
      .should('be.visible')
      .and('contain.text', L.parentOrGuardianTabHeader.changeLinkLabel)
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    // Optionally wait for the edit form to appear
    if (opts?.formSelector) {
      cy.get(opts.formSelector, { timeout }).should('be.visible');
    }
  }

  /**
   * Asserts the remove parent or guardian action is visible on the Parent or guardian tab.
   */
  public assertRemoveParentGuardianActionVisible(): void {
    cy.get(L.actions.removeParentOrGuardian, { timeout: 10_000 })
      .should('be.visible')
      .and('contain.text', 'Remove Parent or guardian details');
  }

  /**
   * Asserts all rendered Change actions are visible on the Parent or guardian tab.
   */
  public assertChangeActionsVisible(): void {
    cy.get(L.sectionChangeLinks, { timeout: 10_000 })
      .should('exist')
      .each(($link) => {
        cy.wrap($link).should('be.visible').and('have.text', L.parentOrGuardianTabHeader.changeLinkLabel);
      });
  }

  /**
   * Asserts no Change actions are rendered on the Parent or guardian tab.
   */
  public assertChangeActionsNotPresent(): void {
    cy.get(L.sectionChangeLinks, { timeout: 10_000 }).should('not.exist');
  }

  /**
   * Asserts the remove parent or guardian action is not rendered on the Parent or guardian tab.
   */
  public assertRemoveParentGuardianActionNotPresent(): void {
    cy.get(L.actions.removeParentOrGuardian, { timeout: 10_000 }).should('not.exist');
  }

  /**
   * Clicks the remove parent or guardian action on the Parent or guardian tab.
   */
  public startRemoveParentGuardianDetails(): void {
    cy.get(L.actions.removeParentOrGuardian, { timeout: 10_000 }).should('be.visible').click({ force: true });
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

  /**
   * Asserts the Parent or guardian details summary-card values.
   *
   * @param expected - Map of visible labels to expected values.
   */
  public assertParentGuardianDetails(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      name: L.parentOrGuardian.fields.name,
      aliases: L.parentOrGuardian.fields.aliases,
      'date of birth': L.parentOrGuardian.fields.dateOfBirth,
      'national insurance number': L.parentOrGuardian.fields.nationalInsuranceNumber,
      address: L.parentOrGuardian.fields.address,
      'vehicle make and model': L.parentOrGuardian.fields.vehicleMakeAndModel,
      'vehicle registration': L.parentOrGuardian.fields.vehicleRegistration,
    };

    this.assertMappedValues(expected, fieldSelectors, L.parentOrGuardian.card);
  }

  /**
   * Asserts the Language preferences summary-card values on the Parent or guardian tab.
   *
   * @param expected - Map of visible language preference labels to expected values.
   */
  public assertLanguagePreferences(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'document language': L.languagePreferences.fields.documentLanguage,
      'court hearing language': L.languagePreferences.fields.courtHearingLanguage,
    };

    this.assertMappedValues(expected, fieldSelectors, L.languagePreferences.card);
  }
}
