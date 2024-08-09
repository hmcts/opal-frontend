import { FinesMacRoutes } from '@enums/fines/mac';
import { IFinesMacNestedRoutes } from '@interfaces/fines/mac';
import { FINES_MAC__NESTED_BUTTONS } from '@constants/fines/mac';

export const FINES_MAC__NESTED_ROUTES: Record<string, IFinesMacNestedRoutes> = {
  adultOrYouthOnly: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacEmployerDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPaymentDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
    parentOrGuardianDetails: null,
  },
  parentOrGuardianToPay: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacParentOrGuardianDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.parentOrGuardianDetails,
    },
    parentOrGuardianDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacEmployerDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPaymentDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
  },
  company: {
    courtDetails: {
      nextRoute: FinesMacRoutes.finesMacCompanyDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.companyDetails,
    },
    companyDetails: {
      nextRoute: FinesMacRoutes.finesMacContactDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FinesMacRoutes.finesMacOffenceDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FinesMacRoutes.finesMacPersonalDetails,
      buttonText: FINES_MAC__NESTED_BUTTONS.personalDetails,
    },
    personalDetails: null,
    parentOrGuardianDetails: null,
    employerDetails: null,
  },
};
