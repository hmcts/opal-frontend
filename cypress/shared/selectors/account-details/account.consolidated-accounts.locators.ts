export const ConsolidatedAccountsLocators = {
  tabRoot: 'app-fines-acc-defendant-details-consolidated-accounts-tab',
  tabLink: 'li[subnavitemid="consolidated-accounts-tab"] > a.moj-sub-navigation__link',
  activeTabLink: 'a.moj-sub-navigation__link[aria-current="page"]',
  headerCaption: 'opal-lib-govuk-heading-with-caption .govuk-caption-l',
  tableRows: 'app-fines-acc-defendant-details-consolidated-accounts-tab tbody tr.govuk-table__row',
  heading: 'app-fines-acc-defendant-details-consolidated-accounts-tab h2',
  cell: (columnKey: string, rowIndex: number): string => `#consolidated-account-${columnKey}-${rowIndex}`,
  firstChildAccountLink: (rowIndex: number): string => `#consolidated-account-number-${rowIndex} a`,
} as const;
