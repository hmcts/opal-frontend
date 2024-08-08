import { IFinesBusinessUnit } from '@interfaces/fines';
import {
  IFinesMacAccountCommentsNotesState,
  IFinesMacAccountDetailsState,
  IFinesMacCompanyDetailsState,
  IFinesMacContactDetailsState,
  IFinesMacCourtDetailsState,
  IFinesMacEmployerDetailsState,
  IFinesMacOffenceDetailsState,
  IFinesMacParentGuardianDetailsState,
  IFinesMacPaymentTermsState,
  IFinesMacPersonalDetailsState,
} from '@interfaces/fines/mac';

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
  businessUnit: IFinesBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
