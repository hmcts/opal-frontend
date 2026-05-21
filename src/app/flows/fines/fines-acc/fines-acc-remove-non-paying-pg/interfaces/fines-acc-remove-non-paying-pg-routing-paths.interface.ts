import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccRemoveNonPayingPgRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    parentGuardian: string;
  };
}
