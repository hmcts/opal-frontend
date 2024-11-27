import { buildAccountPaymentTermsPayload } from './fines-mac-payload-account-payment-terms.utils';
import { IFinesMacPaymentTermsState } from '../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPayloadAccountPaymentTerms } from './interfaces/fines-mac-payload-account-payment-terms.interface';

describe('buildAccountPaymentTermsPayload', () => {
  it('should build payment terms payload for payInFull, collection order made, payment card request, default days in jail, PRIS Enforcement', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: 'payInFull',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_has_days_in_default: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_collection_order_date: '2024-10-21',
      fm_payment_terms_pay_by_date: '2024-10-14',
      fm_payment_terms_suspended_committal_date: '2024-10-11',
      fm_payment_terms_default_days_in_jail: 11,
      fm_payment_terms_enforcement_action: 'PRIS',
      fm_payment_terms_earliest_release_date: '2024-10-21',
      fm_payment_terms_prison_and_prison_number: 'Test and test',
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'B',
      effective_date: '2024-10-14',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: 11,
      enforcements: [
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '2024-10-21',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'Test and test',
            },
          ],
        },
      ],
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for payInFull, collection order made, payment card request, default days in jail, PRIS Enforcement with undefined values', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: 'payInFull',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_has_days_in_default: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_collection_order_date: '2024-10-22',
      fm_payment_terms_pay_by_date: '2024-10-15',
      fm_payment_terms_suspended_committal_date: '2024-10-12',
      fm_payment_terms_default_days_in_jail: 12,
      fm_payment_terms_enforcement_action: 'PRIS',
      fm_payment_terms_earliest_release_date: undefined,
      fm_payment_terms_prison_and_prison_number: undefined,
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'B',
      effective_date: '2024-10-15',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: 12,
      enforcements: [
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: null,
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: null,
            },
          ],
        },
      ],
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for instalments, card request, hold enforcement on account', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: 'instalmentsOnly',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_instalment_amount: 100,
      fm_payment_terms_instalment_period: 'W',
      fm_payment_terms_start_date: '2019-10-11',
      fm_payment_terms_enforcement_action: 'NOENF',
      fm_payment_terms_reason_account_is_on_noenf: 'Test',
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '2019-10-11',
      instalment_period: 'W',
      lump_sum_amount: null,
      instalment_amount: 100,
      default_days_in_jail: null,
      enforcements: [
        {
          result_id: 'NOENF',
          enforcement_result_responses: [
            {
              parameter_name: 'reason',
              response: 'Test',
            },
          ],
        },
      ],
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for instalments, card request, hold enforcement on account, NoEnf with undefined', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: 'instalmentsOnly',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_instalment_amount: 100,
      fm_payment_terms_instalment_period: 'W',
      fm_payment_terms_start_date: '2019-10-11',
      fm_payment_terms_enforcement_action: 'NOENF',
      fm_payment_terms_reason_account_is_on_noenf: undefined,
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '2019-10-11',
      instalment_period: 'W',
      lump_sum_amount: null,
      instalment_amount: 100,
      default_days_in_jail: null,
      enforcements: [
        {
          result_id: 'NOENF',
          enforcement_result_responses: [
            {
              parameter_name: 'reason',
              response: null,
            },
          ],
        },
      ],
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for lump sum plus instalments, collection order made, requested payment card, days in default, enforcement action', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: 'lumpSumPlusInstalments',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_has_days_in_default: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_lump_sum_amount: 1000,
      fm_payment_terms_instalment_amount: 100,
      fm_payment_terms_instalment_period: 'W',
      fm_payment_terms_start_date: '2024-10-18',
      fm_payment_terms_collection_order_date: '2024-10-21',
      fm_payment_terms_suspended_committal_date: '2024-10-11',
      fm_payment_terms_default_days_in_jail: 11,
      fm_payment_terms_enforcement_action: 'PRIS',
      fm_payment_terms_earliest_release_date: '2024-10-24',
      fm_payment_terms_prison_and_prison_number: 'Test and test',
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '2024-10-18',
      instalment_period: 'W',
      lump_sum_amount: 1000,
      instalment_amount: 100,
      default_days_in_jail: 11,
      enforcements: [
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '2024-10-24',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'Test and test',
            },
          ],
        },
      ],
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload but the response payload should be null', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: null,
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_has_days_in_default: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: null,
      fm_payment_terms_instalment_period: null,
      fm_payment_terms_start_date: null,
      fm_payment_terms_collection_order_date: null,
      fm_payment_terms_suspended_committal_date: null,
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_enforcement_action: null,
      fm_payment_terms_earliest_release_date: null,
      fm_payment_terms_prison_and_prison_number: null,
    };

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: null,
      effective_date: null,
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: null,
      enforcements: null,
    };

    const result = buildAccountPaymentTermsPayload(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });
});
