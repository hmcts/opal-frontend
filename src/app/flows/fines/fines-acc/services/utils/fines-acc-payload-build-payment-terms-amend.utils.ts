import { IFinesAccPaymentTermsAmendState } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';
import { IOpalFinesAmendPaymentTermsPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-amend-payment-terms.interface';
import { IFinesPaymentTermsOptions } from '../../../interfaces/fines-payment-terms-options.interface';

/**
 * Maps form payment terms type to API payment terms type code
 * Note: 'P' means 'paid', not 'pay in full'
 * Pay in full is represented as 'B' with no lump sum amount
 */
function mapPaymentTermsTypeToCode(paymentTermsType: string | null): string | null {
  const typeMapping: IFinesPaymentTermsOptions = {
    payInFull: 'B', // Pay in full is 'B' (Both) with no lump sum amount
    instalmentsOnly: 'I',
    lumpSumPlusInstalments: 'B', // Lump sum + instalments is also 'B' but with lump sum amount
  };

  return paymentTermsType! in typeMapping ? typeMapping[paymentTermsType as keyof IFinesPaymentTermsOptions] : null;
}

/**
 * Maps effective date based on payment type
 */
function mapEffectiveDate(
  paymentTermsType: string | null,
  payByDate: string | null,
  startDate: string | null,
): string | null {
  if (paymentTermsType === 'payInFull') {
    return payByDate;
  } else if (paymentTermsType === 'instalmentsOnly' || paymentTermsType === 'lumpSumPlusInstalments') {
    return startDate;
  }
  return null;
}

/**
 * Maps instalment period for instalment-based payment types
 */
function mapInstalmentPeriod(formData: IFinesAccPaymentTermsAmendState): string | null {
  const hasInstalments =
    formData.facc_payment_terms_payment_terms === 'instalmentsOnly' ||
    formData.facc_payment_terms_payment_terms === 'lumpSumPlusInstalments';

  return hasInstalments ? formData.facc_payment_terms_instalment_period : null;
}

/**
 * Maps lump sum amount for lump sum payment type
 * Note: Only lumpSumPlusInstalments should have a lump sum amount
 * payInFull (which is 'B' type) should have null lump sum amount
 */
function mapLumpSumAmount(formData: IFinesAccPaymentTermsAmendState): number | null {
  return formData.facc_payment_terms_payment_terms === 'lumpSumPlusInstalments'
    ? formData.facc_payment_terms_lump_sum_amount
    : null;
}

/**
 * Maps instalment amount for instalment-based payment types
 */
function mapInstalmentAmount(formData: IFinesAccPaymentTermsAmendState): number | null {
  const hasInstalments =
    formData.facc_payment_terms_payment_terms === 'instalmentsOnly' ||
    formData.facc_payment_terms_payment_terms === 'lumpSumPlusInstalments';

  return hasInstalments ? formData.facc_payment_terms_instalment_amount : null;
}

/**
 * Maps payment terms form data to API payload format
 *
 * @param formData - The payment terms form data
 * @returns Payload in API format
 */
export function buildPaymentTermsAmendPayloadUtil(
  formData: IFinesAccPaymentTermsAmendState,
): IOpalFinesAmendPaymentTermsPayload {
  // Map payment terms type to API codes
  const paymentTermsTypeCode = mapPaymentTermsTypeToCode(formData.facc_payment_terms_payment_terms);

  // Determine effective date based on payment type
  const effectiveDate = mapEffectiveDate(
    formData.facc_payment_terms_payment_terms,
    formData.facc_payment_terms_pay_by_date,
    formData.facc_payment_terms_start_date,
  );

  const instalmentPeriodCode = mapInstalmentPeriod(formData);

  return {
    payment_terms: {
      days_in_default: formData.facc_payment_terms_default_days_in_jail,
      date_days_in_default_imposed: formData.facc_payment_terms_suspended_committal_date,
      reason_for_extension: formData.facc_payment_terms_reason_for_change,
      extension: true,
      payment_terms_type: paymentTermsTypeCode
        ? {
            payment_terms_type_code: paymentTermsTypeCode,
          }
        : null,
      effective_date: effectiveDate,
      instalment_period: instalmentPeriodCode
        ? {
            instalment_period_code: instalmentPeriodCode,
          }
        : null,
      lump_sum_amount: mapLumpSumAmount(formData),
      instalment_amount: mapInstalmentAmount(formData),
    },
    request_payment_card: formData.facc_payment_terms_payment_card_request,
    generate_payment_terms_change_letter: formData.facc_payment_terms_change_letter,
  };
}
