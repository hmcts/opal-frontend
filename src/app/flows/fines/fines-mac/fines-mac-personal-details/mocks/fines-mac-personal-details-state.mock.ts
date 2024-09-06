import { IFinesMacPersonalDetailsState } from '../interfaces/fines-mac-personal-details-state.interface';

export const FINES_MAC_PERSONAL_DETAILS_STATE_MOCK: IFinesMacPersonalDetailsState = {
  title: 'Mr',
  forenames: 'John',
  surname: 'Doe',
  add_alias: true,
  aliases: [
    {
      alias_forenames_0: 'Testing',
      alias_surname_0: 'Test',
    },
  ],
  dob: '01/01/1990',
  national_insurance_number: 'AB123456C',
  address_line_1: '123 Street',
  address_line_2: 'City',
  address_line_3: 'County',
  postcode: 'AB12 3CD',
  vehicle_make: 'Ford',
  vehicle_registration_mark: 'AB123CDE',
};
