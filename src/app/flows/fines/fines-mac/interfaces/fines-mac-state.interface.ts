import { IOpalFinesBusinessUnit } from '@interfaces/fines';
import { IFinesMacAccountCommentsNotesState } from '../fines-mac-account-comments-notes/interfaces';
import { IFinesMacAccountDetailsState } from '../fines-mac-account-details/interfaces';
import { IFinesMacCompanyDetailsState } from '../fines-mac-company-details/interfaces';
import { IFinesMacContactDetailsState } from '../fines-mac-contact-details/interfaces';
import { IFinesMacCourtDetailsState } from '../fines-mac-court-details/interfaces';
import { IFinesMacEmployerDetailsState } from '../fines-mac-employer-details/interfaces';
import { IFinesMacOffenceDetailsState } from '../fines-mac-offence-details/interfaces/fines-mac-offence-details-state.interface';
import { IFinesMacParentGuardianDetailsState } from '../fines-mac-parent-guardian-details/interfaces';
import { IFinesMacPaymentTermsState } from '../fines-mac-payment-terms/interfaces';
import { IFinesMacPersonalDetailsState } from '../fines-mac-personal-details/interfaces';

export interface IFinesMacState {
  employerDetails: IFinesMacEmployerDetailsState;
  accountDetails: IFinesMacAccountDetailsState;
  contactDetails: IFinesMacContactDetailsState;
  parentGuardianDetails: IFinesMacParentGuardianDetailsState;
  personalDetails: IFinesMacPersonalDetailsState;
  companyDetails: IFinesMacCompanyDetailsState;
  courtDetails: IFinesMacCourtDetailsState;
  accountCommentsNotes: IFinesMacAccountCommentsNotesState;
  offenceDetails: IFinesMacOffenceDetailsState;
  paymentTerms: IFinesMacPaymentTermsState;
  businessUnit: IOpalFinesBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
