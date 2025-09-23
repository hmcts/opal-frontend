import { IOpalFinesAccountDefendantDetailsHeader } from '../interfaces/fines-acc-defendant-details-header.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  version: '1',
  account_number: '177A',
  defendant_party_id: '77',
  parent_guardian_party_id: '77',
  account_type: 'Fine',
  prosecutor_case_reference: '090A',
  fixed_penalty_ticket_number: '888',
  account_status_reference: {
    account_status_code: 'L',
    account_status_display_name: 'Live',
  },
  business_unit_summary: {
    business_unit_id: '78',
    business_unit_name: 'N E Region',
    welsh_speaking: 'N',
  },
  payment_state_summary: {
    imposed_amount: 700.58,
    arrears_amount: 0,
    paid_amount: 200.0,
    account_balance: 500.58,
  },
  party_details: {
    party_id: '77',
    organisation_flag: false,
    organisation_details: {
      organisation_name: 'Sainsco',
      organisation_aliases: null,
    },
    individual_details: {
      title: 'Ms',
      forenames: 'Anna',
      surname: 'Graham',
      date_of_birth: '1980-02-03',
      age: '45',
      national_insurance_number: null,
      individual_aliases: [],
    },
  },
  is_youth: false,
  debtor_type: 'Defendant',
};
