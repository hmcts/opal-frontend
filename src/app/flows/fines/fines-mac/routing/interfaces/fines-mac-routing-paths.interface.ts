import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesMacRoutingPaths extends IChildRoutingPaths {
  children: {
    accountDetails: string;
    createAccount: string;
    employerDetails: string;
    contactDetails: string;
    companyDetails: string;
    parentGuardianDetails: string;
    personalDetails: string;
    offenceDetails: string;
    courtDetails: string;
    accountCommentsNotes: string;
    paymentTerms: string;
    deleteAccountConfirmation: string;
    languagePreferences: string;
    reviewAccount: string;
    searchOffences: string;
    submitConfirmation: string;
  };
}
