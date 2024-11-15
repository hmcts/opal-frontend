import { IFinesMacPersonalDetailsState } from '../../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';

export const FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK: IFinesMacPersonalDetailsState = {
  fm_personal_details_title: 'Dr',
  fm_personal_details_forenames: 'Alice',
  fm_personal_details_surname: 'Williams',
  fm_personal_details_add_alias: true,
  fm_personal_details_aliases: [
    {
      fm_personal_details_alias_forenames_0: 'Sarah',
      fm_personal_details_alias_surname_0: 'Jones',
    },
  ],
  fm_personal_details_dob: '15/05/1985',
  fm_personal_details_national_insurance_number: 'CD789012E',
  fm_personal_details_address_line_1: '456 Maple Avenue',
  fm_personal_details_address_line_2: 'Springfield',
  fm_personal_details_address_line_3: 'Westshire',
  fm_personal_details_post_code: 'XY45 6ZT',
  fm_personal_details_vehicle_make: 'Toyota',
  fm_personal_details_vehicle_registration_mark: 'GH456JKL',
};
