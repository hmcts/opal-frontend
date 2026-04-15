import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesReportsSummaryListRoutingPaths extends IChildRoutingPaths {
  children: {
    operationalReportsByEnforcement: string;
    operationalReportsByPayments: string;
    yourReports: string;
  };
}
