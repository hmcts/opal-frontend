/**
 * @file account.details.locators.ts
 * @description
 * Selector map for the **Defendant tab** within the Account Details view.
 * Defines stable selectors for headings, summary fields, and actionable links
 * inside the defendant’s summary card and summary list.
 *
 * @remarks
 * - All selectors use persistent `id` attributes from the GOV.UK summary list structure.
 * - Designed for use by `AccountDetailsDefendantActions` and any tests interacting
 *   with the Defendant tab content (e.g., assertions, edit flows).
 * - Should always be scoped from within the Account Details shell, not globally.
 *
 * @example
 * ```ts
 * // Assert name and date of birth values
 * cy.get(AccountDefendantDetailsLocators.fields.name).should('contain.text', 'John Smith');
 * cy.get(AccountDefendantDetailsLocators.fields.dateOfBirth).should('contain.text', '01/01/1990');
 * ```
 *
 * @see {@link AccountDetailsDefendantActions}
 */

export const AccountDefendantDetailsLocators = {
  // ──────────────────────────────
  // Page title and caption
  // ──────────────────────────────

  /** Page heading showing the defendant’s name (e.g., “John Smith”). */
  header: 'main h1.govuk-heading-l',

  /** Caption beneath the header showing the account reference number. */
  headerCaption: 'main h1.govuk-heading-l .govuk-caption-l',

  // ──────────────────────────────
  // Summary fields (Defendant details)
  // ──────────────────────────────

  /** Fields section mapped by stable IDs from the summary card/list. */
  fields: {
    /** Full name value field. */
    name: '#defendantDetailsNameValue',

    /** Aliases value field (if any). */
    aliases: '#defendantDetailsAliasesValue',

    /** Date of birth value field. */
    dateOfBirth: '#defendantDetailsDobValue',

    /** National Insurance number value field. */
    nationalInsuranceNumber: '#defendantDetailsNational_insurance_numberValue',

    /** Address value field (may include multi-line content). */
    address: '#defendantDetailsAddressValue',

    /** Vehicle make and model value field (if applicable). */
    vehicleMakeAndModel: '#defendantDetailsVehicle_make_and_modelValue',

    /** Vehicle registration number value field. */
    vehicleRegistration: '#defendantDetailsVehicle_registrationValue',
  },

  // ──────────────────────────────
  // Links and actions
  // ──────────────────────────────

  /** Links and buttons within the defendant summary card header. */
  links: {
    /**
     * Actions container within the defendant summary card header.
     * Can include links or buttons for future actions (currently empty in sample HTML).
     */
    cardActions:
      '#defendant-summary-card-list .govuk-summary-card__actions a, #defendant-summary-card-list .govuk-summary-card__actions button',

    /** The navigation tab link for “Defendant.” */
    tab: 'li[subnavitemid="defendant-tab"] a.moj-sub-navigation__link',
  },

  // ──────────────────────────────
  // View mode
  // ──────────────────────────────

  /** Header for subsections or cards within the view mode. */
  view: {
    sectionHeader: 'h2.govuk-heading-s, .account-details__section-title',
  },

  // ──────────────────────────────
  // Edit mode
  // ──────────────────────────────

  /** Root form container for editing defendant details. */
  edit: {
    form: 'form, .account-details__form',
  },
};
