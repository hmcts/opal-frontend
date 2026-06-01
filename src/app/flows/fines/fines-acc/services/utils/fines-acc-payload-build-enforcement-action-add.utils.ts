import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesAddEnforcementActionPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-enforcement-action-payload.interface';
import { IOpalFinesAmendPaymentTerms } from '@services/fines/opal-fines-service/interfaces/opal-fines-amend-payment-terms.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccPaymentTermsAmendState } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';
import { buildPaymentTermsAmendPayloadUtil } from './fines-acc-payload-build-payment-terms-amend.utils';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-control-names.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_RESULT_IDS } from '../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-payment-terms-result-ids.constant';
import { FINES_ACC_ENF_ACTION_ADD_RESULT_PARAMETER_NAME_MAP } from '../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-result-parameter-name-map.constant';
import { IFinesAccEnfActionAddFormState } from '../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-state.interface';
import { IFinesAccEnfActionAddFormField } from '../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-field.interface';
import { TFinesAccEnfActionAddFieldType } from '../../fines-acc-enf-action-add/types/fines-acc-enf-action-add-field-type.type';

type FormValue = string | boolean | null | undefined;

const CONTROL_NAMES = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;
const FIELD_TYPES = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES;
const FORM_DATE_FORMAT = 'dd/MM/yyyy';
const API_DATE_FORMAT = 'yyyy-MM-dd';
const dateService = new DateService();

/**
 * Builds the API payload for adding the selected enforcement action to an account.
 */
export function buildEnforcementActionAddPayload(
  result: IOpalFinesResultRefData,
  fields: IFinesAccEnfActionAddFormField[],
  formState: IFinesAccEnfActionAddFormState,
): IOpalFinesAddEnforcementActionPayload {
  const enforcementResultResponses = fields.flatMap((field) => buildFieldResponses(field, formState));
  const paymentTerms = canAddPaymentTerms(result) ? buildPaymentTerms(formState) : undefined;

  return {
    result_id: result.result_id,
    enforcement_result_responses: enforcementResultResponses,
    ...(paymentTerms ? { payment_terms: paymentTerms } : {}),
  };
}

/**
 * Determines whether the selected result can include payment terms in the payload.
 */
function canAddPaymentTerms(result: IOpalFinesResultRefData): boolean {
  return !!result.allow_payment_terms || FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_RESULT_IDS.includes(result.result_id);
}

/**
 * Builds result response entries from dynamic form fields and Welsh companion fields.
 */
function buildFieldResponses(
  field: IFinesAccEnfActionAddFormField,
  formState: IFinesAccEnfActionAddFormState,
): { parameter_name: string; response: string }[] {
  const response =
    field.type === FIELD_TYPES.menuCheckbox
      ? getCheckboxResponseValue(field, formState)
      : getResponseValue(formState[field.controlName], field.type);
  const responses = response
    ? [
        {
          parameter_name: toSnakeCaseParameterName(field.parameterName),
          response,
        },
      ]
    : [];

  if (field.welshControlName) {
    const welshResponse = getResponseValue(formState[field.welshControlName], field.type);
    if (welshResponse) {
      const parameterName = toSnakeCaseParameterName(field.parameterName);
      responses.push({
        parameter_name: `${parameterName}_cy`,
        response: welshResponse,
      });
    }
  }

  return responses;
}

/**
 * Normalises API result parameter names to the snake_case names expected by the add-enforcement-action endpoint.
 */
function toSnakeCaseParameterName(parameterName: string): string {
  const trimmedName = parameterName.trim();
  const normalizedName = trimmedName.toLowerCase();
  return (
    FINES_ACC_ENF_ACTION_ADD_RESULT_PARAMETER_NAME_MAP[normalizedName] ??
    trimmedName
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
  );
}

/**
 * Serialises selected menu-checkbox options into the response format expected by the API.
 */
function getCheckboxResponseValue(
  field: IFinesAccEnfActionAddFormField,
  formState: IFinesAccEnfActionAddFormState,
): string {
  return (field.checkboxControls ?? [])
    .filter((checkbox) => formState[checkbox.controlName] === true)
    .map((checkbox) => checkbox.option.value)
    .join(',');
}

/**
 * Normalises one dynamic field value for the enforcement result response payload.
 */
function getResponseValue(value: FormValue, type: TFinesAccEnfActionAddFieldType): string {
  if (!hasValue(value)) return '';
  const stringValue = value!.toString();
  return type === FIELD_TYPES.date ? (toApiDateOrNull(value) ?? stringValue) : stringValue;
}

/**
 * Builds optional payment terms from the add-action form when the operator opts to add them.
 */
function buildPaymentTerms(formState: IFinesAccEnfActionAddFormState): IOpalFinesAmendPaymentTerms | undefined {
  if (formState[CONTROL_NAMES.addPaymentTerms] !== true) {
    return undefined;
  }

  const paymentTermsFormState = mapToPaymentTermsAmendState(formState);
  if (!paymentTermsFormState.facc_payment_terms_payment_terms) return undefined;

  return buildPaymentTermsAmendPayloadUtil(paymentTermsFormState).payment_terms;
}

/**
 * Maps add-action payment term controls to the existing payment terms payload builder input shape.
 */
function mapToPaymentTermsAmendState(formState: IFinesAccEnfActionAddFormState): IFinesAccPaymentTermsAmendState {
  return {
    facc_payment_terms_payment_terms: toStringOrNull(formState[CONTROL_NAMES.paymentTerms]),
    facc_payment_terms_pay_by_date: toApiDateOrNull(formState[CONTROL_NAMES.payByDate]),
    facc_payment_terms_lump_sum_amount: toNumberOrNull(formState[CONTROL_NAMES.lumpSumAmount]),
    facc_payment_terms_instalment_amount: toNumberOrNull(formState[CONTROL_NAMES.instalmentAmount]),
    facc_payment_terms_instalment_period: toStringOrNull(formState[CONTROL_NAMES.instalmentPeriod]),
    facc_payment_terms_start_date: toApiDateOrNull(formState[CONTROL_NAMES.startDate]),
    facc_payment_terms_payment_card_request: null,
    facc_payment_terms_prevent_payment_card: null,
    facc_payment_terms_has_days_in_default: null,
    facc_payment_terms_suspended_committal_date: toApiDateOrNull(formState[CONTROL_NAMES.dateDaysInDefaultImposed]),
    facc_payment_terms_default_days_in_jail: toNumberOrNull(formState[CONTROL_NAMES.daysInDefault]),
    facc_payment_terms_reason_for_change: '',
    facc_payment_terms_change_letter: null,
  };
}

/**
 * Converts populated form dates to API date strings, otherwise null.
 */
function toApiDateOrNull(value: FormValue): string | null {
  if (!hasValue(value) || typeof value === 'boolean') return null;
  const stringValue = value!.toString();

  return dateService.isValidDate(stringValue, FORM_DATE_FORMAT)
    ? dateService.getFromFormatToFormat(stringValue, FORM_DATE_FORMAT, API_DATE_FORMAT)
    : null;
}

/**
 * Converts populated numeric form values to numbers, otherwise null.
 */
function toNumberOrNull(value: FormValue): number | null {
  if (!hasValue(value)) return null;
  return Number(value);
}

/**
 * Converts populated form values to strings, otherwise null.
 */
function toStringOrNull(value: FormValue): string | null {
  if (!hasValue(value) || typeof value === 'boolean') return null;
  return String(value);
}

/**
 * Checks whether a form value contains meaningful content.
 */
function hasValue(value: FormValue): boolean {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}
