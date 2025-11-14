/**
 * @file account.nav.details.locators.ts
 * @description
 * Selector map for the **Account Details Shell** — including the header,
 * navigation links, sub-navigation tabs, and top-level widgets.
 *
 * Excludes form fields and content within individual tab panels (those belong
 * to tab-specific locator files such as `details.defendant.locators.ts`).
 *
 * @remarks
 * - Used primarily by `AccountDetailsDefendantActions`, `AccountEnquiryFlow`,
 *   and shared shell-level navigation tests.
 * - Centralizes selectors for global actions like “Add account note,”
 *   sub-navigation between tabs, and GOV.UK header links.
 * - Maintains compatibility with both Angular and legacy GOV.UK layouts.
 *
 * @example
 * ```ts
 * // Navigate to the Defendant tab
 * cy.get(AccountNavDetailsLocators.subNav.defendantTab).click();
 *
 * // Verify the page header
 * cy.get(AccountNavDetailsLocators.header).should('contain.text', 'John Smith');
 * ```
 *
 * @see {@link AccountDetailsDefendantActions}
 */

export const AccountNavDetailsLocators = {
  // ──────────────────────────────
  // Root / layout
  // ──────────────────────────────

  /** Root wrapper for the Account Details shell component and main content area. */
  root: 'app-fines-acc-defendant-details, main[role="main"].govuk-main-wrapper',

  // ──────────────────────────────
  // Page title and caption
  // ──────────────────────────────

  /** Main account name heading (e.g., "John Smith" or "Acme Ltd"). */
  header: 'main h1.govuk-heading-l',

  /** Caption beneath the header showing the account reference number. */
  headerCaption: 'main h1.govuk-heading-l .govuk-caption-l',

  // ──────────────────────────────
  // Header navigation links (global GOV.UK/HMCTS)
  // ──────────────────────────────

  /** “Sign out” link in the header navigation bar. */
  signOutLink: 'nav[aria-label="Account navigation"] a.moj-header__navigation-link',

  /** HMCTS organisation link in the header (top-left). */
  orgLink: 'a.moj-header__link.moj-header__link--organisation-name',

  /** Opal service name link in the header. */
  serviceLink: 'a.moj-header__link.moj-header__link--service-name',

  // ──────────────────────────────
  // Page-level actions (header buttons)
  // ──────────────────────────────

  /** Button for adding a new account note (secondary GOV.UK style). */
  addAccountNoteButton: 'button#addAccountNote.govuk-button--secondary',

  /** Toggle button for the “More options” menu in the header. */
  moreOptionsToggleButton: '.moj-button-menu > button.moj-button-menu__toggle-button.govuk-button--secondary',

  // ──────────────────────────────
  // Sub-navigation (tabs)
  // ──────────────────────────────

  /** Navigation structure for switching between tabbed account sections. */
  subNav: {
    /** Root sub-navigation container (Angular and plain GOV.UK variants supported). */
    root: 'opal-lib-moj-sub-navigation#account-details-tabs, nav.moj-sub-navigation#account-details-tabs',

    /** Tab link for “At a glance.” */
    atAGlanceTab: 'li[subnavitemid="at-a-glance-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “Defendant.” */
    defendantTab: 'li[subnavitemid="defendant-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “Parent or guardian.” */
    parentOrGuardianTab: 'li[subnavitemid="parent-or-guardian-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “Payment terms.” */
    paymentTermsTab: 'li[subnavitemid="payment-terms-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “Enforcement.” */
    enforcementTab: 'li[subnavitemid="enforcement-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “Impositions.” */
    impositionsTab: 'li[subnavitemid="impositions-tab"] > a.moj-sub-navigation__link',

    /** Tab link for “History and notes.” */
    historyAndNotesTab: 'li[subnavitemid="history-and-notes-tab"] > a.moj-sub-navigation__link',

    /** Currently active tab link (has `aria-current="page"`). */
    currentTab: 'a.moj-sub-navigation__link[aria-current="page"]',

    /** All available tab links (for iteration or verification). */
    allTabLinks: '#account-details-tabs a.moj-sub-navigation__link',
  },

  // ──────────────────────────────
  // Global change links
  // ──────────────────────────────

  /** Any “Change” links present on the details shell (non-tab content). */
  changeLink: 'main a.govuk-link, main a.govuk-link--no-visited-state',

  // ──────────────────────────────
  // Edit form (generic)
  // ──────────────────────────────

  edit: {
    /** Root form selector for edit mode (covers multiple layout variants). */
    form: 'form, .account-details__form',
  },

  actions: {
    /** Link or button to open the Comments (Add comments) page from the summary. */
    addCommentsLink: 'a.govuk-link[href*="comments"], a.govuk-link:contains("Add comments")',
  },

  // ──────────────────────────────
  // Shell-level widgets
  // ──────────────────────────────

  widgets: {
    /** Embedded account information summary component. */
    accountInformation: 'opal-lib-custom-account-information',

    /** Metric summary bar component displayed at the top of the page. */
    metricBar: 'opal-lib-custom-summary-metric-bar',
  },
} as const;
