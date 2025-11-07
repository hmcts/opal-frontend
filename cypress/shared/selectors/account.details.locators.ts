// cypress/shared/selectors/account.details.locators.ts
export const AccountDetailsLocators = {
  // ——— Root / layout ———
  root: 'app-fines-acc-defendant-details, [data-testid="account-details"], main[role="main"].govuk-main-wrapper',

  // Page title and caption (e.g. caption = account ref; title = name)
  header: 'main h1.govuk-heading-l',
  headerCaption: 'main h1.govuk-heading-l .govuk-caption-l',

  // ——— Sub-navigation (MOJ) ———
  tabsRoot: '#account-details-tabs',
  tabs: {
    atAGlance: '#account-details-tabs [subnavitemfragment="at-a-glance"] a.moj-sub-navigation__link',
    defendant: '#account-details-tabs [subnavitemfragment="defendant"] a.moj-sub-navigation__link',
    payment: '#account-details-tabs [subnavitemfragment="payment-terms"] a.moj-sub-navigation__link',
    enforcement: '#account-details-tabs [subnavitemfragment="enforcement"] a.moj-sub-navigation__link',
    impositions: '#account-details-tabs [subnavitemfragment="impositions"] a.moj-sub-navigation__link',
    history: '#account-details-tabs [subnavitemfragment="history-and-notes"] a.moj-sub-navigation__link',
  },

  // ——— “At a glance” / content headings ———
  // Section headers on these tabs are GOV.UK headings; allow S/M/L so this works across tabs
  sectionHeader: 'main h2.govuk-heading-s, main h2.govuk-heading-m, main h2.govuk-heading-l',

  changeLink: 'main a.govuk-link, main a.govuk-link--no-visited-state',

  // Useful page widgets
  summary: {
    accountInformation: 'opal-lib-custom-account-information',
    metricBar: 'opal-lib-custom-summary-metric-bar',
  },

  view: {
    sectionHeader: 'h2.govuk-heading-s, .account-details__section-title',
    changeLink: 'a.govuk-link, button.govuk-link', // text "Change"
  },

  edit: {
    form: 'form, .account-details__form',
    cancelLink: '.account-details__cancel',
    // loose selector to catch buttons/links labeled “Cancel”
    cancelLinkSelectors: 'a.govuk-link, button, [role="button"]',
  },
};
