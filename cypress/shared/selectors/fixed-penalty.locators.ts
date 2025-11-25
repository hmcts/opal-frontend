/**
 * @file fixed-penalty.locators.ts
 * @description
 * Selector map for the **Fixed Penalty Account Summary** pages.
 * Defines reusable, scoped locators for account summary sections, form fields,
 * and verification elements in Fixed Penalty workflows.
 *
 * @remarks
 * - Supports both individual and company Fixed Penalty accounts
 * - Includes selectors for failed account details verification
 * - Uses summary list row IDs for consistent data verification
 * - Designed for manual account creation and check/validate flows
 *
 * @example
 * ```ts
 * // Verify account type
 * cy.get(FixedPenaltyLocators.summaryData.accountType)
 *   .should('contain', 'Fixed Penalty');
 *
 * // Enter amount imposed
 * cy.get(FixedPenaltyLocators.forms.amountImposed).type('100.00');
 * ```
 *
 * @see {@link manualFixedPenalty.ts}
 */

export const FixedPenaltyLocators = {
  // ──────────────────────────────
  // Page-level selectors
  // ──────────────────────────────

  /** Page-level elements. */
  page: {
    /** Main page heading showing defendant/company name. */
    heading: 'h1.govuk-heading-l',

    /** Summary card sections container. */
    summaryCards: '.govuk-summary-card',

    /** Summary card titles. */
    summaryCardTitles: '.govuk-summary-card__title',
  },

  // ──────────────────────────────
  // Form input selectors
  // ──────────────────────────────

  /** Form field selectors for Fixed Penalty data entry. */
  forms: {
    /** Issuing Authority autocomplete search box. */
    issuingAuthoritySearch: '#fm_fp_court_details_originator_id-autocomplete',

    /** Enforcement court autocomplete search box. */
    enforcementCourtSearch: '#fm_fp_court_details_imposing_court_id-autocomplete',

    /** Amount imposed input field. */
    amountImposed: '#fm_fp_offence_details_amount_imposed',

    /** Autocomplete option dropdown items. */
    autocompleteOptions: '.autocomplete__option',

    /** Personal details date of birth value display. */
    personalDetailsDobValue: '#personalDetailsDobValue',
  },

  // ──────────────────────────────
  // Summary data selectors
  // ──────────────────────────────

  /** Summary list row selectors using summaryListRowId attributes. */
  summaryData: {
    // Account Details (Section 1)
    businessUnit: '[summaryListRowId="businessUnit"] dd',
    accountType: '[summaryListRowId="accountType"] dd',
    defendantType: '[summaryListRowId="defendantType"] dd',

    // Issuing Authority and Court Details (Section 2)
    issuingAuthority: '[summaryListRowId="issuingAuthority"] dd',
    enforcementCourt: '[summaryListRowId="enforcementCourt"] dd',

    // Personal Details (Section 3 - Individual accounts)
    title: '[summaryListRowId="title"] dd',
    forenames: '[summaryListRowId="forenames"] dd',
    surname: '[summaryListRowId="surname"] dd',
    firstName: '[summaryListRowId="firstName"] dd',
    lastName: '[summaryListRowId="lastName"] dd',
    dateOfBirth: '[summaryListRowId="dateOfBirth"] dd',
    address: '[summaryListRowId="address"] dd',

    // Company Details (Section 3 - Company accounts)
    companyName: '[summaryListRowId="companyName"] dd',

    // Offence Details (Section 4/5)
    noticeNumber: '[summaryListRowId="noticeNumber"] dd',
    offenceType: '[summaryListRowId="offenceType"] dd',
    offenceCode: 'div[summaryListRowId="offenceCode"] dd',
    registrationNumber: '[summaryListRowId="registrationNumber"] dd',
    drivingLicenceNumber: '[summaryListRowId="drivingLicenceNumber"] dd',
    noticeDate: '[summaryListRowId="noticeDate"] dd',
    dateOfOffence: '[summaryListRowId="dateOfOffence"] dd',
    timeOfOffence: '[summaryListRowId="timeOfOffence"] dd',
    placeOfOffence: '[summaryListRowId="placeOfOffence"] dd',
    amountImposed: '[summaryListRowId="amountImposed"] dd',

    // Account Comments and Notes (Section 6)
    accountComment: '[summaryListRowId="accountComment"] dd',
    accountNote: '[summaryListRowId="accountNote"] dd',
  },

  // ──────────────────────────────
  // Section navigation and actions
  // ──────────────────────────────

  /** Section-specific selectors for navigation and interaction. */
  sections: {
    /** Find summary card by section title. */
    bySectionTitle: (sectionName: string) => `h2.govuk-summary-card__title:contains("${sectionName}")`,

    /** Change link within a specific section. */
    changeLink: 'a:contains("Change")',

    /** Account comments and notes section container. */
    accountCommentsSection: 'h2.govuk-summary-card__title:contains("Account comments and notes")',
  },

  // ──────────────────────────────
  // Expected section order
  // ──────────────────────────────

  /** Expected sections for different account types. */
  expectedSections: {
    /** Individual Fixed Penalty account sections in order. */
    individual: [
      'Issuing authority and court details',
      'Personal details',
      'Offence Details',
      'Account comments and notes',
    ],

    /** Company Fixed Penalty account sections in order. */
    company: [
      'Issuing authority and court details',
      'Company details',
      'Offence Details',
      'Account comments and notes',
    ],
  },
};
