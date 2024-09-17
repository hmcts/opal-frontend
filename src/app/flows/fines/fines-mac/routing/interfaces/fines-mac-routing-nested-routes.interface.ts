import { INestedRoutes } from '@routing/interfaces/nested-routes.interface';

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
