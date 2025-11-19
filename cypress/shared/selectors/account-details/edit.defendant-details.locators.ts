/**
 * Defendant Details – Selectors map for defendant details
 *
 * Robust, ID-first selectors for the Edit Defendant details form.
 * Use these in your Page Object / actions. No DOM-coupled text selectors.
 *
 * @remarks
 * - ESM/TypeScript friendly. Exported as a plain object `as const`.
 * - Parameterised helpers are provided for dynamic datepicker cells.
 */

export type Locator = {
  /** A stable CSS selector (prefer #id). */
  selector: string;
  /** Optional description for clarity in tests and reports. */
  desc?: string;
};

/** Parameterised helpers for dynamic elements. */
export type LocatorFns = {
  /** Button inside the date grid for a given dd/mm/yyyy (matches `data-testid`). */
  dateGridButtonByDMY: (dmy: string) => Locator;
};

/**
 * All static locators for the page. Keep alphabetised by key.
 */
export const DefendantDetailsLocators = {
  /** Root/main areas */
  mainContent: { selector: 'main#main-content', desc: 'Main content region' },
  pageCaption: { selector: 'h1.govuk-heading-l > span.govuk-caption-l', desc: 'Case reference + name caption' },
  pageHeading: { selector: 'h1.govuk-heading-l', desc: 'Page H1' },

  /** Header / global */
  signOutLink: { selector: 'nav.moj-header__navigation a.moj-header__navigation-link', desc: 'Sign out' },

  form: {
    selector: 'app-fines-acc-debtor-add-amend-form form',
    desc: 'Main edit form container',
  },

  /** Buttons */
  saveChangesButton: { selector: 'button#submitForm', desc: 'Save changes' },
  cancelLink: { selector: 'a.govuk-link.button-link', desc: 'Cancel' },

  /** Defendant details */
  titleSelect: { selector: '#facc_party_add_amend_convert_title', desc: 'Title select' },
  forenamesInput: { selector: '#facc_party_add_amend_convert_forenames', desc: 'First names' },
  surnameInput: { selector: '#facc_party_add_amend_convert_surname', desc: 'Last name' },
  addAliasesCheckbox: { selector: '#facc_party_add_amend_convert_add_alias', desc: 'Add aliases' },

  /** Date of birth (MOJ datepicker) */
  dobInput: { selector: '#facc_party_add_amend_convert_dob', desc: 'DOB text input' },
  dobToggleButton: {
    selector: 'button.moj-datepicker__toggle[aria-controls^="datepicker-facc_party_add_amend_convert_dob"]',
    desc: 'Open datepicker',
  },
  dobDialog: { selector: '#datepicker-facc_party_add_amend_convert_dob', desc: 'Datepicker dialog' },
  dobMonthYearHeading: { selector: '#datepicker-title-facc_party_add_amend_convert_dob', desc: 'Month/Year heading' },
  dobPrevMonthButton: { selector: '.moj-datepicker__button.moj-js-datepicker-prev-month', desc: 'Prev month' },
  dobNextMonthButton: { selector: '.moj-datepicker__button.moj-js-datepicker-next-month', desc: 'Next month' },
  dobPrevYearButton: { selector: '.moj-datepicker__button.moj-js-datepicker-prev-year', desc: 'Prev year' },
  dobNextYearButton: { selector: '.moj-datepicker__button.moj-js-datepicker-next-year', desc: 'Next year' },
  dobOkButton: { selector: '.govuk-button-group .moj-js-datepicker-ok', desc: 'Datepicker Select' },
  dobCancelButton: { selector: '.govuk-button-group .moj-js-datepicker-cancel', desc: 'Datepicker Close' },

  /** Derived/summary panel */
  agePanel: { selector: '.moj-ticket-panel__content strong', desc: 'Age value' },

  /** Identity numbers */
  ninoInput: { selector: '#facc_party_add_amend_convert_national_insurance_number', desc: 'National Insurance number' },

  /** Address */
  addressLine1Input: { selector: '#facc_party_add_amend_convert_address_line_1', desc: 'Address line 1' },
  addressLine2Input: { selector: '#facc_party_add_amend_convert_address_line_2', desc: 'Address line 2' },
  addressLine3Input: { selector: '#facc_party_add_amend_convert_address_line_3', desc: 'Address line 3' },
  postcodeInput: { selector: '#facc_party_add_amend_convert_post_code', desc: 'Postcode' },

  /** Contact details */
  primaryEmailInput: { selector: '#facc_party_add_amend_convert_contact_email_address_1', desc: 'Primary email' },
  secondaryEmailInput: { selector: '#facc_party_add_amend_convert_contact_email_address_2', desc: 'Secondary email' },
  mobileTelInput: {
    selector: '#facc_party_add_amend_convert_contact_telephone_number_mobile',
    desc: 'Mobile telephone',
  },
  homeTelInput: { selector: '#facc_party_add_amend_convert_contact_telephone_number_home', desc: 'Home telephone' },
  workTelInput: { selector: '#facc_party_add_amend_convert_contact_telephone_number_business', desc: 'Work telephone' },

  /** Vehicle */
  vehicleMakeModelInput: { selector: '#facc_party_add_amend_convert_vehicle_make', desc: 'Vehicle make & model' },
  vehicleRegInput: {
    selector: '#facc_party_add_amend_convert_vehicle_registration_mark',
    desc: 'Vehicle registration',
  },

  /** Employer details */
  employerNameInput: { selector: '#facc_party_add_amend_convert_employer_company_name', desc: 'Employer name' },
  employerRefInput: { selector: '#facc_party_add_amend_convert_employer_reference', desc: 'Employee reference' },
  employerEmailInput: { selector: '#facc_party_add_amend_convert_employer_email_address', desc: 'Employer email' },
  employerTelInput: { selector: '#facc_party_add_amend_convert_employer_telephone_number', desc: 'Employer telephone' },

  /** Employer address */
  employerAddressLine1Input: {
    selector: '#facc_party_add_amend_convert_employer_address_line_1',
    desc: 'Employer address line 1',
  },
  employerAddressLine2Input: {
    selector: '#facc_party_add_amend_convert_employer_address_line_2',
    desc: 'Employer address line 2',
  },
  employerAddressLine3Input: {
    selector: '#facc_party_add_amend_convert_employer_address_line_3',
    desc: 'Employer address line 3',
  },
  employerAddressLine4Input: {
    selector: '#facc_party_add_amend_convert_employer_address_line_4',
    desc: 'Employer address line 4',
  },
  employerAddressLine5Input: {
    selector: '#facc_party_add_amend_convert_employer_address_line_5',
    desc: 'Employer address line 5',
  },
  employerPostcodeInput: { selector: '#facc_party_add_amend_convert_employer_post_code', desc: 'Employer postcode' },
} as const satisfies Record<string, Locator>;

/**
 * Parameterised selectors for dynamic nodes.
 */
export const DebtorAddAmendLocatorFns: LocatorFns = {
  /**
   * Returns the date button within the DOB calendar grid that matches the provided D/M/YYYY or DD/MM/YYYY.
   *
   * @example
   * // Cypress
   * cy.get(DebtorAddAmendLocators.dobDialog.selector)
   *   .find(DebtorAddAmendLocatorFns.dateGridButtonByDMY('05/11/2025').selector)
   *   .click();
   *
   * @param dmy - Date in `d/m/yyyy` or `dd/mm/yyyy` format matching `data-testid`.
   */
  dateGridButtonByDMY: (dmy: string) => ({
    selector: `table.moj-js-datepicker-grid button[data-testid="${dmy}"]`,
    desc: `Date grid button for ${dmy}`,
  }),
};

export default DefendantDetailsLocators;
