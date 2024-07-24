import { INestedRoutes } from '@interfaces';

export interface IManualAccountCreationNestedRoutes {
  courtDetails: INestedRoutes | null;
  personalDetails: INestedRoutes | null;
  contactDetails: INestedRoutes | null;
  employerDetails: INestedRoutes | null;
  offenceDetails: INestedRoutes | null;
  companyDetails: INestedRoutes | null;
  parentOrGuardianDetails: INestedRoutes | null;
}
