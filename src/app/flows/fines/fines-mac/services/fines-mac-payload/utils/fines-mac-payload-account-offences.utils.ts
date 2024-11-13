import { IFinesMacCourtDetailsState } from '../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { IFinesMacOffenceDetailsForm } from '../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsImpositionsState } from '../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-impositions-state.interface';
import {
  IFinesMacPayloadAccountOffences,
  IFinesMacPayloadAccountOffencesImposition,
  IFinesMacPayloadAccountOffencesMinorCreditor,
} from './interfaces/fines-mac-payload-account-offences.interface';

const getPayoutOnHold = (payByBacs: boolean | null): boolean => {
  return !!payByBacs;
};

const getCompanyFlag = (creditorType: string | null): boolean => {
  return creditorType?.toLocaleLowerCase() === 'company';
};

const buildAccountOffencesImpositionsMinorCreditorPayload = (
  childFormData: IFinesMacOffenceDetailsMinorCreditorForm | null,
): IFinesMacPayloadAccountOffencesMinorCreditor => {
  const payByBacs = childFormData?.formData?.fm_offence_details_minor_creditor_pay_by_bacs ?? null;
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
      const minorCreditor = impositionMinorCreditor
        ? buildAccountOffencesImpositionsMinorCreditorPayload(impositionMinorCreditor)
        : null;
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

export const buildAccountOffencesPayload = (
  offenceDetailsState: IFinesMacOffenceDetailsForm[],
  courtDetailsState: IFinesMacCourtDetailsState,
): IFinesMacPayloadAccountOffences[] => {
  const offences = offenceDetailsState.map((offence) => {
    const childFormData: IFinesMacOffenceDetailsMinorCreditorForm[] = offence.childFormData?.length
      ? offence.childFormData
      : [];
    const impositions = buildAccountOffencesImpositionsPayload(
      offence.formData.fm_offence_details_impositions,
      childFormData,
    );
    return {
      date_of_sentence: offence.formData.fm_offence_details_date_of_sentence ?? null,
      imposing_court_id: courtDetailsState.fm_court_details_imposing_court_id ?? null,
      offence_id: offence.formData.fm_offence_details_offence_id ?? null,
      impositions: impositions.length ? impositions : null,
    };
  });

  return offences;
};
