/**
 * @file account.enquiry.enforcement.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Enforcement** tab.
 * Covers page structure, summary cards, action links, and enforcement detail rows.
 *
 * @remarks
 * - Use these selectors in Cypress component and e2e tests to avoid local duplication.
 * - This map preserves the legacy selector keys used by the existing enforcement spec.
 */
export const ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',
  headerLabel: '[opal-lib-custom-account-information-item-label]',
  headerValue: '[opal-lib-custom-account-information-item-value]',

  addNoteButton: 'button[id$="addAccountNote"]',

  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  accountInfo: 'opal-lib-custom-account-information',
  parentGuardianTag: '#status',

  tabName: '[subnavitemid="enforcement-tab"] > .moj-sub-navigation__link',

  enforcementStatusLink: '.govuk-link',
  addEnforcementActionLink: '.govuk-link:contains("Add enforcement action")',
  addEnforcementOverrideLink: '.govuk-link:contains("Add enforcement override")',
  detailsLink: '.govuk-details__summary-text',

  tableTitle: '.govuk-summary-card__title',
  collectionOrderStatus: '#enforcementOverviewDetailsCollection_order_statusKey',
  daysInDefault: '#enforcementOverviewDetailsDays_in_defaultKey',
  enforcementCourt: '#enforcementOverviewDetailsEnforcement_courtKey',
  enforcementCourtValue: '#enforcementOverviewDetailsEnforcement_courtValue',
  changeEnforcementCourtLink: '#enforcementOverviewDetailsEnforcement_courtActions .govuk-link',
  enforcementAction: '#lastEnforcementActionDetailsEnforcement_actionKey',
  reason: '#lastEnforcementActionDetailsReasonKey',
  lastEnfEnforcer: '#lastEnforcementActionDetailsEnforcerKey',
  warrantNumber: '#lastEnforcementActionDetailsWarrant_numberKey',
  dateAdded: '#lastEnforcementActionDetailsDate_addedKey',
  enforcementOverride: '#enforcementOverrideDetailsEnforcement_overrideKey',
  enforcementOverrideValue: '#enforcementOverrideDetailsEnforcement_overrideValue',
  enfOverrideEnforcer: '#enforcementOverrideDetailsEnforcerKey',
  localJusticeArea: '#enforcementOverrideDetailsLocal_justice_areaKey',
  localJusticeAreaValue: '#enforcementOverrideDetailsLocal_justice_areaValue',

  successBanner: 'opal-lib-moj-alert[type="success"]',
  successBannerText: 'opal-lib-moj-alert-content-text',

  detailsDaysInDefault: '[id="enforcementActionDetailsDays in defaultKey"]',
  detailsReason: '#enforcementActionDetailsReasonKey',
  collectionOrderChange: '#enforcementOverviewDetailsCollection_order_statusActions > a',
  actionsColumnHeader: '.govuk-grid-column-one-third > .govuk-\\!-margin-bottom-2',
  changeEnforcementOverrideLink: '#enforcementOverrideDetailsEnforcement_overrideActions > .govuk-link',
  removeEnforcementOverrideLink: '#enforcement-override-summary-card-list .govuk-summary-card__action .govuk-link',
} as const;
