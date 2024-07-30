import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationNestedRoutes } from '@interfaces';
import { MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS } from './manual-account-creation-nested-buttons';

export const MANUAL_ACCOUNT_CREATION_NESTED_ROUTES: Record<string, IManualAccountCreationNestedRoutes> = {
  adultOrYouthOnly: {
    courtDetails: {
      nextRoute: ManualAccountCreationRoutes.personalDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: ManualAccountCreationRoutes.contactDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: ManualAccountCreationRoutes.employerDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: ManualAccountCreationRoutes.offenceDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: ManualAccountCreationRoutes.paymentDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
    parentOrGuardianDetails: null,
  },
  parentOrGuardianToPay: {
    courtDetails: {
      nextRoute: ManualAccountCreationRoutes.parentOrGuardianDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.parentOrGuardianDetails,
    },
    parentOrGuardianDetails: {
      nextRoute: ManualAccountCreationRoutes.contactDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: ManualAccountCreationRoutes.employerDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.employerDetails,
    },
    employerDetails: {
      nextRoute: ManualAccountCreationRoutes.personalDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: {
      nextRoute: ManualAccountCreationRoutes.offenceDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: ManualAccountCreationRoutes.paymentDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.paymentDetails,
    },
    companyDetails: null,
  },
  company: {
    courtDetails: {
      nextRoute: ManualAccountCreationRoutes.companyDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.companyDetails,
    },
    companyDetails: {
      nextRoute: ManualAccountCreationRoutes.contactDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.contactDetails,
    },
    contactDetails: {
      nextRoute: ManualAccountCreationRoutes.offenceDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.offenceDetails,
    },
    offenceDetails: {
      nextRoute: ManualAccountCreationRoutes.personalDetails,
      buttonText: MANUAL_ACCOUNT_CREATION_NESTED_BUTTONS.personalDetails,
    },
    personalDetails: null,
    parentOrGuardianDetails: null,
    employerDetails: null,
  },
};
