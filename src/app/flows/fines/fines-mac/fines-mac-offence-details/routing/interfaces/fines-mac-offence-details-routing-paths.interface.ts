import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMacOffenceDetailsRoutingPaths extends IChildRoutingPaths {
  children: {
    reviewOffences: string;
    addOffence: string;
    removeImposition: string;
    addMinorCreditor: string;
    removeMinorCreditor: string;
    removeOffence: string;
  };
}
