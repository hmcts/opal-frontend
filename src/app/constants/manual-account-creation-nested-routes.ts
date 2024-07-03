import { ManualAccountCreationRoutes } from '../enums/manual-account-creation-routes';

type RouteMap = { [currentPath: string]: string };
type NextRoutes = { [key: string]: RouteMap };

export const MANUAL_ACCOUNT_CREATION_NESTED_ROUTES: NextRoutes = {
  adultOrYouthOnly: {
    courtDetails: ManualAccountCreationRoutes.personalDetails,
    personalDetails: ManualAccountCreationRoutes.contactDetails,
    contactDetails: ManualAccountCreationRoutes.employerDetails,
    employerDetails: ManualAccountCreationRoutes.offenceDetails,
    offenceDetails: ManualAccountCreationRoutes.paymentDetails,
  },
  parentOrGuardianToPay: {
    courtDetails: ManualAccountCreationRoutes.parentOrGuardianDetails,
    parentOrGuardianDetails: ManualAccountCreationRoutes.employerDetails,
    employerDetails: ManualAccountCreationRoutes.personalDetails,
    personalDetails: ManualAccountCreationRoutes.contactDetails,
    contactDetails: ManualAccountCreationRoutes.offenceDetails,
    offenceDetails: ManualAccountCreationRoutes.paymentDetails,
  },
  company: {
    courtDetails: ManualAccountCreationRoutes.companyDetails,
    companyDetails: ManualAccountCreationRoutes.contactDetails,
    contactDetails: ManualAccountCreationRoutes.offenceDetails,
    offenceDetails: ManualAccountCreationRoutes.paymentDetails,
    employerDetails: ManualAccountCreationRoutes.offenceDetails,
  },
};
