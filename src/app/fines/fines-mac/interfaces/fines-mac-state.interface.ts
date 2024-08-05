import { IBusinessUnit } from '@interfaces';
import { IFinesMacAccountDetailsState } from './fines-mac-account-details-state.interface';
import { IFinesMacCompanyDetailsState } from './fines-mac-company-details-state.interface';
import { IFinesMacContactDetailsState } from './fines-mac-contact-details-state.interface';
import { IFinesMacCourtDetailsState } from './fines-mac-court-details-state.interface';
import { IFinesMacEmployerDetailsState } from './fines-mac-employer-details-state.interface';
import { IFinesMacParentGuardianDetailsState } from './fines-mac-parent-guardian-details-state.interface';
import { IFinesMacPersonalDetailsState } from './fines-mac-personal-details-state.interface';

export interface IFinesMacState {
  employerDetails: IFinesMacEmployerDetailsState;
  accountDetails: IFinesMacAccountDetailsState;
  contactDetails: IFinesMacContactDetailsState;
  parentGuardianDetails: IFinesMacParentGuardianDetailsState;
  personalDetails: IFinesMacPersonalDetailsState;
  companyDetails: IFinesMacCompanyDetailsState;
  courtDetails: IFinesMacCourtDetailsState;
  businessUnit: IBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
