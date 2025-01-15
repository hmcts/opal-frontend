import { IFinesMacRoutingPaths } from '../interfaces/fines-mac-routing-paths.interface';

export const FINES_MAC_ROUTING_PATHS: IFinesMacRoutingPaths = {
  root: 'manual-account-creation',
  children: {
    accountDetails: 'account-details',
    createAccount: 'create-account',
    employerDetails: 'employer-details',
    contactDetails: 'contact-details',
    companyDetails: 'company-details',
    parentGuardianDetails: 'parent-guardian-details',
    personalDetails: 'personal-details',
    offenceDetails: 'offence-details',
    courtDetails: 'court-details',
    accountCommentsNotes: 'account-comments-notes',
    paymentTerms: 'payment-terms',
    deleteAccountConfirmation: 'delete-account-confirmation',
    languagePreferences: 'language-preferences',
    reviewAccount: 'review-account',
    searchOffences: 'search-offences',
    addOffence: 'add-offence',
    submitConfirmation: 'submit-confirmation',
  },
};
