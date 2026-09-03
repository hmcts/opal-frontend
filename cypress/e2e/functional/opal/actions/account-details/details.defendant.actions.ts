/**
 * @file details.defendant.actions.ts
 * @description Provides reusable UI interactions and assertions for the Defendant Details page.
 * Supports both individual and company account contexts.
 */
import { AccountDefendantDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.defendant.details.locators';
import { AccountCompanyDetailsLocators as C } from '../../../../../shared/selectors/account-details/account.company.details.locators';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as H } from '../../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { CommonActions } from '../common/common.actions';

/** Actions and assertions for the Defendant tab on Account Details. */
export class AccountDetailsDefendantActions {
  readonly common = new CommonActions();

  /**
   * Normalizes visible text for stable whitespace-insensitive assertions.
   *
   * @param value - Raw text content read from the page.
   * @returns Text with non-breaking spaces replaced and whitespace collapsed.
   */
  private normalize(value: string): string {
    return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Asserts a map of label/value pairs within a specific summary card.
   *
   * @param expected - Expected values keyed by visible label text.
   * @param fieldSelectors - Mapping of normalized labels to locators.
   * @param scope - Root selector that must be visible before assertions run.
   */
  private assertMappedValues(expected: Record<string, string>, fieldSelectors: Record<string, string>, scope: string): void {
    cy.get(scope, this.common.getTimeoutOptions()).should('be.visible');

    Object.entries(expected).forEach(([label, value]) => {
      const normalizedLabel = label.trim().toLowerCase();
      const selector = fieldSelectors[normalizedLabel];

      if (!selector) {
        throw new Error(
          `Unsupported Defendant tab label "${label}". Supported labels: ${Object.keys(fieldSelectors).join(', ')}`,
        );
      }

      cy.get(selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((text) => expect(this.normalize(text)).to.contain(this.normalize(value)));
    });
  }

  /**
   * Assert section header text matches expectation
   * @param expected - Expected heading text.
   */
  assertSectionHeader(expected: string): void {
    cy.get(L.defendantTabHeader.title, this.common.getTimeoutOptions())
      .should('be.visible')
      .should(($h2) => {
        const actual = $h2.text().trim().toLowerCase();
        const exp = expected.trim().toLowerCase();
        expect(actual).to.contain(exp);
      });
  }

  /**
   * Asserts the permanent Collection Order data-quality warning in the account header.
   * @param message - Warning text expected in the account header.
   */
  assertCollectionOrderWarning(message: string): void {
    cy.get(H.collectionOrderWarningBanner, this.common.getTimeoutOptions())
      .should('be.visible')
      .and('contain.text', message);
    cy.get(H.collectionOrderWarningAlert).should('be.visible');
    cy.get(H.collectionOrderWarningBanner).find('button').should('not.exist');
  }

  /** Asserts that Collection Order data is aligned and no warning is rendered. */
  assertCollectionOrderWarningNotPresent(): void {
    cy.get(H.collectionOrderWarningBanner).should('not.exist');
  }

  /**
   * Clicks the top-right "Change" link in the Defendant tab header.
   *
   * Ensures the tab header is visible first, scrolls the link into view,
   * then clicks it. Optionally waits for a supplied form selector to appear.
   *
   * @param {Object} [opts] - Optional configuration for the click/wait.
   * @param {number} [opts.timeout=10000] - Max time to wait for elements.
   * @param {string} [opts.formSelector] - If provided, waits for this form to be visible after clicking.
   */
  change(opts?: { timeout?: number; formSelector?: string }): void {
    const timeout = opts?.timeout ?? 10_000;

    // Make sure we're on the Defendant tab and its header is visible
    cy.get(L.defendantTabHeader.title, { timeout }).should('be.visible');

    cy.get(L.defendantTabHeader.title, { timeout })
      .invoke('text')
      .then((titleText) => {
        const isCompanyDetails = titleText.toLowerCase().includes('company');
        const changeLinkSelector = isCompanyDetails ? C.cardActions : L.defendant.cardActions;

        // Click the "Change" link in the relevant summary card header
        cy.get(changeLinkSelector, { timeout })
          .contains('Change')
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true });
      });

    // Optionally wait for the edit form to appear
    if (opts?.formSelector) {
      cy.get(opts.formSelector, { timeout }).should('be.visible');
    }
  }

  /**
   * Asserts the defendant name on the summary card contains the expected value.
   * @param expected text expected in the name field
   */
  assertDefendantNameContains(expected: string): void {
    cy.get(L.defendant.fields.name, this.common.getTimeoutOptions()).should('contain.text', expected);
  }

  /**
   * Asserts the defendant summary card is rendered in the Defendant tab.
   */
  assertDefendantSummaryVisible(): void {
    cy.get(L.defendant.card, this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Asserts the defendant summary card is not rendered in the Defendant tab.
   */
  assertDefendantSummaryNotPresent(): void {
    cy.get(L.defendant.card, this.common.getTimeoutOptions()).should('not.exist');
  }

  /**
   * Asserts the Defendant details summary-card values.
   *
   * @param expected - Map of visible labels to expected values.
   */
  public assertDefendantDetails(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      name: L.defendant.fields.name,
      aliases: L.defendant.fields.aliases,
      'date of birth': L.defendant.fields.dateOfBirth,
      'national insurance number': L.defendant.fields.nationalInsuranceNumber,
      address: L.defendant.fields.address,
      'vehicle make and model': L.defendant.fields.vehicleMakeAndModel,
      'vehicle registration': L.defendant.fields.vehicleRegistration,
    };

    this.assertMappedValues(expected, fieldSelectors, L.defendant.card);
  }

  /**
   * Asserts the primary email address shown in the contact summary contains the expected value.
   *
   * @param expected - Expected text within the primary email field.
   */
  assertPrimaryEmailContains(expected: string): void {
    cy.get(L.contact.fields.primaryEmail, this.common.getTimeoutOptions()).should('contain.text', expected);
  }

  /**
   * Asserts the Contact details summary-card values.
   *
   * @param expected - Map of visible labels to expected values.
   */
  public assertContactDetails(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'primary email address': L.contact.fields.primaryEmail,
      'secondary email address': L.contact.fields.secondaryEmail,
      'mobile telephone number': L.contact.fields.mobileTelephone,
      'home telephone number': L.contact.fields.homeTelephone,
      'work telephone number': L.contact.fields.workTelephone,
    };

    this.assertMappedValues(expected, fieldSelectors, L.contact.card);
  }

  /**
   * Asserts the Employer details summary-card values.
   *
   * @param expected - Map of visible labels to expected values.
   */
  public assertEmployerDetails(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'employer name': L.employer.fields.employerName,
      'employer reference': L.employer.fields.employerReference,
      'employer email': L.employer.fields.employerEmail,
      'employer email address': L.employer.fields.employerEmail,
      'employer telephone': L.employer.fields.employerTelephone,
      'employer telephone number': L.employer.fields.employerTelephone,
      'employer address': L.employer.fields.employerAddress,
    };

    this.assertMappedValues(expected, fieldSelectors, L.employer.card);
  }

  /**
   * Asserts that the convert-to-company action is visible in the Defendant tab.
   */
  assertConvertToCompanyActionVisible(): void {
    cy.get(L.actions.convertAction, this.common.getTimeoutOptions())
      .should('be.visible')
      .and('contain.text', 'Convert to a company account');
  }

  /**
   * Asserts that the convert-to-individual action is visible in the Defendant tab.
   */
  assertConvertToIndividualActionVisible(): void {
    cy.get(L.actions.convertAction, this.common.getTimeoutOptions())
      .should('be.visible')
      .and('contain.text', 'Convert to an individual account');
  }

  /**
   * Asserts that the add parent/guardian action is visible in the Defendant tab.
   */
  assertAddParentGuardianActionVisible(): void {
    cy.contains(
      L.actions.addParentGuardianActionLink,
      L.actions.addParentGuardianActionLabel,
      this.common.getTimeoutOptions(),
    ).should('be.visible');
  }

  /**
   * Asserts that the add parent/guardian action is not rendered in the Defendant tab.
   */
  assertAddParentGuardianActionNotPresent(): void {
    cy.contains(
      L.actions.addParentGuardianActionLink,
      L.actions.addParentGuardianActionLabel,
      this.common.getTimeoutOptions(),
    ).should('not.exist');
  }

  /**
   * Asserts that the visible convert action does not contain the company label.
   */
  assertConvertToCompanyActionTextNotPresent(): void {
    cy.get(L.actions.convertAction, this.common.getTimeoutOptions())
      .should('be.visible')
      .and('not.contain.text', 'Convert to a company account');
  }

  /**
   * Clicks the convert-to-company action from the Defendant tab.
   */
  startConvertToCompanyAccount(): void {
    cy.get(L.actions.convertActionLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Clicks the convert-to-individual action from the Defendant tab.
   */
  startConvertToIndividualAccount(): void {
    cy.get(L.actions.convertActionLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Clicks the add parent/guardian action from the Defendant tab.
   */
  startAddParentGuardianDetails(): void {
    cy.contains(
      L.actions.addParentGuardianActionLink,
      L.actions.addParentGuardianActionLabel,
      this.common.getTimeoutOptions(),
    )
      .should('be.visible')
      .click();
  }

  /**
   * Asserts that the convert-to-company action is not rendered in the Defendant tab.
   */
  assertConvertToCompanyActionNotPresent(): void {
    cy.get(L.actions.convertAction, this.common.getTimeoutOptions()).should('not.exist');
  }
}
