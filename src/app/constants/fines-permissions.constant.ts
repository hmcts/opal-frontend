export const FINES_PERMISSIONS = {
  'create-and-manage-draft-accounts': 'CREATE_MANAGE_DRAFT_ACCOUNTS',
  'account-enquiry-account-notes': 'ACCOUNT_ENQUIRY_NOTES',
  'account-enquiry': 'ACCOUNT_ENQUIRY',
  'collection-order': 'COLLECTION_ORDER',
  'check-and-validate-draft-accounts': 'CHECK_VALIDATE_DRAFT_ACCOUNTS',
  'search-and-view-accounts': 'SEARCH_AND_VIEW_ACCOUNTS',
  'account-maintenance': 'ACCOUNT_MAINTENANCE',
  'add-account-activity-notes': 'ADD_ACCOUNT_ACTIVITY_NOTES',
  'amend-payment-terms': 'AMEND_PAYMENT_TERMS',
  'enter-enforcement': 'ENTER_ENFORCEMENT',
  'view-creditor-bacs': 'VIEW_CREDITOR_BACS',
  'add-remove-payment-hold': 'ADD_AND_REMOVE_PAYMENT_HOLD',
  consolidate: 'CONSOLIDATE',
  'operational-report-by-enforcement': 'OPERATIONAL_REPORT_BY_ENFORCEMENT',
  'operational-report-by-payments': 'OPERATIONAL_REPORT_BY_PAYMENTS',
  'process-and-allocate-payments': 'PROCESS_AND_ALLOCATE_PAYMENTS',
  'auto-enforcement': 'AUTO_ENFORCEMENT',
  'view-interface-files': 'VIEW_INTERFACE_FILES',
  'create-interface-files': 'CREATE_INTERFACE_FILES',
  'account-maintenance-minor-creditor': 'ACCOUNT_MAINTENANCE_MINOR_CREDITOR',
} as const;

export type FinesPermissionCode = (typeof FINES_PERMISSIONS)[keyof typeof FINES_PERMISSIONS];
