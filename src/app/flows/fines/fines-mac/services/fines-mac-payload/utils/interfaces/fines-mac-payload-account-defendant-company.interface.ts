import { IFinesMacPayloadAccountDefendantCompanyDebtorDetails } from './fines-mac-payload-account-defendant-company-debtor-details.interface';

export interface IFinesMacPayloadAccountDefendantCompany {
  company_flag: boolean | null;
  organisation_name: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  post_code: string | null;
  telephone_number_home: string | null;
  telephone_number_business: string | null;
  telephone_number_mobile: string | null;
  email_address_1: string | null;
  email_address_2: string | null;
  debtor_detail: IFinesMacPayloadAccountDefendantCompanyDebtorDetails;
}
