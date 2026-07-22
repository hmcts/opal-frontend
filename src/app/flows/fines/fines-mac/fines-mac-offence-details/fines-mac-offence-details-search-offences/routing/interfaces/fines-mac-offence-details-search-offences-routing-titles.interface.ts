import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMacOffenceDetailsSearchOffencesRoutingTitles extends IChildRoutingPaths {
  children: {
    searchOffences: string;
    searchOffencesResults: string;
    noResultsFound: string;
  };
}
