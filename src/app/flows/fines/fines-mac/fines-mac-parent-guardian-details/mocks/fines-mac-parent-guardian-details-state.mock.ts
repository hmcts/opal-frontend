import { IFinesMacParentGuardianDetailsState } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK: IFinesMacParentGuardianDetailsState = {
  forenames: 'Test Forenames',
  surname: 'Test Surname',
  dob: '01/01/2023',
  add_alias: true,
  aliases: [
    {
      alias_forenames_0: 'Testing',
      alias_surname_0: 'Test',
    },
  ],
  national_insurance_number: 'QQ 12 34 56 C',
  address_line_1: 'Test address line 1',
  address_line_2: 'Test address line 2',
  address_line_3: 'Test line 3',
  postcode: 'TE10 1ST',
  vehicle_make: 'Ford',
  vehicle_registration_mark: 'AB123CDE',
};
