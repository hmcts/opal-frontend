import { IFinesMacDefendantTypes } from './fines-mac-defendant-types.interface';

export interface IFinesMacDefendantTypesKeys {
  adultOrYouthOnly: keyof IFinesMacDefendantTypes;
  parentOrGuardianToPay: keyof IFinesMacDefendantTypes;
  company: keyof IFinesMacDefendantTypes;
}
