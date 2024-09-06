import { IFinesMacParentGuardianDetailsAliasState } from './fines-mac-parent-guardian-details-alias-state.interface';

export interface IFinesMacParentGuardianDetailsState {
  forenames: string | null;
  surname: string | null;
  add_alias: boolean | null;
  aliases: IFinesMacParentGuardianDetailsAliasState[];
  dob: string | null;
  national_insurance_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  postcode: string | null;
  vehicle_make: string | null;
  vehicle_registration_mark: string | null;
}
