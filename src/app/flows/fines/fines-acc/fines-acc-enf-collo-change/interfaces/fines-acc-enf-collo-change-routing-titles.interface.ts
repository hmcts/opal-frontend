import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccEnfColloChangeRoutingTitles extends IChildRoutingPaths {
  root: string;
  children: {
    change: string;
  };
}
