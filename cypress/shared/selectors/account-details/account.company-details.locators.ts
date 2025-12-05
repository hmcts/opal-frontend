/**
 * @file account.company-details.locators.ts
 * @description
 * Selector map for the **Company details summary card** within the Defendant tab
 * of the Account Details view (when viewing a company account).
 *
 * @remarks
 * - All summary fields map to persistent `id` attributes inside GOV.UK summary lists.
 * - These selectors are for read-only summary views, not edit forms.
 * - For edit form selectors, see {@link edit.company-details.locators.ts}.
 *
 * @example
 * ```ts
 * // Assert company name on summary card
 * cy.get(AccountCompanyDetailsLocators.fields.name).should('contain.text', 'Acme Ltd');
 *
 * // Assert company address
 * cy.get(AccountCompanyDetailsLocators.fields.address).should('contain.text', '123 Business St');
 * ```
 *
 * @see {@link EditCompanyDetailsActions}
 */
export const AccountCompanyDetailsLocators = {
  // ──────────────────────────────
  // Company details (summary card inside Defendant tab for company accounts)
  // ──────────────────────────────

  /** Company details summary card wrapper. */
  card: '#company-summary-card-list',

  /** Company details summary list container. */
  list: '#companyDetails',

  /** Company fields (stable by ID). */
  fields: {
    /** Company name value field. */
    name: '#companyDetailsNameValue',

    /** Company aliases value field (if any). */
    aliases: '#companyDetailsAliasesValue',

    /** Company address value field. */
    address: '#companyDetailsAddressValue',

    /** Vehicle make and model value field (if applicable). */
    vehicleMakeAndModel: '#companyDetailsVehicle_make_and_modelValue',

    /** Vehicle registration number value field (if applicable). */
    vehicleRegistration: '#companyDetailsVehicle_registrationValue',
  },

  /** Actions inside the company summary card header. */
  cardActions:
    '#company-summary-card-list .govuk-summary-card__actions a, #company-summary-card-list .govuk-summary-card__actions button',
};
