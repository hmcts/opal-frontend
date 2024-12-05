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
} from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-offences.interface';

const mapAccountOffencesMinorCreditorState = (imposition: IFinesMacPayloadAccountOffencesImposition, index: number) => {
  return {
    fm_offence_details_imposition_position: index,
    fm_offence_details_minor_creditor_creditor_type: 'BASED ON COMPANY FLAG',
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

const mapAccountOffencesImpositionsState = (imposition: IFinesMacPayloadAccountOffencesImposition, index: number) => {
  return {
    fm_offence_details_imposition_id: index,
    fm_offence_details_result_id: imposition.result_id,
    fm_offence_details_amount_imposed: imposition.amount_imposed,
    fm_offence_details_amount_paid: imposition.amount_paid,
    fm_offence_details_balance_remaining: 0, // 'TODO: Calculate balance remaining'
    fm_offence_details_needs_creditor: false, // 'IF FCOMP OR FCOST '
    fm_offence_details_creditor: 'IF MAJOR CREDITOR ID  = MAJOR OR MINOR CREDIT = MINOR ELSE NULL',
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
    offences?.forEach((offence, index) => {
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
