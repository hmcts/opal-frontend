import { FINES_MAC_NESTED_BUTTONS } from '../../constants/fines-mac-nested-buttons';

import { IFinesMacRoutingNestedRoutes } from '../interfaces/fines-mac-routing-nested-routes.interface';
import { FINES_MAC_ROUTING_PATHS } from './fines-mac-routing-paths.constant';

export const FINES_MAC_ROUTING_NESTED_ROUTES: Record<string, IFinesMacRoutingNestedRoutes> = {
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
      nextRoute: FINES_MAC_ROUTING_PATHS.children.paymentTerms,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentTerms,
    },
    accountCommentsNotes: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.reviewAccount,
      buttonText: FINES_MAC_NESTED_BUTTONS.reviewSubmit,
    },
    addAnotherOffence: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.addAnotherOffence,
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
      nextRoute: FINES_MAC_ROUTING_PATHS.children.paymentTerms,
      buttonText: FINES_MAC_NESTED_BUTTONS.paymentTerms,
    },
    accountCommentsNotes: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.reviewAccount,
      buttonText: FINES_MAC_NESTED_BUTTONS.reviewSubmit,
    },
    addAnotherOffence: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.addAnotherOffence,
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
    accountCommentsNotes: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.reviewAccount,
      buttonText: FINES_MAC_NESTED_BUTTONS.reviewSubmit,
    },
    addAnotherOffence: {
      nextRoute: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
      buttonText: FINES_MAC_NESTED_BUTTONS.addAnotherOffence,
    },
    personalDetails: null,
    parentOrGuardianDetails: null,
    employerDetails: null,
  },
};
