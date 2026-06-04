import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../interfaces/fines-acc-major-creditor-details-header.interface';

export const FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK: IOpalFinesAccountMajorCreditorDetailsHeader = {
  version: null,
  creditor: {
    account_id: 99000000000801,
    account_number: '87654322',
    account_type: {
      type: 'MA',
      display_name: 'Major Creditor',
    },
    has_associated_defendant: true,
  },
  business_unit: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  party: {
    party_id: '99000000000901',
    organisation_flag: true,
    organisation_details: {
      organisation_name: 'Major Creditor Test Ltd',
      organisation_aliases: null,
    },
  },
  financials: {
    awarded: 10000,
    paid_out: 2500,
    awaiting_payout: 500,
    outstanding: 7000,
  },
};
