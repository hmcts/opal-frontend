import { IFinesMacPayloadAccountDefendantDebtorDetailComplete } from './fines-mac-payload-account-defendant-debtor-detail-complete.interface';
import { IFinesMacPayloadAccountDefendantParentGuardianComplete } from './fines-mac-payload-account-defendant-parent-guardian-complete.interface';

export interface IFinesMacPayloadAccountDefendantComplete {
  company_flag: boolean | null;
  title: string | null;
  surname: string | null;
  forenames: string | null;
  organisation_name: string | null;
  dob: string | null;
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
  national_insurance_number: string | null;
  driving_licence_number: string | null;
  pnc_id: string | null;
  nationality_1: string | null;
  nationality_2: string | null;
  ethnicity_self_defined: string | null;
  ethnicity_observed: string | null;
  cro_number: string | null;
  occupation: string | null;
  gender: string | null;
  custody_status: string | null;
  prison_number: string | null;
  interpreter_lang: string | null;
  debtor_detail: IFinesMacPayloadAccountDefendantDebtorDetailComplete | null;
  parent_guardian: IFinesMacPayloadAccountDefendantParentGuardianComplete | null;
}
