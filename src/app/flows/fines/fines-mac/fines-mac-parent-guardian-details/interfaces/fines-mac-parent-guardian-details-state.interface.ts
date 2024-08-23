import { IFinesMacParentGuardianDetailsAliasState } from './fines-mac-parent-guardian-details-alias-state.interface';

export interface IFinesMacParentGuardianDetailsState {
  Forenames: string | null;
  Surname: string | null;
  AddAlias: boolean | null;
  Aliases: IFinesMacParentGuardianDetailsAliasState[];
  DOB: string | null;
  NationalInsuranceNumber: string | null;
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  Postcode: string | null;
  VehicleMake: string | null;
  VehicleRegistrationMark: string | null;
}
