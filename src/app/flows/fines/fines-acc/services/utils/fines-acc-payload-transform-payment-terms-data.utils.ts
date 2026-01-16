import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccPaymentTermsAmendState } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';

/**
 * Determines the payment terms type based on API payment terms type code
 *
 * @param paymentTermsTypeCode - The payment terms type code from API
 * @param lumpSumAmount - The lump sum amount to determine between payInFull and lumpSumPlusInstalments for 'B' type
 * @returns The mapped payment terms type for the form
 */
const determinePaymentTermsType = (
  paymentTermsTypeCode: string | undefined,
  lumpSumAmount: number | null,
): string | null => {
  if (!paymentTermsTypeCode) {
    return null;
  }

  const typeMapping: Record<string, string> = {
    I: 'instalmentsOnly',
    B: (lumpSumAmount || 0) > 0 ? 'lumpSumPlusInstalments' : 'payInFull',
  };

  return typeMapping[paymentTermsTypeCode] || null;
};

/**
 * Maps pay in full specific fields based on payment type
 *
 * @param paymentTermsType - The determined payment terms type
 * @param effectiveDate - The effective date from API
 * @returns Pay by date field value
 */
const mapPayInFullFields = (paymentTermsType: string | null, effectiveDate: string | null): string | null => {
  return paymentTermsType === 'payInFull' ? effectiveDate || null : null;
};

/**
 * Maps instalment specific fields based on payment type
 *
 * @param paymentTermsType - The determined payment terms type
 * @param instalmentAmount - The instalment amount from API
 * @param instalmentPeriodCode - The instalment period code from API
 * @param effectiveDate - The effective date from API
 * @returns Object with instalment amount, period, and start date
 */
const mapInstalmentFields = (
  paymentTermsType: string | null,
  instalmentAmount: number | null,
  instalmentPeriodCode: string | undefined,
  effectiveDate: string | null,
) => {
  const isInstalments = paymentTermsType === 'instalmentsOnly' || paymentTermsType === 'lumpSumPlusInstalments';

  return {
    facc_payment_terms_instalment_amount: isInstalments ? instalmentAmount || null : null,
    facc_payment_terms_instalment_period: isInstalments ? instalmentPeriodCode || null : null,
    facc_payment_terms_start_date: isInstalments ? effectiveDate || null : null,
  };
};

/**
 * Maps lump sum specific fields based on payment type
 *
 * @param paymentTermsType - The determined payment terms type
 * @param lumpSumAmount - The lump sum amount from API
 * @returns Lump sum amount field value
 */
const mapLumpSumFields = (paymentTermsType: string | null, lumpSumAmount: number | null): number | null => {
  return paymentTermsType === 'lumpSumPlusInstalments' ? lumpSumAmount || null : null;
};

/**
 * Maps common fields that apply to all payment types
 *
 * @param paymentTermsData - The payment terms data from API
 * @returns Object with common field mappings
 */
const mapCommonFields = (paymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest) => {
  const { payment_terms } = paymentTermsData;

  return {
    facc_payment_terms_payment_card_request: paymentTermsData.payment_card_last_requested ? true : null,
    facc_payment_terms_has_days_in_default:
      payment_terms.days_in_default !== null ? payment_terms.days_in_default > 0 : null,
    facc_payment_terms_suspended_committal_date: payment_terms.date_days_in_default_imposed || null,
    facc_payment_terms_default_days_in_jail: payment_terms.days_in_default,
  };
};

/**
 * Maps result data fields from enforcement action result
 *
 * @param resultData - The enforcement action result data from the API (optional)
 * @returns Object with result data field mappings
 */
const mapResultDataFields = (resultData: IOpalFinesResultRefData | null) => ({
  facc_payment_terms_prevent_payment_card: resultData?.prevent_payment_card ?? null,
});

/**
 * Maps amendment specific fields that don't exist in API
 *
 * @returns Object with amendment field mappings set to null
 */
const mapAmendmentFields = () => ({
  facc_payment_terms_reason_for_change: null,
  facc_payment_terms_change_letter: null,
});

/**
 * Transforms payment terms data from API response format to form data format.
 * Combines payment terms latest data with enforcement action result data.
 *
 * @param paymentTermsData - The payment terms latest data from the API
 * @param resultData - The enforcement action result data from the API (optional)
 * @returns Transformed data in the form structure format
 */
export function transformPaymentTermsData(
  paymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest,
  resultData: IOpalFinesResultRefData | null,
): IFinesAccPaymentTermsAmendState {
  const { payment_terms } = paymentTermsData;

  // Determine payment terms type based on API data
  const paymentTermsType = determinePaymentTermsType(
    payment_terms.payment_terms_type?.payment_terms_type_code,
    payment_terms.lump_sum_amount,
  );

  // Map fields based on payment type
  const instalmentFields = mapInstalmentFields(
    paymentTermsType,
    payment_terms.instalment_amount,
    payment_terms.instalment_period?.instalment_period_code,
    payment_terms.effective_date,
  );

  const transformedData: IFinesAccPaymentTermsAmendState = {
    facc_payment_terms_payment_terms: paymentTermsType,
    facc_payment_terms_pay_by_date: mapPayInFullFields(paymentTermsType, payment_terms.effective_date),
    ...instalmentFields,
    facc_payment_terms_lump_sum_amount: mapLumpSumFields(paymentTermsType, payment_terms.lump_sum_amount),
    ...mapCommonFields(paymentTermsData),
    ...mapResultDataFields(resultData),
    ...mapAmendmentFields(),
  };

  return transformedData;
}
