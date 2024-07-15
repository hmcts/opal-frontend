import { IManualAccountCreationCompanyDetailsAliasState } from './manual-account-creation-company-details-alias-state.interface';

export interface IManualAccountCreationCompanyDetailsState {
  companyName: string | null;
  addCompanyAlias: boolean | null;
  companyAliases: IManualAccountCreationCompanyDetailsAliasState[];
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
}
