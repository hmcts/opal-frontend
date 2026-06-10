import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../interfaces/fines-acc-major-creditor-details-header.interface';

export const FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK: IOpalFinesAccountMajorCreditorDetailsHeader = {
  version: null,
  major_creditor: {
    account_number: '87654322',
    creditor_account_id: 99000000000801,
    name: 'Major Creditor Test Ltd',
    account_reference: 'MA123456',
  },
  account_reference: {
    creditor_account_type: 'MA',
    creditor_account_display_name: 'Major Creditor',
  },
  business_unit_details: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  awaiting_payout: 500,
};
