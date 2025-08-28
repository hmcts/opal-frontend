import { IOpalFinesAccountDefendantDetailsHeader } from '../interfaces/fines-acc-defendant-account-header.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  version: 1,
  defendant_account_id: 'ABC123DEF456',
  account_number: '123456789',
  has_parent_guardian: false,
  debtor_type: 'Parent/Guardian',
  organisation: false,
  account_status_display_name: 'review',
  account_type: 'Fine Account',
  prosecutor_case_reference: 'DFG48583045',
  fixed_penalty_ticket_number: null,
  business_unit_name: 'Example',
  business_unit_id: '65',
  business_unit_code: '80',
  imposed: 1000,
  arrears: 200,
  paid: 800,
  written_off: 200,
  account_balance: -100,
  is_youth: false,
  // organisaton = false
  title: 'Mr',
  firstnames: 'John, Peter',
  surname: 'Doe',
  // organisation = true
  organisation_name: 'Example Organisation',
};
