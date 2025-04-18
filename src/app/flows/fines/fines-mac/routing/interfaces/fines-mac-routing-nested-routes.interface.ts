import { INestedRoutes } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMacRoutingNestedRoutes {
  courtDetails: INestedRoutes | null;
  personalDetails: INestedRoutes | null;
  contactDetails: INestedRoutes | null;
  employerDetails: INestedRoutes | null;
  offenceDetails: INestedRoutes | null;
  addAnotherOffence: INestedRoutes | null;
  companyDetails: INestedRoutes | null;
  parentOrGuardianDetails: INestedRoutes | null;
  accountCommentsNotes: INestedRoutes | null;
}
