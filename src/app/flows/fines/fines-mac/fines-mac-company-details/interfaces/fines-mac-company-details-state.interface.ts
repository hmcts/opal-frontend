import { IFinesMacCompanyDetailsAliasState } from '../interfaces/fines-mac-company-details-alias-state.interface';

export interface IFinesMacCompanyDetailsState {
  company_name: string | null;
  add_alias: boolean | null;
  aliases: IFinesMacCompanyDetailsAliasState[];
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  postcode: string | null;
}
