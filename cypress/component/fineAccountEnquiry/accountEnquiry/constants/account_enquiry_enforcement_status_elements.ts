// Stable selectors / visible text hooks for the Defendant Details page.

export const ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',
  headerLabel: '[opal-lib-custom-account-information-item-label]',
  headerValue: '[opal-lib-custom-account-information-item-value]',

  // Buttons
  addNoteButton: 'button#addAccountNote',

  // Info sections
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  accountInfo: 'opal-lib-custom-account-information',
  parentGuardianTag: '#status',

  // Tabs
  tabName: '[subnavitemid="enforcement-tab"] > .moj-sub-navigation__link',

  // Links
  enforcementStatusLink: '.govuk-link',

  // Table labels
  tableTitle: '.govuk-summary-card__title',
  collectionOrderStatus: '#enforcementOverviewDetailsCollection_order_statusKey',
  daysInDefault: '#enforcementOverviewDetailsDays_in_defaultKey',
  enforcementCourt: '#enforcementOverviewDetailsEnforcement_courtKey',
  enforcementAction: '#enforcementOverviewDetailsEnforcement_actionKey',
  reason: '#enforcementOverviewDetailsReasonKey',
  court: '#enforcementOverviewDetailsCourtKey',
  hearingDate: '#enforcementOverviewDetailsHearing_dateKey',
  dateAdded: '#enforcementOverviewDetailsDate_addedKey',

  // Actions column
  actionsColumnHeader: '.govuk-grid-column-one-third > .govuk-\\!-margin-bottom-2',
};
