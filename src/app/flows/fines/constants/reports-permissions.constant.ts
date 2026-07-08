import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const REPORTS_PRIMARY_NAVIGATION_PERMISSIONS = [
  FINES_PERMISSIONS['operational-report-by-enforcement'],
  FINES_PERMISSIONS['operational-report-by-payments'],
] as const;

export const OPERATIONAL_REPORT_ROUTE_PERMISSIONS = [FINES_PERMISSIONS['search-and-view-accounts']] as const;
