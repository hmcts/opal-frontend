import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { DASHBOARD_CONFIG_DEFAULT_DASHBOARD } from './dashboard-config-default-dashboard.constant';
import { DashboardPageType } from '../types/dashboard.type';
import { DASHBOARD_TYPES } from './dashboard-types.constant';
import { FINANCE_DASHBOARD_CONFIG } from '@app/constants/finance-dashboard-config.constant';
import { FINES_DASHBOARD_CONFIG } from '@app/flows/fines/constants/fines-dashboard-config.constant';
import { REPORTS_DASHBOARD_CONFIG } from '@app/constants/reports-dashboard-config.constant';
import { ADMINISTRATION_DASHBOARD_CONFIG } from '@app/constants/administration-dashboard-config.constant';

export const DASHBOARD_PAGE_CONFIGURATION_MAP: Record<DashboardPageType, IDashboardPageConfiguration> = {
  search: DASHBOARD_CONFIG_DEFAULT_DASHBOARD,
  accounts: FINES_DASHBOARD_CONFIG,
  finance: FINANCE_DASHBOARD_CONFIG,
  reports: REPORTS_DASHBOARD_CONFIG,
  administration: ADMINISTRATION_DASHBOARD_CONFIG,
};

export const isDashboardPageType = (dashboardType: string): dashboardType is DashboardPageType =>
  DASHBOARD_TYPES.includes(dashboardType as DashboardPageType);
