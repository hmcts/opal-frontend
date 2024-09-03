import { INestedRoutes } from '@interfaces';

export interface IFinesMacRoutingNestedRoutes {
  courtDetails: INestedRoutes | null;
  personalDetails: INestedRoutes | null;
  contactDetails: INestedRoutes | null;
  employerDetails: INestedRoutes | null;
  offenceDetails: INestedRoutes | null;
  companyDetails: INestedRoutes | null;
  parentOrGuardianDetails: INestedRoutes | null;
  accountCommentsNotes: INestedRoutes | null;
}
