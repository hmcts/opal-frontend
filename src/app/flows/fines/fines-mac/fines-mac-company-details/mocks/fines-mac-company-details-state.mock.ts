import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';

export const FINES_MAC_COMPANY_DETAILS_STATE_MOCK: IFinesMacCompanyDetailsState = {
  fm_company_details_company_name: 'Acme Org Ltd.',
  fm_company_details_add_alias: true,
  fm_company_details_aliases: [{ fm_company_details_alias_company_name_0: 'Boring Co.' }],
  fm_company_details_address_line_1: '123 Street',
  fm_company_details_address_line_2: 'City',
  fm_company_details_address_line_3: 'County',
  fm_company_details_postcode: 'AB12 3CD',
};
