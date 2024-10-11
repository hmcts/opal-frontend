import { IFinesMacDefendantPayload } from '../interfaces/fines-mac-defendant-payload.interface';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from './fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from './fines-mac-defendant-parent-guardian-payload.constant';

export const FINES_MAC_DEFENDANT_PAYLOAD: IFinesMacDefendantPayload = {
  company_flag: null,
  title: null,
  surname: null,
  forenames: null,
  organisation_name: null,
  dob: null,
  address_line_1: null,
  address_line_2: null,
  address_line_3: null,
  address_line_4: null,
  address_line_5: null,
  post_code: null,
  telephone_number_home: null,
  telephone_number_business: null,
  telephone_number_mobile: null,
  email_address_1: null,
  email_address_2: null,
  national_insurance_number: null,
  driving_licence_number: null,
  pnc_id: null,
  nationality_1: null,
  nationality_2: null,
  ethnicity_self_defined: null,
  ethnicity_observed: null,
  cro_number: null,
  occupation: null,
  gender: null,
  custody_status: null,
  prison_number: null,
  interpreter_lang: null,
  debtor_detail: FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
  parent_guardian: FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
};
