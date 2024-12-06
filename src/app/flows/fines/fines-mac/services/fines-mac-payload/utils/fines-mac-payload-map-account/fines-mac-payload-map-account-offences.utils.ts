import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../../../fines-mac-offence-details/constants/fines-mac-offence-details-state.constant';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/constants/fines-mac-offence-details-minor-creditor-state.constant';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { IFinesMacOffenceDetailsMinorCreditorState } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-state.interface';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsImpositionsState } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-impositions-state.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import {
  IFinesMacPayloadAccountOffences,
  IFinesMacPayloadAccountOffencesImposition,
  IFinesMacPayloadBuildAccountOffencesMinorCreditor,
} from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-offences.interface';

const getCreditorType = (companyFlag: boolean | null): string => {
  return companyFlag ? 'Company' : 'Individual';
};

const mapAccountOffencesMinorCreditorState = (imposition: IFinesMacPayloadAccountOffencesImposition, index: number) => {
  const creditorType =
    imposition && imposition.minor_creditor ? getCreditorType(imposition.minor_creditor.company_flag) : null;

  return {
    fm_offence_details_imposition_position: index,
    fm_offence_details_minor_creditor_creditor_type: creditorType,
    fm_offence_details_minor_creditor_title: imposition.minor_creditor?.title ?? null,
    fm_offence_details_minor_creditor_forenames: imposition.minor_creditor?.forenames ?? null,
    fm_offence_details_minor_creditor_surname: imposition.minor_creditor?.surname ?? null,
    fm_offence_details_minor_creditor_company_name: imposition.minor_creditor?.company_name ?? null,
    fm_offence_details_minor_creditor_address_line_1: imposition.minor_creditor?.address_line_1 ?? null,
    fm_offence_details_minor_creditor_address_line_2: imposition.minor_creditor?.address_line_2 ?? null,
    fm_offence_details_minor_creditor_address_line_3: imposition.minor_creditor?.address_line_3 ?? null,
    fm_offence_details_minor_creditor_post_code: imposition.minor_creditor?.post_code ?? null,
    fm_offence_details_minor_creditor_pay_by_bacs: imposition.minor_creditor?.pay_by_bacs ?? null,
    fm_offence_details_minor_creditor_bank_account_name: imposition.minor_creditor?.bank_account_name ?? null,
    fm_offence_details_minor_creditor_bank_sort_code: imposition.minor_creditor?.bank_sort_code ?? null,
    fm_offence_details_minor_creditor_bank_account_number: imposition.minor_creditor?.bank_account_number ?? null,
    fm_offence_details_minor_creditor_bank_account_ref: imposition.minor_creditor?.bank_account_ref ?? null,
  };
};

const getCreditor = (
  majorCreditorId: number | null,
  minorCreditor: IFinesMacPayloadBuildAccountOffencesMinorCreditor | null,
) => {
  if (majorCreditorId) {
    return 'minor';
  }

  if (minorCreditor?.surname) {
    return 'major';
  }

  return null;
};

const getNeedsCreditor = (impositionResultId: string | null): boolean => {
  return impositionResultId === 'FCOMP' || impositionResultId === 'FCOST' ? true : false;
};

const getBalanceRemaining = (amountImposed: number | null, amountPaid: number | null): number => {
  return (amountImposed || 0) - (amountPaid || 0);
};

const mapAccountOffencesImpositionsState = (imposition: IFinesMacPayloadAccountOffencesImposition, index: number) => {
  const creditor = getCreditor(imposition.major_creditor_id, imposition.minor_creditor);
  const needsCreditor = getNeedsCreditor(imposition.result_id);
  const balanceRemaining = getBalanceRemaining(imposition.amount_imposed, imposition.amount_paid);

  return {
    fm_offence_details_imposition_id: index,
    fm_offence_details_result_id: imposition.result_id,
    fm_offence_details_amount_imposed: imposition.amount_imposed,
    fm_offence_details_amount_paid: imposition.amount_paid,
    fm_offence_details_balance_remaining: balanceRemaining, // 'TODO: Calculate balance remaining'
    fm_offence_details_needs_creditor: needsCreditor,
    fm_offence_details_creditor: creditor,
    fm_offence_details_major_creditor_id: imposition.major_creditor_id,
  };
};

const mapAccountOffencesMinorCreditors = (
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null,
): IFinesMacOffenceDetailsMinorCreditorState[] => {
  let minorCreditors: IFinesMacOffenceDetailsMinorCreditorState[] = [];

  if (impositions) {
    impositions.forEach((imposition, index) => {
      if (imposition.minor_creditor) {
        minorCreditors.push(mapAccountOffencesMinorCreditorState(imposition, index));
      }
    });
  }

  return minorCreditors;
};

const mapAccountOffencesImpositions = (
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null,
): IFinesMacOffenceDetailsImpositionsState[] => {
  let offenceDetailsImpositionsState: IFinesMacOffenceDetailsImpositionsState[] = [];

  if (impositions) {
    impositions.forEach((imposition, index) => {
      offenceDetailsImpositionsState.push(mapAccountOffencesImpositionsState(imposition, index));
    });
  }

  return offenceDetailsImpositionsState;
};

const buildDefaultOffenceDetailsChildFormState = (): IFinesMacOffenceDetailsMinorCreditorForm => {
  return structuredClone({
    formData: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE,
    nestedFlow: false,
    status: null,
  });
};

const mapAccountOffenceDetailsMinorCreditorForm = (minorCreditors: IFinesMacOffenceDetailsMinorCreditorState[]) => {
  let offenceDetailsMinorCreditorForm: IFinesMacOffenceDetailsMinorCreditorForm[] = [];

  minorCreditors.forEach((minorCreditor) => {
    const offenceDetailsChildFormState: IFinesMacOffenceDetailsMinorCreditorForm =
      buildDefaultOffenceDetailsChildFormState();
    offenceDetailsChildFormState.formData = minorCreditor;
    offenceDetailsMinorCreditorForm.push(offenceDetailsChildFormState);
  });

  return offenceDetailsMinorCreditorForm;
};

const buildDefaultOffenceDetailsFormState = (): IFinesMacOffenceDetailsForm => {
  return structuredClone({
    formData: FINES_MAC_OFFENCE_DETAILS_STATE,
    nestedFlow: false,
    status: null,
    childFormData: null,
  });
};

const mapAccountOffencesPayload = (
  mappedFinesMacState: IFinesMacState,
  offences: IFinesMacPayloadAccountOffences[] | null,
) => {
  if (offences) {
    // Loop over the offences
    offences.forEach((offence, index) => {
      const offenceDetailsFormState: IFinesMacOffenceDetailsForm = buildDefaultOffenceDetailsFormState();

      let mappedOffenceDetailsImpositionsState: IFinesMacOffenceDetailsImpositionsState[] = [];
      let mappedOffenceDetailsMinorCreditorForm: IFinesMacOffenceDetailsMinorCreditorForm[] = [];

      if (offence?.impositions?.length) {
        // Build the imposition state
        mappedOffenceDetailsImpositionsState = mapAccountOffencesImpositions(offence.impositions);
        // Build the minor creditor state and map it to the child form

        mappedOffenceDetailsMinorCreditorForm = mapAccountOffenceDetailsMinorCreditorForm(
          mapAccountOffencesMinorCreditors(offence.impositions),
        );
      }

      // Map the offence details state
      offenceDetailsFormState.formData = {
        ...offenceDetailsFormState.formData,
        fm_offence_details_id: index,
        fm_offence_details_date_of_sentence: offence.date_of_sentence,
        fm_offence_details_offence_id: offence.offence_id,
        fm_offence_details_impositions: mappedOffenceDetailsImpositionsState,
      };

      // Map the minor creditor state to the child form
      offenceDetailsFormState.childFormData = mappedOffenceDetailsMinorCreditorForm;

      // Push the offence details state to the main state
      mappedFinesMacState.offenceDetails.push(offenceDetailsFormState);
    });
  }
  return mappedFinesMacState;
};

export const finesMacPayloadMapAccountOffences = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const { offences } = payload.account;

  return mapAccountOffencesPayload(mappedFinesMacState, offences);
};
