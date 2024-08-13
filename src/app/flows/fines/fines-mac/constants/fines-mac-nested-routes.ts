import { FINES_MAC_NESTED_BUTTONS } from './fines-mac-nested-buttons';
import { IFinesMacNestedRoutes } from '../interfaces';
import { FINES_MAC_ROUTING_PATHS } from './fines-mac-routing-paths';

export const FINES_MAC_NESTED_ROUTES: Record<string, IFinesMacNestedRoutes> = {
  adultOrYouthOnly: {
    courtDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.personalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.contactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.employerDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.paymentDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
    parentOrGuardianDetails: null,
  },
  parentOrGuardianToPay: {
    courtDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.parentGuardianDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.parentOrGuardianDetails,
    },
    parentOrGuardianDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.contactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.employerDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.personalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.paymentDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
  },
  company: {
    courtDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.companyDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.companyDetails,
    },
    companyDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.contactDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.personalDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: null,
    parentOrGuardianDetails: null,
    employerDetails: null,
  },
};
