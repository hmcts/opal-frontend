/**
 * @file check-and-validate.locators.ts
 * @description
 * Selector map for the **Check and Validate Draft Accounts** page.
 * Defines reusable, scoped locators for table navigation, tabs, and data verification
 * in the failed accounts table.
 *
 * @remarks
 * - Specifically designed for AC1ai validation - verifying defendant name format
 * - Supports multiple table tabs (To Review, Failed, etc.)
 * - Provides column-specific selectors for data verification
 * - Used by check-and-validate.steps.ts and related test flows
 *
 * @example
 * ```ts
 * // Verify defendant in first column
 * cy.get(CheckAndValidateLocators.table.defendantColumn)
 *   .should('contain', 'JOHN, Sara');
 *
 * // Navigate to Failed tab
 * cy.get(CheckAndValidateLocators.tabs.failed).click();
 * ```
 *
 * @see {@link check-and-validate.steps.ts}
 */

export const CheckAndValidateLocators = {
  // ──────────────────────────────
  // Page-level selectors
  // ──────────────────────────────

  /** Elements that exist at the page level. */
  page: {
    /** Main page heading "Review accounts". */
    heading: 'h1.govuk-heading-l',

    /** Navigation link from dashboard to check and validate. */
    navLink: '#finesCavCheckerLink',
  },

  // ──────────────────────────────
  // Tab navigation
  // ──────────────────────────────

  /** Tab selectors for different account states. */
  tabs: {
    /** "To Review" tab for submitted accounts. */
    toReview: 'a[href*="#to-review"]',

    /** "Failed" tab for publishing failed accounts. */
    failed: 'a[href*="#failed"]',

    /** Generic tab selector by text content. */
    byText: (tabName: string) => `a:contains("${tabName}")`,
  },

  // ──────────────────────────────
  // Table structure
  // ──────────────────────────────

  /** Failed accounts table selectors. */
  table: {
    /** Root table element with GOV.UK styling. */
    root: 'table.govuk-table',

    /** Table header row. */
    header: 'table.govuk-table thead',

    /** Table body containing data rows. */
    body: 'table.govuk-table tbody',

    /** All data rows in the table. */
    rows: 'table.govuk-table tbody tr',

    /** Table header columns (with buttons for sorting). */
    headerColumns: 'table.govuk-table thead th button',

    /** All table cells in body. */
    cells: 'table.govuk-table tbody tr td',
  },

  // ──────────────────────────────
  // Column-specific selectors
  // ──────────────────────────────

  /** Column selectors for AC1ai validation and data verification. */
  columns: {
    /** Column 1: Defendant name (AC1ai format: <LAST NAME>, <forenames>). */
    defendant: 'table.govuk-table tbody tr td:nth-child(1)',

    /** Column 2: Date of birth. */
    dateOfBirth: 'table.govuk-table tbody tr td:nth-child(2)',

    /** Column 3: Created date. */
    created: 'table.govuk-table tbody tr td:nth-child(3)',

    /** Column 4: Account type (e.g., "Fixed Penalty"). */
    accountType: 'table.govuk-table tbody tr td:nth-child(4)',

    /** Column 5: Business unit. */
    businessUnit: 'table.govuk-table tbody tr td:nth-child(5)',

    /** Column 6: Submitted by. */
    submittedBy: 'table.govuk-table tbody tr td:nth-child(6)',

    /** Dynamic column selector by index (1-based). */
    byIndex: (columnIndex: number) => `table.govuk-table tbody tr td:nth-child(${columnIndex})`,
  },

  // ──────────────────────────────
  // Header verification
  // ──────────────────────────────

  /** Expected table column headers for validation. */
  expectedHeaders: ['Defendant', 'Date of birth', 'Created', 'Account type', 'Business unit', 'Submitted by'],

  // ──────────────────────────────
  // Row interaction selectors
  // ──────────────────────────────

  /** Selectors for interacting with specific rows. */
  rowActions: {
    /** Find row containing specific defendant name. */
    byDefendantName: (defendantName: string) => `table.govuk-table tbody tr:contains("${defendantName}")`,

    /** Defendant name link in first column (for navigation). */
    defendantLink: 'table.govuk-table tbody tr td:nth-child(1) a',

    /** Generic row by text content. */
    byText: (text: string) => `table.govuk-table tbody tr:contains("${text}")`,
  },

  // ──────────────────────────────
  // Validation helpers
  // ──────────────────────────────

  /** Helper selectors for AC1ai defendant name format validation. */
  validation: {
    /** Selector to verify defendant name format in any row. */
    defendantNameFormat: (lastName: string, forenames: string) =>
      `table.govuk-table tbody tr td:nth-child(1):contains("${lastName.toUpperCase()}, ${forenames}")`,

    /** Column header by name for dynamic column index lookup. */
    columnHeaderByName: (columnName: string) => `table.govuk-table thead th button:contains("${columnName}")`,
  },

  // ──────────────────────────────
  // Failed account details page
  // ──────────────────────────────

  /** Selectors for the failed account details page (when clicking on a failed account). */
  failedAccountDetails: {
    /** Page heading showing defendant/company name in failed account details. */
    pageHeading: 'h1.govuk-heading-l',

    /** Summary card sections container. */
    summaryCards: '.govuk-summary-card',

    /** Summary card titles. */
    summaryCardTitles: '.govuk-summary-card__title',

    /** Expected sections for failed account details in order. */
    expectedSections: [
      'Issuing authority and court details',
      'Personal details',
      'Offence Details',
      'Account comments and notes',
    ],

    /** Summary data selectors using summaryListRowId attributes. */
    summaryData: {
      // Account Details (Section 1)
      businessUnit: '[summaryListRowId="businessUnit"] dd',
      accountType: '[summaryListRowId="accountType"] dd',
      defendantType: '[summaryListRowId="defendantType"] dd',

      // Issuing Authority and Court Details (Section 2)
      issuingAuthority: '[summaryListRowId="issuingAuthority"] dd',
      enforcementCourt: '[summaryListRowId="enforcementCourt"] dd',

      // Personal Details (Section 3)
      firstName: '[summaryListRowId="firstName"] dd',
      lastName: '[summaryListRowId="lastName"] dd',
      dateOfBirth: '[summaryListRowId="dateOfBirth"] dd',
      foreName: '[summaryListRowId="forenames"] dd',
      surname: '[summaryListRowId="surname"] dd',
      dob: '[summaryListRowId="dob"] dd',
      // Offence Details (Section 4)
      noticeNumber: '[summaryListRowId="noticeNumber"] dd',
      offenceType: '[summaryListRowId="offenceType"] dd',
      registrationNumber: '[summaryListRowId="registrationNumber"] dd',
      drivingLicenceNumber: '[summaryListRowId="drivingLicenceNumber"] dd',
      noticeDate: '[summaryListRowId="noticeDate"] dd',
      dateOfOffence: '[summaryListRowId="dateOfOffence"] dd',
      timeOfOffence: '[summaryListRowId="timeOfOffence"] dd',
      placeOfOffence: '[summaryListRowId="placeOfOffence"] dd',
      amountImposed: '[summaryListRowId="amountImposed"] dd',

      // Account Comments and Notes (Section 5)
      accountComment: '[summaryListRowId="accountComment"] dd',
      accountNote: '[summaryListRowId="accountNote"] dd',
    },
  },
};
