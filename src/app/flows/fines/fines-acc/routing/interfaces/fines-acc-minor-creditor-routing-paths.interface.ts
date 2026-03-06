import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccMinorCreditorRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    details: string;
    note: string;
    'payment-hold': string;
  };
}
