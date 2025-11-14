/**
 * @file details.company.locators.ts
 * @description
 * Selector map for the **Company details** add/amend form (Defendant → Company).
 *
 * Targets stable attributes first (IDs, roles)
 *
 * @remarks
 * - Root component: <app-fines-acc-debtor-add-amend-form>
 * - Header text: "Company details" with a caption containing the reference
 *   (e.g., "25000136W - Accdetail comp")
 * - Form controls expose predictable input IDs; we key on those.
 *
 * @example
 * // assert the page header
 * cy.get(CompanyDetailsLocators.header).should('contain.text', 'Company details');
 *
 * // type company name and save
 * cy.get(CompanyDetailsLocators.fields.companyName).type('Acme Ltd');
 * cy.get(CompanyDetailsLocators.actions.saveChanges).click();
 */
export const CompanyDetailsLocators = {
  // ──────────────────────────────
  // Root / layout
  // ──────────────────────────────
  /** Root container for the Company details form (Angular + main wrapper). */
  root: 'app-fines-acc-debtor-add-amend-form, main[role="main"].govuk-main-wrapper',

  /** The actual HTML <form> element for this page. */
  form: 'app-fines-acc-debtor-add-amend-form form',

  /** Generic GOV.UK error summary (if present). */
  errorSummary: 'opal-lib-govuk-error-summary, .govuk-error-summary',

  // ──────────────────────────────
  // Page title and caption
  // ──────────────────────────────
  /** Page header "Company details". */
  header: 'main h1.govuk-heading-l',

  /** Small caption above the header containing the reference number/title. */
  headerCaption: 'main h1.govuk-heading-l > .govuk-caption-l',

  // ──────────────────────────────
  // Fields — Company
  // ──────────────────────────────
  fields: {
    /** Company name input. */
    companyName: '#facc_party_add_amend_convert_organisation_name',

    /** "Add aliases" checkbox. */
    addAliasesCheckbox: '#facc_party_add_amend_convert_add_alias',

    // ─── Address ─────────────────
    addressLine1: '#facc_party_add_amend_convert_address_line_1',
    addressLine2: '#facc_party_add_amend_convert_address_line_2',
    addressLine3: '#facc_party_add_amend_convert_address_line_3',
    postcode: '#facc_party_add_amend_convert_post_code',

    // ─── Contact details ────────
    primaryEmail: '#facc_party_add_amend_convert_contact_email_address_1',
    secondaryEmail: '#facc_party_add_amend_convert_contact_email_address_2',
    mobileTelephone: '#facc_party_add_amend_convert_contact_telephone_number_mobile',
    homeTelephone: '#facc_party_add_amend_convert_contact_telephone_number_home',
    workTelephone: '#facc_party_add_amend_convert_contact_telephone_number_business',

    // ─── Vehicle details ────────
    vehicleMakeModel: '#facc_party_add_amend_convert_vehicle_make',
    vehicleRegistration: '#facc_party_add_amend_convert_vehicle_registration_mark',
  },

  // ──────────────────────────────
  // Fieldset legends (useful for scoping)
  // ──────────────────────────────
  legends: {
    address: 'fieldset .govuk-fieldset__legend--m:contains("Address")',
    contactDetails: 'fieldset .govuk-fieldset__legend--m:contains("Contact details")',
    vehicleDetails: 'fieldset .govuk-fieldset__legend--m:contains("Vehicle details")',
  },

  // ──────────────────────────────
  // Actions
  // ──────────────────────────────
  actions: {
    /** Primary submit button ("Save changes"). */
    saveChanges: 'button#submitForm.govuk-button',

    /** Cancel link under the form. */
    cancelLink: 'a.govuk-link.button-link',
  },
} as const;
