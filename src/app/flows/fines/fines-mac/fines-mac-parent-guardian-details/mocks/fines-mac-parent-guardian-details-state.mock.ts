import { IFinesMacParentGuardianDetailsState } from '../interfaces/fines-mac-parent-guardian-details-state.interface';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK: IFinesMacParentGuardianDetailsState = {
  fm_parent_guardian_details_forenames: 'John',
  fm_parent_guardian_details_surname: 'DOE',
  fm_parent_guardian_details_dob: '01/01/2023',
  fm_parent_guardian_details_add_alias: true,
  fm_parent_guardian_details_aliases: [
    {
      fm_parent_guardian_details_alias_forenames_0: 'Testing',
      fm_parent_guardian_details_alias_surname_0: 'TEST',
    },
  ],
  fm_parent_guardian_details_national_insurance_number: 'QQ123456C',
  fm_parent_guardian_details_address_line_1: 'Test address line 1',
  fm_parent_guardian_details_address_line_2: 'Test address line 2',
  fm_parent_guardian_details_address_line_3: 'Test line 3',
  fm_parent_guardian_details_post_code: 'TE10 1ST',
  fm_parent_guardian_details_vehicle_make: 'Ford',
  fm_parent_guardian_details_vehicle_registration_mark: 'AB123CDE',
};
