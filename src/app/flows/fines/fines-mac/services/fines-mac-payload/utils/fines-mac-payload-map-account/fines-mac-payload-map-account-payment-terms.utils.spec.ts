import { finesMacPayloadMapAccountPaymentTerms } from './fines-mac-payload-map-account-payment-terms.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../../../../fines-mac-payment-terms/constants/fines-mac-payment-terms-options';

fdescribe('finesMacPayloadMapAccountPaymentTerms', () => {
  let mappedFinesMacState: IFinesMacState;
  let payload: IFinesMacPayloadAccount;

  beforeEach(() => {
    mappedFinesMacState = {
      paymentTerms: {
        formData: {},
      },
    } as IFinesMacState;

    payload = {
      payment_terms: {
        payment_terms_type_code: null,
        lump_sum_amount: null,
        instalment_amount: null,
        effective_date: null,
        instalment_period: null,
        default_days_in_jail: null,
        enforcements: null,
      },
      payment_card_request: null,
      suspended_committal_date: null,
      collection_order_made: false,
      collection_order_made_today: false,
    } as IFinesMacPayloadAccount;
  });

  it('should map payment terms type correctly', () => {
    payload.payment_terms.payment_terms_type_code = 'B';
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_payment_terms).toBe(
      Object.keys(FINES_MAC_PAYMENT_TERMS_OPTIONS)[0],
    );
  });

  it('should map lump sum amount correctly', () => {
    payload.payment_terms.lump_sum_amount = 1000;
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_lump_sum_amount).toBe(1000);
  });

  it('should map instalment amount correctly', () => {
    payload.payment_terms.instalment_amount = 100;
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_instalment_amount).toBe(100);
  });

  it('should map effective date correctly for pay in full', () => {
    payload.payment_terms.payment_terms_type_code = 'B';
    payload.payment_terms.effective_date = '2023-01-01';
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_pay_by_date).toBe('2023-01-01');
    expect(result.paymentTerms.formData.fm_payment_terms_start_date).toBeNull();
  });

  it('should map effective date correctly for instalment', () => {
    payload.payment_terms.instalment_amount = 100;
    payload.payment_terms.effective_date = '2023-01-01';
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_start_date).toBe('2023-01-01');
    expect(result.paymentTerms.formData.fm_payment_terms_pay_by_date).toBeNull();
  });

  it('should map enforcement actions correctly', () => {
    payload.payment_terms.enforcements = [
      {
        result_id: '123',
        enforcement_result_responses: [
          { parameter_name: 'earliestreleasedate', response: '2023-01-01' },
          { parameter_name: 'prisonandprisonnumber', response: '12345' },
          { parameter_name: 'reason', response: 'Test reason' },
        ],
      },
    ];
    const result = finesMacPayloadMapAccountPaymentTerms(mappedFinesMacState, payload);
    expect(result.paymentTerms.formData.fm_payment_terms_earliest_release_date).toBe('2023-01-01');
    expect(result.paymentTerms.formData.fm_payment_terms_prison_and_prison_number).toBe('12345');
    expect(result.paymentTerms.formData.fm_payment_terms_reason_account_is_on_noenf).toBe('Test reason');
  });
});
