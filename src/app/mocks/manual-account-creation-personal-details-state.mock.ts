import { IManualAccountCreationPersonalDetailsState } from '@interfaces';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK: IManualAccountCreationPersonalDetailsState = {
  title: 'Mr',
  firstNames: 'John',
  lastName: 'Doe',
  addNameAlias: true,
  nameAliases: [
    {
      firstNames_0: 'Testing',
      lastName_0: 'Test',
    },
  ],
  dateOfBirth: '01/01/1990',
  nationalInsuranceNumber: 'AB123456C',
  addressLine1: '123 Street',
  addressLine2: 'City',
  addressLine3: 'County',
  postcode: 'AB12 3CD',
  makeOfCar: 'Ford',
  registrationNumber: 'AB123CDE',
};
