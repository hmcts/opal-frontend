import { IFinesMacParentGuardianDetailsAliasState } from './fines-mac-parent-guardian-details-alias-state.interface';

export interface IFinesMacParentGuardianDetailsState {
  fm_parent_guardian_details_forenames: string | null;
  fm_parent_guardian_details_surname: string | null;
  fm_parent_guardian_details_add_alias: boolean | null;
  fm_parent_guardian_details_aliases: IFinesMacParentGuardianDetailsAliasState[];
  fm_parent_guardian_details_dob: string | null;
  fm_parent_guardian_details_national_insurance_number: string | null;
  fm_parent_guardian_details_address_line_1: string | null;
  fm_parent_guardian_details_address_line_2: string | null;
  fm_parent_guardian_details_address_line_3: string | null;
  fm_parent_guardian_details_post_code: string | null;
  fm_parent_guardian_details_vehicle_make: string | null;
  fm_parent_guardian_details_vehicle_registration_mark: string | null;
}
