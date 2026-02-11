import { buildPaymentTermsAmendPayloadUtil } from './fines-acc-payload-build-payment-terms-amend.utils';
import { IFinesAccPaymentTermsAmendState } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';

describe('buildPaymentTermsAmendPayload', () => {
  it('should build payload for pay in full payment type', () => {
    const formData: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'payInFull',
      facc_payment_terms_pay_by_date: '2025-01-15',
      facc_payment_terms_lump_sum_amount: null,
      facc_payment_terms_instalment_amount: null,
      facc_payment_terms_instalment_period: null,
      facc_payment_terms_start_date: null,
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: null,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: 30,
      facc_payment_terms_reason_for_change: 'Payment plan adjustment',
      facc_payment_terms_change_letter: null,
    };

    const result = buildPaymentTermsAmendPayloadUtil(formData);

    expect(result).toEqual({
      payment_terms: {
        days_in_default: 30,
        date_days_in_default_imposed: null,
        reason_for_extension: 'Payment plan adjustment',
        extension: true,
        payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: 'By date' }, // Pay in full is 'B' with no lump sum amount
        effective_date: '2025-01-15',
        instalment_period: null,
        lump_sum_amount: null,
        instalment_amount: null,
        posted_details: {
          posted_by: '',
          posted_date: '',
          posted_by_name: '',
        },
      },
      request_payment_card: null,
      generate_payment_terms_change_letter: null,
    });
  });

  it('should build payload for instalments only payment type', () => {
    const formData: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'instalmentsOnly',
      facc_payment_terms_pay_by_date: null,
      facc_payment_terms_lump_sum_amount: null,
      facc_payment_terms_instalment_amount: 50,
      facc_payment_terms_instalment_period: 'M',
      facc_payment_terms_start_date: '2025-02-01',
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: null,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: null,
      facc_payment_terms_reason_for_change: null,
      facc_payment_terms_change_letter: null,
    };

    const result = buildPaymentTermsAmendPayloadUtil(formData);

    expect(result).toEqual({
      payment_terms: {
        days_in_default: null,
        date_days_in_default_imposed: null,
        reason_for_extension: null,
        extension: true,
        payment_terms_type: { payment_terms_type_code: 'I', payment_terms_type_display_name: 'Instalments' },
        effective_date: '2025-02-01',
        instalment_period: { instalment_period_code: 'M', instalment_period_display_name: 'Monthly' },
        lump_sum_amount: null,
        instalment_amount: 50,
        posted_details: {
          posted_by: '',
          posted_date: '',
          posted_by_name: '',
        },
      },
      request_payment_card: null,
      generate_payment_terms_change_letter: null,
    });
  });

  it('should build payload for lump sum plus instalments payment type', () => {
    const formData: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
      facc_payment_terms_pay_by_date: null,
      facc_payment_terms_lump_sum_amount: 200,
      facc_payment_terms_instalment_amount: 75,
      facc_payment_terms_instalment_period: 'W',
      facc_payment_terms_start_date: '2025-03-01',
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: null,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: 15,
      facc_payment_terms_reason_for_change: 'Change to lump sum plus instalments',
      facc_payment_terms_change_letter: null,
    };

    const result = buildPaymentTermsAmendPayloadUtil(formData);

    expect(result).toEqual({
      payment_terms: {
        days_in_default: 15,
        date_days_in_default_imposed: null,
        reason_for_extension: 'Change to lump sum plus instalments',
        extension: true,
        payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: 'By date' },
        effective_date: '2025-03-01',
        instalment_period: { instalment_period_code: 'W', instalment_period_display_name: 'Weekly' },
        lump_sum_amount: 200,
        instalment_amount: 75,
        posted_details: {
          posted_by: '',
          posted_date: '',
          posted_by_name: '',
        },
      },
      request_payment_card: null,
      generate_payment_terms_change_letter: null,
    });
  });

  it('should handle unknown payment terms type', () => {
    const formData: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'unknown' as never,
      facc_payment_terms_pay_by_date: '2025-01-15',
      facc_payment_terms_lump_sum_amount: null,
      facc_payment_terms_instalment_amount: null,
      facc_payment_terms_instalment_period: null,
      facc_payment_terms_start_date: null,
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: null,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: null,
      facc_payment_terms_reason_for_change: null,
      facc_payment_terms_change_letter: null,
    };

    const result = buildPaymentTermsAmendPayloadUtil(formData);

    expect(result.payment_terms.payment_terms_type).toBeNull();
    expect(result.payment_terms.effective_date).toBeNull();
  });
});
