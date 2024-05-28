import { IManualAccountCreationPersonalDetailsAliasState } from './manual-account-creation-personal-details-alias-state.interface';

export interface IManualAccountCreationPersonalDetailsState {
  title: string | null;
  firstNames: string | null;
  lastName: string | null;
  addAlias: boolean;
  aliases: IManualAccountCreationPersonalDetailsAliasState;
  dateOfBirth: string | null;
  nationalInsuranceNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
  makeOfCar: string | null;
  registrationNumber: string | null;
}
