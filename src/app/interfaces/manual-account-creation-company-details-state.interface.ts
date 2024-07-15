import { IManualAccountCreationCompanyDetailsAliasState } from './manual-account-creation-company-details-alias-state.interface';

export interface IManualAccountCreationCompanyDetailsState {
  companyName: string | null;
  addAlias: boolean | null;
  aliases: IManualAccountCreationCompanyDetailsAliasState[];
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
}
