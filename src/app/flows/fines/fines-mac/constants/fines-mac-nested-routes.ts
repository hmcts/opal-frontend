import { FINES_MAC_NESTED_BUTTONS } from './fines-mac-nested-buttons';
import { IFinesMacNestedRoutes } from '../interfaces';
import { FinesMacRoutes } from '../enums';

export const FINES_MAC_NESTED_ROUTES: Record<string, IFinesMacNestedRoutes> = {
  adultOrYouthOnly: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacEmployerDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPaymentDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
    parentOrGuardianDetails: null,
  },
  parentOrGuardianToPay: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacParentOrGuardianDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.parentOrGuardianDetails,
    },
    parentOrGuardianDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacEmployerDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPaymentDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
  },
  company: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacCompanyDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.companyDetails,
    },
    companyDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: null,
    parentOrGuardianDetails: null,
    employerDetails: null,
  },
};
