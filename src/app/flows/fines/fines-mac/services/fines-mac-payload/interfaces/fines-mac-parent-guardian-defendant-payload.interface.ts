import { IFinesMacDefendantPayload } from './fines-mac-defendant-payload.interface';

interface IFinesMacParentGuardianDefendantPayloadDebtorDetailAlias {
  alias_forenames: string | null;
  alias_surname: string | null;
  alias_company_name: string | null;
}

interface IFinesMacParentGuardianDefendantPayloadDebtorDetail {
  vehicle_make: string | null;
  vehicle_registration_mark: string | null;
  document_language: string | null;
  hearing_language: string | null;
  employee_reference: string | null;
  employer_company_name: string | null;
  employer_address_line_1: string | null;
  employer_address_line_2: string | null;
  employer_address_line_3: string | null;
  employer_address_line_4: string | null;
  employer_address_line_5: string | null;
  employer_post_code: string | null;
  employer_telephone_number: string | null;
  employer_email_address: string | null;
  aliases: IFinesMacParentGuardianDefendantPayloadDebtorDetailAlias[] | null;
}

interface IFinesMacParentGuardianDefendantPayloadParentGuardian {
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
  debtor_detail: IFinesMacParentGuardianDefendantPayloadDebtorDetail | null;
}

export interface IFinesMacParentGuardianDefendantPayload extends IFinesMacDefendantPayload {
  company_flag: boolean;
  title: string;
  surname: string;
  forenames: string;
  dob: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  post_code: string;
  national_insurance_number: string;
  debtor_detail: IFinesMacParentGuardianDefendantPayloadDebtorDetail;
  parent_guardian: IFinesMacParentGuardianDefendantPayloadParentGuardian;
}
