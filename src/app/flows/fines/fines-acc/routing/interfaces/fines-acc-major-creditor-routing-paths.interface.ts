import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccMajorCreditorRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    details: string;
  };
}
