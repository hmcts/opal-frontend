import { IChildRoutingPaths, IParentRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';
import { IFinesDashboardRoutingPaths } from '../../interfaces/fines-dashboard-routing-paths.interface';
import { IFinesMciRoutingPaths } from '../../fines-mci/routing/interfaces/fines-mci-routing-paths.interface';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    dashboard: IFinesDashboardRoutingPaths;
    mci: IFinesMciRoutingPaths;
    mac: IChildRoutingPaths;
    draft: IChildRoutingPaths;
    acc: IChildRoutingPaths;
    sa: IChildRoutingPaths;
    con: IChildRoutingPaths;
    reports: IChildRoutingPaths;
    aec: IChildRoutingPaths;
    finance: IChildRoutingPaths;
  };
}
