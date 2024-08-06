import { IManualAccountCreationPersonalDetailsState } from '@interfaces';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK: IManualAccountCreationPersonalDetailsState = {
  Title: 'Mr',
  Forenames: 'John',
  Surname: 'Doe',
  AddAlias: true,
  Aliases: [
    {
      AliasForenames_0: 'Testing',
      AliasSurname_0: 'Test',
    },
  ],
  DOB: '01/01/1990',
  NationalInsuranceNumber: 'AB123456C',
  AddressLine1: '123 Street',
  AddressLine2: 'City',
  AddressLine3: 'County',
  Postcode: 'AB12 3CD',
  VehicleMake: 'Ford',
  VehicleRegistrationMark: 'AB123CDE',
};
