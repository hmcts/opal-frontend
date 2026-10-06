/**
 * Defines every report_parameters key that the report-summary mapper recognises. Keeping the
 * backend field names together makes the generic API parameter object safe to consume without
 * repeating unnamed string literals throughout the criteria mapping code.
 */
export const FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS = {
  reportType: 'reportType',
  reportEnforcementMode: 'reportEnforcementMode',
  enforcementAction: 'enforcementAction',
  enforcementDateFrom: 'enforcementDateFrom',
  enforcementDateTo: 'enforcementDateTo',
  lastActionDateFrom: 'lastActionDateFrom',
  lastActionDateTo: 'lastActionDateTo',
  regfDateFrom: 'regfDateFrom',
  regfDateTo: 'regfDateTo',
  includeAdult: 'includeAdult',
  includeYouth: 'includeYouth',
  includeCompany: 'includeCompany',
  onlyAccountsWithParentGuardian: 'onlyAccountsWithParentGuardian',
  accountStatus: 'accountStatus',
  collectionOrderChoice: 'collectionOrderChoice',
  minBalance: 'minBalance',
  maxBalance: 'maxBalance',
  lowerNameRange: 'lowerNameRange',
  upperNameRange: 'upperNameRange',
  firstPaymentOrPayByInNext7Days: 'firstPaymentOrPayByInNext7Days',
  isPaymentMade: 'isPaymentMade',
  reportMode: 'reportMode',
  sinceLastEnforcementAction: 'sinceLastEnforcementAction',
  sinceDate: 'sinceDate',
} as const;
