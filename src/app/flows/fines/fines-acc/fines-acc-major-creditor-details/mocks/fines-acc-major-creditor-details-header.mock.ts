import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../interfaces/fines-acc-major-creditor-details-header.interface';

export const FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK: IOpalFinesAccountMajorCreditorDetailsHeader = {
  version: null,
  major_creditor: {
    account_number: '00000001T',
    account_reference: {
      account_type: 'MJ',
      display_name: 'Major Creditor',
    },
    creditor_account_id: 10770000000085,
    name: 'Crown prosecution service',
  },
  business_unit_details: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  awaiting_payout: 0,
};
