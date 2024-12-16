import { IFinesMacCompanyDetailsAliasState } from '../interfaces/fines-mac-company-details-alias-state.interface';

export interface IFinesMacCompanyDetailsState {
  fm_company_details_company_name: string | null;
  fm_company_details_add_alias: boolean | null;
  fm_company_details_aliases: IFinesMacCompanyDetailsAliasState[];
  fm_company_details_address_line_1: string | null;
  fm_company_details_address_line_2: string | null;
  fm_company_details_address_line_3: string | null;
  fm_company_details_postcode: string | null;
}
