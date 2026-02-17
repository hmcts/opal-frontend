import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../interfaces/fines-acc-minor-creditor-details-header.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK: IOpalFinesAccountMinorCreditorDetailsHeader = {
  version: null,
  creditor_account_id: 99000000000800,
  account_number: '87654321',
  creditor_account_type: {
    type: 'MN',
    display_name: 'Minor Creditor',
  },
  business_unit_summary: {
    business_unit_id: '77',
    business_unit_name: 'Camberwell Green',
    welsh_speaking: 'N',
  },
  party_details: {
    party_id: '99000000000900',
    organisation_flag: true,
    organisation_details: {
      organisation_name: 'Minor Creditor Test Ltd',
      organisation_aliases: null,
    },
  },
  awarded_amount: 0,
  paid_out_amount: 0,
  awaiting_payout_amount: 0,
  outstanding_amount: 0,
  has_associated_defendant: false,
};
