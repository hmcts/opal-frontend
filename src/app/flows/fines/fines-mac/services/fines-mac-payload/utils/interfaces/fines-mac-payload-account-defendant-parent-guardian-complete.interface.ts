import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from './fines-mac-payload-account-defendant-debtor-detail-complete.interface';

export interface IFinesMacPayloadAccountDefendantParentGuardianComplete {
  company_flag: boolean | null;
  company_name: string | null;
  surname: string | null;
  forenames: string | null;
  dob: string | null;
  national_insurance_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  address_line_4: string | null;
  address_line_5: string | null;
  post_code: string | null;
  telephone_number_home: string | null;
  telephone_number_business: string | null;
  telephone_number_mobile: string | null;
  email_address_1: string | null;
  email_address_2: string | null;
  debtor_detail: IFinesMacPayloadAccountDefendantDebtorDetailComplete | null;
}
