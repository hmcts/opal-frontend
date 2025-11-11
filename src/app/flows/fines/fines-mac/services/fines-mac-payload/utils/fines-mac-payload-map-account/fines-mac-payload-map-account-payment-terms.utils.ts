import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../../../../fines-mac-payment-terms/constants/fines-mac-payment-terms-options';
import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';
import { IFinesMacPayloadAccountPaymentTermsEnforcementResultResponse } from '../interfaces/fines-mac-payload-account-payment-terms-enforcement-result-response.interface';
import { IFinesMacPayloadAccountPaymentTermsEnforcement } from '../interfaces/fines-mac-payload-account-payment-terms-enforcement.interface';
import { IFinesMacPayloadAccountPaymentTerms } from '../interfaces/fines-mac-payload-account-payment-terms.interface';

/**
 * Safely converts a nullable boolean to boolean or preserves null
 */
const convertNullableBooleanToBoolean = (value: boolean | null): boolean | null => {
  return value === null ? null : Boolean(value);
};

/**
 * Maps a single enforcement response parameter to the appropriate form field.
 */
const mapEnforcementResponseParameter = (
  formData: IFinesMacPaymentTermsState,
  parameterName: string,
  response: string,
): void => {
  const parameterMap: Record<string, keyof IFinesMacPaymentTermsState> = {
    earliestreleasedate: 'fm_payment_terms_earliest_release_date',
    prisonandprisonnumber: 'fm_payment_terms_prison_and_prison_number',
    reason: 'fm_payment_terms_reason_account_is_on_noenf',
  };

  const fieldName = parameterMap[parameterName];
  if (fieldName) {
    // Use bracket notation with type assertion for safe dynamic property assignment
    (formData as Record<keyof IFinesMacPaymentTermsState, unknown>)[fieldName] = response;
  }
};

/**
 * Processes enforcement responses and maps them to form data.
 * Filters out responses with null parameter names or null responses.
 */
const processEnforcementResponses = (
  formData: IFinesMacPaymentTermsState,
  responses: IFinesMacPayloadAccountPaymentTermsEnforcementResultResponse[],
): void => {
  const validResponses = responses.filter(
    (
      response,
    ): response is IFinesMacPayloadAccountPaymentTermsEnforcementResultResponse & {
      parameter_name: string;
      response: string;
    } => response.parameter_name !== null && response.response !== null,
  );

  for (const { parameter_name, response } of validResponses) {
    mapEnforcementResponseParameter(formData, parameter_name, response);
  }
};

/**
 * Processes a single enforcement action and updates the payment terms form data.
 */
const processEnforcementAction = (
  mappedFinesMacState: IFinesMacState,
  enforcement: IFinesMacPayloadAccountPaymentTermsEnforcement,
): void => {
  const { enforcement_result_responses: responses, result_id: resultId } = enforcement;
  const formData = mappedFinesMacState.paymentTerms.formData;

  formData.fm_payment_terms_enforcement_action = resultId;
  formData.fm_payment_terms_hold_enforcement_on_account = resultId === 'NOENF';
  formData.fm_payment_terms_add_enforcement_action = Boolean(responses?.length);

  if (responses?.length) {
    processEnforcementResponses(formData, responses);
  }
};

/**
 * Maps enforcement actions to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param enforcements - An array of enforcement actions or null.
 * @returns The updated fines MAC state with mapped enforcement actions.
 */
const mapEnforcementActions = (
  mappedFinesMacState: IFinesMacState,
  enforcements: IFinesMacPayloadAccountPaymentTermsEnforcement[] | null,
): IFinesMacState => {
  if (!enforcements?.length) {
    return mappedFinesMacState;
  }

  const validEnforcements = enforcements.filter(({ result_id }) => result_id !== 'COLLO');

  for (const enforcement of validEnforcements) {
    processEnforcementAction(mappedFinesMacState, enforcement);
  }

  return mappedFinesMacState;
};

/**
 * Builds the payment terms form data object.
 */
const buildPaymentTermsFormData = (
  currentFormData: IFinesMacPaymentTermsState,
  paymentTerms: IFinesMacPayloadAccountPaymentTerms,
  paymentCardRequest: boolean | null,
  suspendedCommittalDate: string | null,
  collectionOrderMade: boolean | null,
  collectionOrderMadeToday: boolean | null,
): IFinesMacPaymentTermsState => {
  const paymentTermOptions = Object.keys(FINES_MAC_PAYMENT_TERMS_OPTIONS);
  const paymentTermsType = getPaymentTermsType(
    paymentTerms.payment_terms_type_code,
    paymentTerms.lump_sum_amount,
    paymentTerms.instalment_amount,
  );

  const isPayInFull = paymentTermsType === paymentTermOptions[0];

  return {
    ...currentFormData,
    fm_payment_terms_payment_terms: paymentTermsType,
    fm_payment_terms_pay_by_date: isPayInFull ? paymentTerms.effective_date : null,
    fm_payment_terms_start_date: isPayInFull ? null : paymentTerms.effective_date,
    fm_payment_terms_instalment_period: paymentTerms.instalment_period ?? null,
    fm_payment_terms_lump_sum_amount: paymentTerms.lump_sum_amount ?? null,
    fm_payment_terms_instalment_amount: paymentTerms.instalment_amount ?? null,
    fm_payment_terms_has_days_in_default: Boolean(paymentTerms.default_days_in_jail),
    fm_payment_terms_default_days_in_jail: paymentTerms.default_days_in_jail ?? null,
    fm_payment_terms_payment_card_request: convertNullableBooleanToBoolean(paymentCardRequest),
    fm_payment_terms_suspended_committal_date: suspendedCommittalDate ?? null,
    fm_payment_terms_collection_order_made: convertNullableBooleanToBoolean(collectionOrderMade),
    fm_payment_terms_collection_order_made_today: convertNullableBooleanToBoolean(collectionOrderMadeToday),
  };
};

/**
 * Determines the payment terms type based on the provided payment terms type code,
 * lump sum amount, and instalment amount.
 *
 * @param paymentTermsTypeCode - The code representing the type of payment terms.
 * @param lumpSumAmount - The amount for a lump sum payment.
 * @param instalmentAmount - The amount for instalment payments.
 * @returns A string representing the payment terms type, or null if no valid type is determined.
 */
const getPaymentTermsType = (
  paymentTermsTypeCode: string | null,
  lumpSumAmount: number | null,
  instalmentAmount: number | null,
): string | null => {
  const paymentTermOptions = Object.keys(FINES_MAC_PAYMENT_TERMS_OPTIONS);
  if (paymentTermsTypeCode === 'B') {
    return paymentTermOptions[0];
  }
  if (lumpSumAmount) {
    return paymentTermOptions[2];
  }

  if (instalmentAmount) {
    return paymentTermOptions[1];
  }

  return null;
};

/**
 * Maps the account payment terms payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account payment terms data.
 * @returns The updated fines MAC state with the mapped payment terms data.
 */
export const finesMacPayloadMapAccountPaymentTerms = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccount,
): IFinesMacState => {
  const {
    payment_terms: paymentTerms,
    payment_card_request: paymentCardRequest,
    suspended_committal_date: suspendedCommittalDate,
    collection_order_made: collectionOrderMade,
    collection_order_made_today: collectionOrderMadeToday,
  } = payload;

  mappedFinesMacState.paymentTerms.formData = buildPaymentTermsFormData(
    mappedFinesMacState.paymentTerms.formData,
    paymentTerms,
    paymentCardRequest,
    suspendedCommittalDate,
    collectionOrderMade,
    collectionOrderMadeToday,
  );

  return mapEnforcementActions(mappedFinesMacState, paymentTerms.enforcements);
};
