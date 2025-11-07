/**
 * Locators for the Account Details shell (header, global links/buttons, and sub-navigation).
 * Excludes any fields/content inside the tab forms.
 */
export const AccountNavDetailsLocators = {
  // ——— Root / layout ———
  root: 'app-fines-acc-defendant-details, main[role="main"].govuk-main-wrapper',

  // ——— Page title and caption (caption = account ref; title = account name) ———
  header: 'main h1.govuk-heading-l',
  headerCaption: 'main h1.govuk-heading-l .govuk-caption-l',

  // ——— Header links (top GOV.UK / HMCTS / service / Sign out) ———
  signOutLink: 'nav[aria-label="Account navigation"] a.moj-header__navigation-link',
  orgLink: 'a.moj-header__link.moj-header__link--organisation-name', // HMCTS
  serviceLink: 'a.moj-header__link.moj-header__link--service-name', // Opal

  // ——— Page-level actions (top-right of header) ———
  addAccountNoteButton: 'button#addAccountNote.govuk-button--secondary',
  moreOptionsToggleButton: '.moj-button-menu > button.moj-button-menu__toggle-button.govuk-button--secondary',

  // ——— Sub-navigation (tabs) ———
  subNav: {
    root: 'opal-lib-moj-sub-navigation#account-details-tabs, nav.moj-sub-navigation#account-details-tabs',
    atAGlanceTab: 'li[subnavitemid="at-a-glance-tab"] > a.moj-sub-navigation__link',
    defendantTab: 'li[subnavitemid="defendant-tab"] > a.moj-sub-navigation__link',
    paymentTermsTab: 'li[subnavitemid="payment-terms-tab"] > a.moj-sub-navigation__link',
    enforcementTab: 'li[subnavitemid="enforcement-tab"] > a.moj-sub-navigation__link',
    impositionsTab: 'li[subnavitemid="impositions-tab"] > a.moj-sub-navigation__link',
    historyAndNotesTab: 'li[subnavitemid="history-and-notes-tab"] > a.moj-sub-navigation__link',
    currentTab: 'a.moj-sub-navigation__link[aria-current="page"]',
    allTabLinks: '#account-details-tabs a.moj-sub-navigation__link',
  },

  changeLink: 'main a.govuk-link, main a.govuk-link--no-visited-state',

  edit: {
    form: 'form, .account-details__form',
  },

  // ——— Handy top-level widgets (shell only) ———
  widgets: {
    accountInformation: 'opal-lib-custom-account-information',
    metricBar: 'opal-lib-custom-summary-metric-bar',
  },
} as const;
