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
  it('should build payment terms payload for payInFull, collection order made, payment card request, default days in jail, PRIS Enforcement', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK;
    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'B',
      effective_date: '15/10/2024',
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

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for instalments, card request, hold enforcement on account', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = FINES_MAC_PAYLOAD_PAYMENT_TERMS_INSTALMENTS_MOCK;
    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '11/10/2019',
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
    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload for lump sum plus instalments, collection order made, requested payment card, days in default, enforcement action', () => {
    const paymentTermsState: IFinesMacPaymentTermsState =
      FINES_MAC_PAYLOAD_PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK;
    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: 'I',
      effective_date: '18/10/2024',
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

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });

  it('should build payment terms payload but the response payload should be null', () => {
    const paymentTermsState: IFinesMacPaymentTermsState = FINES_MAC_PAYLOAD_BUILD_PAYMENT_TERMS_NULL_MOCK;
    const expectedPayload: IFinesMacPayloadAccountPaymentTerms = {
      payment_terms_type_code: null,
      effective_date: null,
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: null,
      enforcements: null,
    };

    const result = finesMacPayloadBuildAccountPaymentTerms(paymentTermsState);
    expect(result).toEqual(expectedPayload);
  });
});
