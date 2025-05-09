import { IFinesMacPersonalDetailsState } from '../interfaces/fines-mac-personal-details-state.interface';

export const FINES_MAC_PERSONAL_DETAILS_STATE_MOCK: IFinesMacPersonalDetailsState = {
  fm_personal_details_title: 'Mr',
  fm_personal_details_forenames: 'John',
  fm_personal_details_surname: 'DOE',
  fm_personal_details_add_alias: true,
  fm_personal_details_aliases: [
    {
      fm_personal_details_alias_forenames_0: 'Testing',
      fm_personal_details_alias_surname_0: 'TEST',
    },
  ],
  fm_personal_details_dob: '01/01/1990',
  fm_personal_details_national_insurance_number: 'AB123456C',
  fm_personal_details_address_line_1: '123 Street',
  fm_personal_details_address_line_2: 'City',
  fm_personal_details_address_line_3: 'County',
  fm_personal_details_post_code: 'AB12 3CD',
  fm_personal_details_vehicle_make: 'Ford',
  fm_personal_details_vehicle_registration_mark: 'AB123CDE',
};
