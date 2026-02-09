import { IFinesAccPaymentTermsAmendState } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';
import { transformPaymentTermsData } from './fines-acc-payload-transform-payment-terms-data.utils';
import { FINES_ACC_BASE_PAYMENT_TERMS_DATA } from './mocks/fines-acc-base-payment-terms-data.mock';
import { PAYMENT_TERMS_PAY_IN_FULL_MOCK } from './mocks/fines-acc-payment-terms-pay-in-full.mock';
import { PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK } from './mocks/fines-acc-payment-terms-instalments-only.mock';
import { PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK } from './mocks/fines-acc-payment-terms-lump-sum-plus-instalments.mock';
import { PAYMENT_TERMS_BY_DATE_NO_LUMP_SUM_MOCK } from './mocks/fines-acc-payment-terms-by-date-no-lump-sum.mock';
import { PAYMENT_TERMS_WITH_DAYS_IN_DEFAULT_MOCK } from './mocks/fines-acc-payment-terms-with-days-in-default.mock';
import { PAYMENT_TERMS_WITH_ZERO_DAYS_IN_DEFAULT_MOCK } from './mocks/fines-acc-payment-terms-with-zero-days-in-default.mock';
import { PAYMENT_TERMS_WITH_PAYMENT_CARD_MOCK } from './mocks/fines-acc-payment-terms-with-payment-card.mock';
import { PAYMENT_TERMS_NULL_EFFECTIVE_DATE_MOCK } from './mocks/fines-acc-payment-terms-null-effective-date.mock';
import { PAYMENT_TERMS_NULL_INSTALMENT_DATA_MOCK } from './mocks/fines-acc-payment-terms-null-instalment-data.mock';
import { PAYMENT_TERMS_COMPLETE_INSTALMENTS_MOCK } from './mocks/fines-acc-payment-terms-complete-instalments.mock';
import { PAYMENT_TERMS_COMPLETE_LUMP_SUM_PLUS_INSTALMENTS_MOCK } from './mocks/fines-acc-payment-terms-complete-lump-sum-plus-instalments.mock';
import { MOCK_RESULT_DATA } from './mocks/fines-acc-result-data.mock';
import { MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD } from './mocks/fines-acc-result-data-with-prevent-payment-card.mock';

describe('transformPaymentTermsData', () => {
  it('should map type P (paid) to null', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_PAY_IN_FULL_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_terms).toBeNull();
    expect(result.facc_payment_terms_pay_by_date).toBeNull();
    expect(result.facc_payment_terms_instalment_amount).toBeNull();
    expect(result.facc_payment_terms_lump_sum_amount).toBeNull();
  });

  it('should map type I to instalmentsOnly', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_terms).toBe('instalmentsOnly');
    expect(result.facc_payment_terms_pay_by_date).toBeNull();
    expect(result.facc_payment_terms_instalment_amount).toBe(50.0);
    expect(result.facc_payment_terms_instalment_period).toBe('M');
    expect(result.facc_payment_terms_start_date).toBe('2025-01-15');
    expect(result.facc_payment_terms_lump_sum_amount).toBeNull();
  });

  it('should map type B with lump sum to lumpSumPlusInstalments', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_terms).toBe('lumpSumPlusInstalments');
    expect(result.facc_payment_terms_pay_by_date).toBeNull();
    expect(result.facc_payment_terms_instalment_amount).toBe(25.0);
    expect(result.facc_payment_terms_instalment_period).toBe('W');
    expect(result.facc_payment_terms_start_date).toBe('2025-01-15');
    expect(result.facc_payment_terms_lump_sum_amount).toBe(100.0);
  });

  it('should map type B without lump sum to payInFull', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_BY_DATE_NO_LUMP_SUM_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_terms).toBe('payInFull');
    expect(result.facc_payment_terms_pay_by_date).toBe('2025-01-15');
    expect(result.facc_payment_terms_instalment_amount).toBeNull();
    expect(result.facc_payment_terms_lump_sum_amount).toBeNull();
  });

  it('should return null for missing payment_terms_type', () => {
    const mockDataWithoutPaymentType = {
      ...FINES_ACC_BASE_PAYMENT_TERMS_DATA,
      payment_terms: {
        ...FINES_ACC_BASE_PAYMENT_TERMS_DATA.payment_terms,
        payment_terms_type: null as never,
      },
    };

    const result = transformPaymentTermsData(mockDataWithoutPaymentType, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_terms).toBeNull();
  });

  it('should map payment card request when last requested is present', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_WITH_PAYMENT_CARD_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_card_request).toBe(true);
  });

  it('should not map payment card request when last requested is null', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_payment_card_request).toBeNull();
  });

  it('should map days in default when present and greater than 0', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_WITH_DAYS_IN_DEFAULT_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_has_days_in_default).toBe(true);
    expect(result.facc_payment_terms_suspended_committal_date).toBe('2025-01-01');
    expect(result.facc_payment_terms_default_days_in_jail).toBe(5);
  });

  it('should handle days in default when 0', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_WITH_ZERO_DAYS_IN_DEFAULT_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_has_days_in_default).toBe(false);
    expect(result.facc_payment_terms_default_days_in_jail).toBe(0);
  });

  it('should handle null days in default', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_has_days_in_default).toBeNull();
    expect(result.facc_payment_terms_suspended_committal_date).toBeNull();
    expect(result.facc_payment_terms_default_days_in_jail).toBeNull();
  });

  it('should map prevent_payment_card from resultData when present', () => {
    const result = transformPaymentTermsData(
      FINES_ACC_BASE_PAYMENT_TERMS_DATA,
      MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD,
    );

    expect(result.facc_payment_terms_prevent_payment_card).toBe(true);
  });

  it('should map prevent_payment_card as false when resultData has prevent_payment_card false', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_prevent_payment_card).toBe(false);
  });

  it('should set prevent_payment_card as null when resultData is null', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, null);

    expect(result.facc_payment_terms_prevent_payment_card).toBeNull();
  });

  it('should map prevent_payment_card from resultData when present', () => {
    const result = transformPaymentTermsData(
      FINES_ACC_BASE_PAYMENT_TERMS_DATA,
      MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD,
    );

    expect(result.facc_payment_terms_prevent_payment_card).toBe(true);
  });

  it('should map prevent_payment_card as false when resultData has prevent_payment_card false', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_prevent_payment_card).toBe(false);
  });

  it('should set prevent_payment_card as null when resultData is null', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, null);

    expect(result.facc_payment_terms_prevent_payment_card).toBeNull();
  });

  it('should always set amendment fields to null', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_reason_for_change).toBeNull();
    expect(result.facc_payment_terms_change_letter).toBeNull();
  });

  it('should handle null effective date', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_NULL_EFFECTIVE_DATE_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_pay_by_date).toBeNull();
  });

  it('should handle null instalment amounts and periods', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_NULL_INSTALMENT_DATA_MOCK, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_instalment_amount).toBeNull();
    expect(result.facc_payment_terms_instalment_period).toBeNull();
    expect(result.facc_payment_terms_start_date).toBe('2025-01-15');
  });

  it('should handle undefined instalment_period_code', () => {
    const mockDataWithUndefinedPeriodCode = {
      ...PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK,
      payment_terms: {
        ...PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK.payment_terms,
        instalment_period: {
          instalment_period_code: undefined as never,
          instalment_period_display_name: 'Monthly' as never,
        },
      },
    };

    const result = transformPaymentTermsData(mockDataWithUndefinedPeriodCode, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_instalment_period).toBeNull();
  });

  it('should handle null resultData parameter', () => {
    const result = transformPaymentTermsData(PAYMENT_TERMS_PAY_IN_FULL_MOCK, null);

    expect(result.facc_payment_terms_payment_terms).toBeNull();
    expect(result.facc_payment_terms_pay_by_date).toBeNull();
  });

  it('should transform complete instalments only scenario', () => {
    const expectedResult: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'instalmentsOnly',
      facc_payment_terms_pay_by_date: null,
      facc_payment_terms_lump_sum_amount: null,
      facc_payment_terms_instalment_amount: 75.0,
      facc_payment_terms_instalment_period: 'F',
      facc_payment_terms_start_date: '2025-02-01',
      facc_payment_terms_payment_card_request: true,
      facc_payment_terms_prevent_payment_card: false,
      facc_payment_terms_has_days_in_default: true,
      facc_payment_terms_suspended_committal_date: '2024-12-01',
      facc_payment_terms_default_days_in_jail: 10,
      facc_payment_terms_reason_for_change: null,
      facc_payment_terms_change_letter: null,
    };

    const result = transformPaymentTermsData(PAYMENT_TERMS_COMPLETE_INSTALMENTS_MOCK, MOCK_RESULT_DATA);

    expect(result).toEqual(expectedResult);
  });

  it('should transform complete lump sum plus instalments scenario', () => {
    const expectedResult: IFinesAccPaymentTermsAmendState = {
      facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
      facc_payment_terms_pay_by_date: null,
      facc_payment_terms_lump_sum_amount: 200.0,
      facc_payment_terms_instalment_amount: 50.0,
      facc_payment_terms_instalment_period: 'M',
      facc_payment_terms_start_date: '2025-03-01',
      facc_payment_terms_payment_card_request: null,
      facc_payment_terms_prevent_payment_card: false,
      facc_payment_terms_has_days_in_default: null,
      facc_payment_terms_suspended_committal_date: null,
      facc_payment_terms_default_days_in_jail: null,
      facc_payment_terms_reason_for_change: null,
      facc_payment_terms_change_letter: null,
    };

    const result = transformPaymentTermsData(PAYMENT_TERMS_COMPLETE_LUMP_SUM_PLUS_INSTALMENTS_MOCK, MOCK_RESULT_DATA);

    expect(result).toEqual(expectedResult);
  });

  it('should map prevent_payment_card from resultData when present', () => {
    const result = transformPaymentTermsData(
      FINES_ACC_BASE_PAYMENT_TERMS_DATA,
      MOCK_RESULT_DATA_WITH_PREVENT_PAYMENT_CARD,
    );

    expect(result.facc_payment_terms_prevent_payment_card).toBe(true);
  });

  it('should map prevent_payment_card as false when resultData has prevent_payment_card false', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, MOCK_RESULT_DATA);

    expect(result.facc_payment_terms_prevent_payment_card).toBe(false);
  });

  it('should set prevent_payment_card as null when resultData is null', () => {
    const result = transformPaymentTermsData(FINES_ACC_BASE_PAYMENT_TERMS_DATA, null);

    expect(result.facc_payment_terms_prevent_payment_card).toBeNull();
  });
});
