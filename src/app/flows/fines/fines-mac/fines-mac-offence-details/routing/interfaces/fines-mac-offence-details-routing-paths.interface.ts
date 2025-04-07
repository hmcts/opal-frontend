import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/interfaces';

export interface IFinesMacOffenceDetailsRoutingPaths extends IChildRoutingPaths {
  children: {
    reviewOffences: string;
    addOffence: string;
    searchOffences: string;
    removeImposition: string;
    addMinorCreditor: string;
    removeMinorCreditor: string;
    removeOffence: string;
  };
}
