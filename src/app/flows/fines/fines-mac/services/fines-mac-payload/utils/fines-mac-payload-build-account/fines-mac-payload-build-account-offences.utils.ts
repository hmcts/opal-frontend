import { IFinesMacCourtDetailsState } from '../../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsImpositionsState } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-impositions-state.interface';
import {
  IFinesMacPayloadAccountOffences,
  IFinesMacPayloadAccountOffencesImposition,
  IFinesMacPayloadAccountOffencesMinorCreditor,
} from '../interfaces/fines-mac-payload-account-offences.interface';

/**
 * Determines if the payout is on hold based on the payment method.
 *
 * @param payByBacs - A boolean indicating if the payment is made by BACS. If null, it will be treated as false.
 * @returns A boolean indicating if the payout is on hold.
 */
const getPayoutOnHold = (payByBacs: boolean | null): boolean => {
  return !!payByBacs;
};

/**
 * Determines if the creditor type is a company.
 *
 * @param creditorType - The type of the creditor, which can be a string or null.
 * @returns `true` if the creditor type is 'company' (case-insensitive), otherwise `false`.
 */
const getCompanyFlag = (creditorType: string | null): boolean => {
  return creditorType?.toLocaleLowerCase() === 'company';
};

/**
 * Builds the payload for account offences impositions for a minor creditor.
 *
 * @param {IFinesMacOffenceDetailsMinorCreditorForm | null} childFormData - The form data containing details of the minor creditor offence.
 * @returns {IFinesMacPayloadAccountOffencesMinorCreditor} The payload for account offences impositions for a minor creditor.
 *
 * @remarks
 * This function extracts various fields from the provided form data and constructs an object
 * conforming to the `IFinesMacPayloadAccountOffencesMinorCreditor` interface. It handles null
 * values and provides default values where necessary.
 *
 */
const buildAccountOffencesImpositionsMinorCreditorPayload = (
  childFormData: IFinesMacOffenceDetailsMinorCreditorForm | null,
): IFinesMacPayloadAccountOffencesMinorCreditor | null => {
  if (!childFormData) {
    return null;
  }

  const payByBacs = childFormData?.formData?.fm_offence_details_minor_creditor_pay_by_bacs ?? false;
  const payoutOnHold = getPayoutOnHold(payByBacs);
  const creditorType = childFormData?.formData?.fm_offence_details_minor_creditor_creditor_type ?? null;
  const companyFlag = getCompanyFlag(creditorType);

  return {
    company_flag: companyFlag,
    title: childFormData?.formData?.fm_offence_details_minor_creditor_title ?? null,
    company_name: childFormData?.formData?.fm_offence_details_minor_creditor_company_name ?? null,
    surname: childFormData?.formData?.fm_offence_details_minor_creditor_surname ?? null,
    forenames: childFormData?.formData?.fm_offence_details_minor_creditor_forenames ?? null,
    dob: null,
    address_line_1: childFormData?.formData?.fm_offence_details_minor_creditor_address_line_1 ?? null,
    address_line_2: childFormData?.formData?.fm_offence_details_minor_creditor_address_line_2 ?? null,
    address_line_3: childFormData?.formData?.fm_offence_details_minor_creditor_address_line_3 ?? null,
    post_code: childFormData?.formData?.fm_offence_details_minor_creditor_post_code ?? null,
    telephone: null,
    email_address: null,
    payout_hold: payoutOnHold,
    pay_by_bacs: payByBacs,
    bank_account_type: 1,
    bank_sort_code: childFormData?.formData.fm_offence_details_minor_creditor_bank_sort_code ?? null,
    bank_account_number: childFormData?.formData.fm_offence_details_minor_creditor_bank_account_number ?? null,
    bank_account_name: childFormData?.formData.fm_offence_details_minor_creditor_bank_account_name ?? null,
    bank_account_ref: childFormData?.formData.fm_offence_details_minor_creditor_bank_account_ref ?? null,
  };
};

/**
 * Builds the payload for account offences impositions.
 *
 * @param impositions - An array of imposition state objects containing details about the offences.
 * @param childFormData - An array of form data objects for minor creditors associated with the offences.
 * @returns An array of payload objects for account offences impositions.
 */
const buildAccountOffencesImpositionsPayload = (
  impositions: IFinesMacOffenceDetailsImpositionsState[],
  childFormData: IFinesMacOffenceDetailsMinorCreditorForm[],
): IFinesMacPayloadAccountOffencesImposition[] => {
  return impositions.map(
    ({
      fm_offence_details_imposition_id: impositionId,
      fm_offence_details_result_id: resultId,
      fm_offence_details_amount_imposed: amountImposed,
      fm_offence_details_amount_paid: amountPaid,
      fm_offence_details_major_creditor_id: majorCreditorId,
    }) => {
      const impositionMinorCreditor = impositionId !== null ? childFormData[impositionId] : null;
      const minorCreditor = buildAccountOffencesImpositionsMinorCreditorPayload(impositionMinorCreditor);

      return {
        result_id: resultId ?? null,
        amount_imposed: amountImposed ?? null,
        amount_paid: amountPaid ?? null,
        major_creditor_id: majorCreditorId ?? null,
        minor_creditor: minorCreditor,
      };
    },
  );
};

/**
 * Builds the payload for account offences based on the provided offence details and court details state.
 *
 * @param offenceDetailsState - An array of offence details form state objects.
 * @param courtDetailsState - The state object containing court details.
 * @returns An array of payload objects for account offences.
 */
export const finesMacPayloadBuildAccountOffences = (
  offenceDetailsState: IFinesMacOffenceDetailsForm[],
  courtDetailsState: IFinesMacCourtDetailsState,
  toRfc3339Date: (date: string | null) => string | null,
): IFinesMacPayloadAccountOffences[] => {
  return offenceDetailsState.map((offence) => {
    const childFormData: IFinesMacOffenceDetailsMinorCreditorForm[] = offence.childFormData?.length
      ? offence.childFormData
      : [];
    const impositions = buildAccountOffencesImpositionsPayload(
      offence.formData.fm_offence_details_impositions,
      childFormData,
    );
    return {
      date_of_sentence: toRfc3339Date(offence.formData.fm_offence_details_date_of_sentence),
      imposing_court_id: courtDetailsState.fm_court_details_imposing_court_id ?? null,
      offence_id: offence.formData.fm_offence_details_offence_id ?? null,
      impositions: impositions.length ? impositions : null,
    };
  });
};
