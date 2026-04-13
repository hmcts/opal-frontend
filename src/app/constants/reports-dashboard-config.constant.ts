import { FINES_REPORTS_HIGHLIGHT_REPORT_LINKS } from '@app/flows/fines/fines-reports/constants/fines-reports-highlight-report-links.constant';
import { FINES_REPORTS_OPERATIONAL_REPORT_LINKS } from '@app/flows/fines/fines-reports/constants/fines-reports-operational-report-links.constant';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';

export const REPORTS_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Reports',
  highlights: [...FINES_REPORTS_HIGHLIGHT_REPORT_LINKS],
  groups: [
    {
      id: 'operational-reports',
      title: 'Operational reports',
      links: [...FINES_REPORTS_OPERATIONAL_REPORT_LINKS],
    },
  ],
};
