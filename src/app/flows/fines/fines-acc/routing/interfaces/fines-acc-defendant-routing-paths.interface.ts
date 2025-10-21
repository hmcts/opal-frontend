import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccDefendantRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    details: string;
    note: string;
    comments: string;
    debtor: string;
  };
}
