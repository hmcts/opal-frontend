import { type IFinesDashboardConfiguration } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_REPORTS_HIGHLIGHT_REPORT_LINKS } from '@app/flows/fines/fines-reports/constants/fines-reports-highlight-report-links.constant';
import { FINES_REPORTS_OPERATIONAL_REPORT_LINKS } from '@app/flows/fines/fines-reports/constants/fines-reports-operational-report-links.constant';

export const REPORTS_DASHBOARD_CONFIG: IFinesDashboardConfiguration = {
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
