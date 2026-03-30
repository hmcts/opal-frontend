import { IChildRoutingPaths, IParentRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';
import { IFinesDashboardRoutingPaths } from '../../interfaces/fines-dashboard-routing-paths.interface';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    dashboard: IFinesDashboardRoutingPaths;
    mac: IChildRoutingPaths;
    draft: IChildRoutingPaths;
    acc: IChildRoutingPaths;
    sa: IChildRoutingPaths;
    con: IChildRoutingPaths;
  };
}
