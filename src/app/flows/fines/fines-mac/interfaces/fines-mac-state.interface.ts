import { IOpalFinesBusinessUnit } from '@interfaces/fines';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces';
import { IFinesMacCompanyDetailsForm } from '../fines-mac-company-details/interfaces';
import { IFinesMacContactDetailsForm } from '../fines-mac-contact-details/interfaces';
import { IFinesMacCourtDetailsForm } from '../fines-mac-court-details/interfaces';
import { IFinesMacEmployerDetailsForm } from '../fines-mac-employer-details/interfaces';
import { IFinesMacParentGuardianDetailsForm } from '../fines-mac-parent-guardian-details/interfaces';
import { IFinesMacPaymentTermsForm } from '../fines-mac-payment-terms/interfaces';
import { IFinesMacPersonalDetailsForm } from '../fines-mac-personal-details/interfaces';
import { IFinesMacOffenceDetailsForm } from '../fines-mac-offence-details/interfaces';
import { IFinesMacAccountCommentsNotesForm } from '../fines-mac-account-comments-notes/interfaces';

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
  languagePreferences: IFinesMacLanguagePreferencesState;
  businessUnit: IOpalFinesBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
