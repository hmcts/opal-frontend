import { IChildRoutingPaths } from '@interfaces/flows/routing';

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
    languagePreferences: string;
  };
}
