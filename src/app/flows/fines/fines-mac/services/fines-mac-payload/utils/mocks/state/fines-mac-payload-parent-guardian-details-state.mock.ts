import { IFinesMacParentGuardianDetailsState } from '../../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';

export const FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK: IFinesMacParentGuardianDetailsState = {
  fm_parent_guardian_details_forenames: 'Michael James',
  fm_parent_guardian_details_surname: 'Anderson',
  fm_parent_guardian_details_dob: '12/03/1978',
  fm_parent_guardian_details_add_alias: true,
  fm_parent_guardian_details_aliases: [
    {
      fm_parent_guardian_details_alias_forenames_0: 'Rebecca',
      fm_parent_guardian_details_alias_surname_0: 'Johnson',
    },
  ],
  fm_parent_guardian_details_national_insurance_number: 'ZX 98 76 54 D',
  fm_parent_guardian_details_address_line_1: '456 Oakwood Drive',
  fm_parent_guardian_details_address_line_2: 'Apt 22B',
  fm_parent_guardian_details_address_line_3: 'Lakeside',
  fm_parent_guardian_details_post_code: 'LM34 7QP',
  fm_parent_guardian_details_vehicle_make: 'Volkswagen',
  fm_parent_guardian_details_vehicle_registration_mark: 'CD789FGH',
};
