import { IFinesMacPersonalDetailsAliasState } from '../interfaces/fines-mac-personal-details-alias-state.interface';

export interface IFinesMacPersonalDetailsState {
  Title: string | null;
  Forenames: string | null;
  Surname: string | null;
  AddAlias: boolean | null;
  Aliases: IFinesMacPersonalDetailsAliasState[];
  DOB: string | null;
  NationalInsuranceNumber: string | null;
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  Postcode: string | null;
  VehicleMake: string | null;
  VehicleRegistrationMark: string | null;
}
