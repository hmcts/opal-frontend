import { IFinesMacDefendantDebtorDetailAliasCompletePayload } from './fines-mac-defendant-debtor-detail-alias-complete-payload.interface';

export interface IFinesMacDefendantDebtorDetailCompletePayload {
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
  aliases: IFinesMacDefendantDebtorDetailAliasCompletePayload[] | null;
}
