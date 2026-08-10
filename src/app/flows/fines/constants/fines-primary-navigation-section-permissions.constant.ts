import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { ACCOUNTS_PERMISSIONS } from './accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from './reports-permissions.constant';
import { SEARCH_PERMISSIONS } from './search-permissions.constant';

export const FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS: Partial<Record<DashboardPageType, readonly number[]>> = {
  search: SEARCH_PERMISSIONS,
  accounts: ACCOUNTS_PERMISSIONS,
  reports: REPORTS_PERMISSIONS,
};
