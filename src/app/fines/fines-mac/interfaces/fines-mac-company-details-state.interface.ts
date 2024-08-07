import { IFinesMacCompanyDetailsAliasState } from './fines-mac-company-details-alias-state.interface';

export interface IFinesMacCompanyDetailsState {
  CompanyName: string | null;
  AddAlias: boolean | null;
  Aliases: IFinesMacCompanyDetailsAliasState[];
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  Postcode: string | null;
}
