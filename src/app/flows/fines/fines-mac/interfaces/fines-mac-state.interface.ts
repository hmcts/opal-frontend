import { IOpalFinesBusinessUnit } from '@interfaces/fines';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { IFinesMacCompanyDetailsForm } from '../fines-mac-company-details/interfaces/fines-mac-company-details-form.interface';
import { IFinesMacContactDetailsForm } from '../fines-mac-contact-details/interfaces/fines-mac-contact-details-form.interface';
import { IFinesMacCourtDetailsForm } from '../fines-mac-court-details/interfaces/fines-mac-court-details-form.interface';
import { IFinesMacEmployerDetailsForm } from '../fines-mac-employer-details/interfaces/fines-mac-employer-details-form.interface';
import { IFinesMacParentGuardianDetailsForm } from '../fines-mac-parent-guardian-details/interfaces';
import { IFinesMacPaymentTermsForm } from '../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-form.interface';
import { IFinesMacPersonalDetailsForm } from '../fines-mac-personal-details/interfaces';
import { IFinesMacOffenceDetailsForm } from '../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacAccountCommentsNotesForm } from '../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-form.interface';
import { IFinesMacLanguagePreferencesForm } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-form.interface';

export interface IFinesMacState {
  employerDetails: IFinesMacEmployerDetailsForm;
  accountDetails: IFinesMacAccountDetailsForm;
  contactDetails: IFinesMacContactDetailsForm;
  parentGuardianDetails: IFinesMacParentGuardianDetailsForm;
  personalDetails: IFinesMacPersonalDetailsForm;
  companyDetails: IFinesMacCompanyDetailsForm;
  courtDetails: IFinesMacCourtDetailsForm;
  accountCommentsNotes: IFinesMacAccountCommentsNotesForm;
  offenceDetails: IFinesMacOffenceDetailsForm;
  paymentTerms: IFinesMacPaymentTermsForm;
  languagePreferences: IFinesMacLanguagePreferencesForm;
  businessUnit: IOpalFinesBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
