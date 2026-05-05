import { IOpalFinesUpdateMinorCreditorAccountPayload } from '../interfaces/opal-fines-update-minor-creditor-account-payload.interface';

export const OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK: IOpalFinesUpdateMinorCreditorAccountPayload = {
  creditor_account_id: '99000000000800',
  party_details: {
    party_id: '99000000000900',
    organisation_flag: true,
    organisation_details: {
      organisation_name: 'Minor Creditor Test Ltd',
      organisation_aliases: null,
    },
    individual_details: null,
  },
  address: {
    address_line_1: '10 Swift Lane',
    address_line_2: null,
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    postcode: 'RG1 1ET',
  },
  payment: {
    account_name: null,
    sort_code: null,
    account_number: null,
    account_reference: 'REF',
    pay_by_bacs: true,
    hold_payment: false,
  },
};
