import { IConfiscationPersonalDetailsState } from '../interfaces/confiscation-personal-details-state.interface';

export const CONFISCATION_PERSONAL_DETAILS_STATE_MOCK: IConfiscationPersonalDetailsState = {
  conf_personal_details_title: 'Mr',
  conf_personal_details_forenames: 'John',
  conf_personal_details_surname: 'Doe',
  conf_personal_details_add_alias: true,
  conf_personal_details_aliases: [
    {
      conf_personal_details_alias_forenames_0: 'Testing',
      conf_personal_details_alias_surname_0: 'Test',
    },
  ],
  conf_personal_details_dob: '01/01/1990',
  conf_personal_details_national_insurance_number: 'AB123456C',
  conf_personal_details_address_line_1: '123 Street',
  conf_personal_details_address_line_2: 'City',
  conf_personal_details_address_line_3: 'County',
  conf_personal_details_post_code: 'AB12 3CD',
  conf_personal_details_vehicle_make: 'Ford',
  conf_personal_details_vehicle_registration_mark: 'AB123CDE',
};
