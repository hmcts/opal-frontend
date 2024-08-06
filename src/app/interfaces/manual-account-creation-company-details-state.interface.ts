import { IManualAccountCreationCompanyDetailsAliasState } from './manual-account-creation-company-details-alias-state.interface';

export interface IManualAccountCreationCompanyDetailsState {
  CompanyName: string | null;
  AddAlias: boolean | null;
  Aliases: IManualAccountCreationCompanyDetailsAliasState[];
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  Postcode: string | null;
}
