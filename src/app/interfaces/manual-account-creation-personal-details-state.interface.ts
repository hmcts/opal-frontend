import { IManualAccountCreationPersonalDetailsAliasState } from './manual-account-creation-personal-details-alias-state.interface';

export interface IManualAccountCreationPersonalDetailsState {
  Title: string | null;
  Forenames: string | null;
  Surname: string | null;
  AddAlias: boolean | null;
  Aliases: IManualAccountCreationPersonalDetailsAliasState[];
  DOB: string | null;
  NationalInsuranceNumber: string | null;
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  Postcode: string | null;
  VehicleMake: string | null;
  VehicleRegistrationMark: string | null;
}
