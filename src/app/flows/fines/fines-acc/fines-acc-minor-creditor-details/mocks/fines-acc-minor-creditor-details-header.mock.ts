import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../interfaces/fines-acc-minor-creditor-details-header.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK: IOpalFinesAccountMinorCreditorDetailsHeader = {
  version: null,
  creditor: {
    account_id: 99000000000800,
    account_number: '87654321',
    account_type: {
      type: 'MN',
      display_name: 'Minor Creditor',
    },
  },
  business_unit: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  party: {
    party_id: '99000000000900',
    organisation_flag: true,
    organisation_details: {
      organisation_name: 'Minor Creditor Test Ltd',
      organisation_aliases: null,
    },
  },
  financials: {
    awarded: 0,
    paid_out: 0,
    awaiting_payout: 0,
    outstanding: 0,
  },
};
