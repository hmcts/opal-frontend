import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { finesMacPayloadBuildAccountPaymentTerms } from './fines-mac-payload-build-account-payment-terms.utils';
import { IFinesMacPayloadAccountPaymentTerms } from '../interfaces/fines-mac-payload-account-payment-terms.interface';
import {
  FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK,
  FINES_MAC_PAYLOAD_PAYMENT_TERMS_INSTALMENTS_MOCK,
  FINES_MAC_PAYLOAD_PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK,
  FINES_MAC_PAYLOAD_BUILD_PAYMENT_TERMS_NULL_MOCK,
} from '../mocks/state/fines-mac-payload-payment-terms-state.mock';

describe('finesMacPayloadBuildAccountPaymentTerms', () => {
  let paymentTermsStateInFull: IFinesMacPaymentTermsState | null;
  let paymentTermsStateInstallments: IFinesMacPaymentTermsState | null;
  let paymentTermsStateLumpSumPlusInstallments: IFinesMacPaymentTermsState | null;
  let paymentTermsStateNull: IFinesMacPaymentTermsState | null;
  beforeEach(() => {
    paymentTermsStateInFull = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    paymentTermsStateInstallments = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_INSTALMENTS_MOCK);
    paymentTermsStateLumpSumPlusInstallments = structuredClone(
      FINES_MAC_PAYLOAD_PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK,
    );
    paymentTermsStateNull = structuredClone(FINES_MAC_PAYLOAD_BUILD_PAYMENT_TERMS_NULL_MOCK);
  });

  afterAll(() => {
    paymentTermsStateInFull = null;
    paymentTermsStateInstallments = null;
    paymentTermsStateLumpSumPlusInstallments = null;
    paymentTermsStateNull = null;
  });

  it('should build payment terms payload for payInFull, collection order made, payment card request, default days in jail, PRIS Enforcement', () => {
    if (!paymentTermsStateInFull) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'B',
      effective_date: '15/10/2024',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: 12,
      enforcements: [
        {
          result_id: 'COLLO',
          enforcement_result_responses: null,
        },
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '12/10/2024',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'test test',
            },
          ],
        },
      ],
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsStateInFull, 'fine');
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for instalments, card request, hold enforcement on account', () => {
    if (!paymentTermsStateInstallments) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '11/10/2019',
      instalment_period: 'W',
      lump_sum_amount: null,
      instalment_amount: 100,
      default_days_in_jail: null,
      enforcements: [
        {
          result_id: 'COLLO',
          enforcement_result_responses: null,
        },
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
    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsStateInstallments, 'fine');
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for lump sum plus instalments, collection order made, requested payment card, days in default, enforcement action', () => {
    if (!paymentTermsStateLumpSumPlusInstallments) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '18/10/2024',
      instalment_period: 'W',
      lump_sum_amount: 1000,
      instalment_amount: 100,
      default_days_in_jail: 11,
      enforcements: [
        {
          result_id: 'COLLO',
          enforcement_result_responses: null,
        },
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '24/10/2024',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'Test and test',
            },
          ],
        },
      ],
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsStateLumpSumPlusInstallments, 'fine');
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload but the response payload should be null', () => {
    if (!paymentTermsStateNull) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: null,
      effective_date: null,
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: null,
      enforcements: null,
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsStateNull, 'fine');
    expect(result).toEqual(expectedPayload);
  });

  it('should return null in enforcement result response if input is undefined', () => {
    // Attempt to access buildEnforcementResultResponse utility function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buildEnforcementResultResponse = (finesMacPayloadBuildAccountPaymentTerms as any).__proto__.constructor
      .__proto__.buildEnforcementResultResponse;
    if (typeof buildEnforcementResultResponse === 'function') {
      const result = buildEnforcementResultResponse('someParam', undefined);
      expect(result).toEqual({
        parameter_name: 'someParam',
        response: null,
      });
    } else {
      // If the function is not accessible, test via an augmented state
      const paymentTermsStateWithUndefinedReason = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_INSTALMENTS_MOCK);
      if (paymentTermsStateWithUndefinedReason) {
        paymentTermsStateWithUndefinedReason.fm_payment_terms_hold_enforcement_on_account = true;
        paymentTermsStateWithUndefinedReason.fm_payment_terms_reason_account_is_on_noenf = null;

        const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsStateWithUndefinedReason, 'fine');
        expect(result.enforcements?.[0]?.result_id).toEqual('COLLO');
        expect(result.enforcements?.[0]?.enforcement_result_responses).toBeNull();
        expect(result.enforcements?.[1]?.result_id).toEqual('NOENF');
        expect(result.enforcements?.[1]?.enforcement_result_responses?.[0]?.response).toBeNull();
      } else {
        fail('Failed to clone or prepare mock state for undefined reason test');
      }
    }
  });

  it('should return COLLO enforcement with null when collection order not made but made today', () => {
    const state: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: null,
      fm_payment_terms_pay_by_date: null,
      fm_payment_terms_start_date: null,
      fm_payment_terms_instalment_period: null,
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: null,
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_made_today: true,
      fm_payment_terms_enforcement_action: null,
      fm_payment_terms_earliest_release_date: null,
      fm_payment_terms_prison_and_prison_number: null,
      fm_payment_terms_reason_account_is_on_noenf: null,
      fm_payment_terms_hold_enforcement_on_account: false,
      fm_payment_terms_add_enforcement_action: null,
      fm_payment_terms_collection_order_date: null,
      fm_payment_terms_has_days_in_default: null,
      fm_payment_terms_payment_card_request: null,
      fm_payment_terms_suspended_committal_date: null,
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(state, 'fine');

    expect(result.enforcements).toEqual([
      {
        result_id: 'COLLO',
        enforcement_result_responses: null,
      },
    ]);
  });

  it('should build PRIS enforcement with null earliest release date and prison number', () => {
    const state: IFinesMacPaymentTermsState = {
      fm_payment_terms_payment_terms: null,
      fm_payment_terms_pay_by_date: null,
      fm_payment_terms_start_date: null,
      fm_payment_terms_instalment_period: null,
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: null,
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_collection_order_made_today: false,
      fm_payment_terms_enforcement_action: 'PRIS',
      fm_payment_terms_earliest_release_date: null,
      fm_payment_terms_prison_and_prison_number: null,
      fm_payment_terms_reason_account_is_on_noenf: null,
      fm_payment_terms_hold_enforcement_on_account: false,
      fm_payment_terms_add_enforcement_action: null,
      fm_payment_terms_collection_order_date: null,
      fm_payment_terms_has_days_in_default: null,
      fm_payment_terms_payment_card_request: null,
      fm_payment_terms_suspended_committal_date: null,
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(state, 'fine');

    expect(result.enforcements).toEqual([
      {
        result_id: 'COLLO',
        enforcement_result_responses: null,
      },
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
    ]);
  });
});
