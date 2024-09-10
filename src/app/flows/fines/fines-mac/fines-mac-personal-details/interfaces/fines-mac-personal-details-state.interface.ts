import { IFinesMacPersonalDetailsAliasState } from '../interfaces/fines-mac-personal-details-alias-state.interface';

export interface IFinesMacPersonalDetailsState {
  title: string | null;
  forenames: string | null;
  surname: string | null;
  add_alias: boolean | null;
  aliases: IFinesMacPersonalDetailsAliasState[];
  dob: string | null;
  national_insurance_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  postcode: string | null;
  vehicle_make: string | null;
  vehicle_registration_mark: string | null;
}
