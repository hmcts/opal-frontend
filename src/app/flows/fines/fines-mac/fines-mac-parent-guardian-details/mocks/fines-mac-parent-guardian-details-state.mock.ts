import { IFinesMacParentGuardianDetailsState } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK: IFinesMacParentGuardianDetailsState = {
  Forenames: 'Test Forenames',
  Surname: 'Test Surname',
  DOB: '01/01/2023',
  AddAlias: true,
  Aliases: [
    {
      AliasForenames_0: 'Testing',
      AliasSurname_0: 'Test',
    },
  ],
  NationalInsuranceNumber: 'QQ 12 34 56 C',
  AddressLine1: 'Test address line 1',
  AddressLine2: 'Test address line 2',
  AddressLine3: 'Test line 3',
  Postcode: 'TE10 1ST',
  VehicleMake: 'Ford',
  VehicleRegistrationMark: 'AB123CDE',
};
