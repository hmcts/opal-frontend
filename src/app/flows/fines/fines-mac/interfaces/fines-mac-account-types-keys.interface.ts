import { IFinesMacAccountTypes } from './fines-mac-account-types.interface';

export interface IFinesMacAccountTypesKeys {
  fine: keyof IFinesMacAccountTypes;
  fixedPenalty: keyof IFinesMacAccountTypes;
  conditionalCaution: keyof IFinesMacAccountTypes;
}
