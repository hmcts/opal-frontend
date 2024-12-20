import { IFinesMacPayloadAccountAccountInitial } from '../../interfaces/fines-mac-payload-account-initial.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_ACCOUNT_INITIAL_MOCK: IFinesMacPayloadAccountAccountInitial = {
  account_type: 'conditionalCaution',
  defendant_type: 'adultOrYouthOnly',
  originator_name: 'Crown Prosecution Service',
  originator_id: '4821',
  prosecutor_case_reference: 'P2BC305678',
  enforcement_court_id: 'Magistrates Court Database (204)',
  collection_order_made: true,
  collection_order_made_today: null,
  collection_order_date: '22/10/2024',
  suspended_committal_date: '12/10/2024',
  payment_card_request: true,
  account_sentence_date: '01/09/2024',
};
