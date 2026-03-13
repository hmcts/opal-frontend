import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesDashboardRoutingPaths extends IChildRoutingPaths {
  children: {
    search: string;
    accounts: string;
    finance: string;
    reports: string;
    administration: string;
  };
}
