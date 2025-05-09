import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMacOffenceDetailsSearchOffencesRoutingPaths extends IChildRoutingPaths {
  children: {
    searchOffences: string;
    searchOffencesResults: string;
  };
}
