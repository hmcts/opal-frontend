import { IConfiscationPersonalDetailsAliasState } from './confiscation-personal-details-alias-state.interface';

export interface IConfiscationPersonalDetailsState {
  conf_personal_details_title: string | null;
  conf_personal_details_forenames: string | null;
  conf_personal_details_surname: string | null;
  conf_personal_details_add_alias: boolean | null;
  conf_personal_details_aliases: IConfiscationPersonalDetailsAliasState[];
  conf_personal_details_dob: string | null;
  conf_personal_details_national_insurance_number: string | null;
  conf_personal_details_address_line_1: string | null;
  conf_personal_details_address_line_2: string | null;
  conf_personal_details_address_line_3: string | null;
  conf_personal_details_post_code: string | null;
  conf_personal_details_vehicle_make: string | null;
  conf_personal_details_vehicle_registration_mark: string | null;
}
