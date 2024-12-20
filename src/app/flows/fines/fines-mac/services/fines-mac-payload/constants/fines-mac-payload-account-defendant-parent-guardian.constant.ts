import { IFinesMacPayloadAccountDefendantParentGuardianComplete } from '../utils/interfaces/fines-mac-payload-account-defendant-parent-guardian-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from './fines-mac-payload-account-defendant-debtor-details.constant';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN: IFinesMacPayloadAccountDefendantParentGuardianComplete =
  {
    company_flag: null,
    company_name: null,
    surname: null,
    forenames: null,
    dob: null,
    national_insurance_number: null,
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
    debtor_detail: FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
  };
