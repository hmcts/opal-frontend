import { IFinesMacCompanyDetailsAliasState } from './fines-mac-company-details-alias-state.interface';

export interface IFinesMacCompanyDetailsState {
  companyName: string | null;
  addAlias: boolean | null;
  aliases: IFinesMacCompanyDetailsAliasState[];
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
}
