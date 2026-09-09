import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesApiRoutingPaths extends IChildRoutingPaths {
  children: {
    selectBusinessUnits: string;
    processAllocate: string;
  };
}
