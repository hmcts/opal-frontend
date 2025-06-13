import { IFinesMacPersonalDetailsAliasState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';

export interface IFinesMacFixedPenaltyDetailsState {
  fm_personal_details_title: string | null;
  fm_personal_details_forenames: string | null;
  fm_personal_details_surname: string | null;
  fm_personal_details_add_alias: boolean | null;
  fm_personal_details_aliases: IFinesMacPersonalDetailsAliasState[];
  fm_personal_details_dob: string | null;
  fm_personal_details_national_insurance_number: string | null;
  fm_personal_details_address_line_1: string | null;
  fm_personal_details_address_line_2: string | null;
  fm_personal_details_address_line_3: string | null;
  fm_personal_details_post_code: string | null;
  fm_personal_details_vehicle_make: string | null;
  fm_personal_details_vehicle_registration_mark: string | null;
}
