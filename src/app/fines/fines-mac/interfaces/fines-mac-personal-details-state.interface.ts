import { IFinesMacPersonalDetailsAlias } from './fines-mac-personal-details-alias.interface';

export interface IFinesMacPersonalDetailsState {
  title: string | null;
  firstNames: string | null;
  lastName: string | null;
  addAlias: boolean | null;
  aliases: IFinesMacPersonalDetailsAlias[];
  dateOfBirth: string | null;
  nationalInsuranceNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
  makeOfCar: string | null;
  registrationNumber: string | null;
}
