/**
 * @file edit.parent-guardian.details.locators.ts
 * @description
 * Selector map for the **Parent or guardian – Edit form**
 * Uses stable IDs from the DOM and minimal structure for actions.
 *
 * @remarks
 * - All selectors are scoped to the main content area and the edit form component.
 * - Input fields use the exact `id`/`name` attributes shown in the DOM.
 * - Date picker controls are exposed for both toggling and confirming selections.
 *
 * @example
 * // Assert page header caption + title
 * cy.get(`${parentGuardianDetailsLocators.formRoot} ${parentGuardianDetailsLocators.headerCaption}`)
 *   .should('contain.text', '25000001E - Miss Catherine GREEN');
 * cy.get(`${parentGuardianDetailsLocators.formRoot} ${parentGuardianDetailsLocators.headerTitle}`)
 *   .should('contain.text', 'Parent or guardian details');
 *
 * // Enter first/last names and cancel
 * cy.get(parentGuardianDetailsLocators.fields.firstNames).type('FNAMECHANGE');
 * cy.get(`${parentGuardianDetailsLocators.formRoot} ${parentGuardianDetailsLocators.actions.cancelLink}`).click();
 *
 * // Pick a specific DOB date (example)
 * cy.get(parentGuardianDetailsLocators.fields.dobDatepicker.toggleButton).click();
 * cy.get(`${parentGuardianDetailsLocators.fields.dobDatepicker.dialog} button[data-testid="03/11/2025"]`).click();
 * cy.get(parentGuardianDetailsLocators.fields.dobDatepicker.okButton).click();
 */

export const parentGuardianDetailsLocators = {
  // ──────────────────────────────
  // Shell / scope
  // ──────────────────────────────
  /** Main content root to scope all selections on Details pages. */
  shell: 'main#main-content',
  /** Edit form component root (Parent/Guardian add/amend). */
  formRoot: 'app-fines-acc-debtor-add-amend-form',
  /** The actual <form> element within the edit component. */
  form: 'app-fines-acc-debtor-add-amend-form form',

  // ──────────────────────────────
  // Page header
  // ──────────────────────────────
  /** Page heading (contains caption + section title). */
  headerH1: 'app-fines-acc-debtor-add-amend-form h1.govuk-heading-l',
  /** Caption within the header showing account ref and current name. */
  headerCaption: 'app-fines-acc-debtor-add-amend-form h1.govuk-heading-l .govuk-caption-l',
  /** Section title text node that should read "Parent or guardian details". */
  headerTitle: 'app-fines-acc-debtor-add-amend-form h1.govuk-heading-l',

  // ──────────────────────────────
  // Primary actions (bottom of form)
  // ──────────────────────────────
  actions: {
    /** Save changes button. */
    // Tip: can also be used as `#submitForm` when combined with `formRoot` scoping
    saveButton: 'app-fines-acc-debtor-add-amend-form #submitForm',
    /** Cancel link (styled as button-link). */
    cancelLink: 'app-fines-acc-debtor-add-amend-form a.govuk-link.button-link',
  },

  // ──────────────────────────────
  // Person details fields
  // ──────────────────────────────
  fields: {
    /** First names input. */
    firstNames: '#facc_party_add_amend_convert_forenames',
    /** Last name input. */
    lastName: '#facc_party_add_amend_convert_surname',

    // Aliases
    addAliases: '#facc_party_add_amend_convert_add_alias',
    aliasesConditionalRoot: '#facc_party_add_amend_convert_add_alias-conditional',
    alias: {
      /** Alias 1 first names input. */
      firstNames_0: '#facc_party_add_amend_convert_alias_forenames_0',
      /** Alias 1 last name input. */
      lastName_0: '#facc_party_add_amend_convert_alias_surname_0',
      /** "Add another alias" button. */
      addAnotherButton: '#addAlias',
    },

    // Date of birth (with MOJ date picker)
    dob: '#facc_party_add_amend_convert_dob',
    dobDatepicker: {
      /** Date picker toggle button next to the DOB input. */
      toggleButton: 'app-fines-acc-debtor-add-amend-form .moj-datepicker__toggle.moj-js-datepicker-toggle',
      /** Date picker dialog container (tied to the DOB input). */
      dialog: '#datepicker-facc_party_add_amend_convert_dob',
      /** OK/Select button within the date picker dialog. */
      okButton: '#datepicker-facc_party_add_amend_convert_dob .govuk-button-group .moj-js-datepicker-ok',
      /** Close/Cancel button within the date picker dialog. */
      closeButton: '#datepicker-facc_party_add_amend_convert_dob .govuk-button-group .moj-js-datepicker-cancel',
      /** Calendar grid (role="application"). */
      grid: '#datepicker-facc_party_add_amend_convert_dob .moj-datepicker__calendar.moj-js-datepicker-grid',
      /** Any calendar day button. Combine with [data-testid=\"DD/MM/YYYY\"]. */
      dayButton: '#datepicker-facc_party_add_amend_convert_dob .moj-datepicker__calendar button',
    },

    /** National Insurance number input. */
    nationalInsuranceNumber: '#facc_party_add_amend_convert_national_insurance_number',

    // Address
    address: {
      line1: '#facc_party_add_amend_convert_address_line_1',
      line2: '#facc_party_add_amend_convert_address_line_2',
      line3: '#facc_party_add_amend_convert_address_line_3',
      postcode: '#facc_party_add_amend_convert_post_code',
    },

    // Contact details
    contact: {
      primaryEmail: '#facc_party_add_amend_convert_contact_email_address_1',
      secondaryEmail: '#facc_party_add_amend_convert_contact_email_address_2',
      mobileTelephone: '#facc_party_add_amend_convert_contact_telephone_number_mobile',
      homeTelephone: '#facc_party_add_amend_convert_contact_telephone_number_home',
      workTelephone: '#facc_party_add_amend_convert_contact_telephone_number_business',
    },

    // Vehicle details
    vehicle: {
      makeAndModel: '#facc_party_add_amend_convert_vehicle_make',
      registration: '#facc_party_add_amend_convert_vehicle_registration_mark',
    },

    // Employer details
    employer: {
      name: '#facc_party_add_amend_convert_employer_company_name',
      reference: '#facc_party_add_amend_convert_employer_reference',
      email: '#facc_party_add_amend_convert_employer_email_address',
      telephone: '#facc_party_add_amend_convert_employer_telephone_number',
    },

    // Employer address
    employerAddress: {
      line1: '#facc_party_add_amend_convert_employer_address_line_1',
      line2: '#facc_party_add_amend_convert_employer_address_line_2',
      line3: '#facc_party_add_amend_convert_employer_address_line_3',
      line4: '#facc_party_add_amend_convert_employer_address_line_4',
      line5: '#facc_party_add_amend_convert_employer_address_line_5',
      postcode: '#facc_party_add_amend_convert_employer_post_code',
    },
  },
};
