import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS } from '../../../../fines-mac-offence-details/constants/fines-mac-offence-details-creditor-options.constant';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../../../fines-mac-offence-details/constants/fines-mac-offence-details-result-codes.constant';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../../../fines-mac-offence-details/constants/fines-mac-offence-details-state.constant';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/constants/fines-mac-offence-details-minor-creditor-creditor-type.constant';
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
  IFinesMacPayloadAccountOffencesMinorCreditor,
} from '../interfaces/fines-mac-payload-account-offences.interface';

/**
 * Determines the creditor type based on the provided company flag.
 *
 * @param companyFlag - A boolean or null value indicating whether the creditor is a company.
 *                      If true, the function returns the second minor creditor type.
 *                      If false or null, the function returns the first minor creditor type.
 * @returns The creditor type as a string.
 */
const getCreditorType = (companyFlag: boolean | null): string => {
  const minorCreditorTypes = Object.keys(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE);
  return companyFlag ? minorCreditorTypes[1] : minorCreditorTypes[0];
};

/**
 * Maps the minor creditor state of an account offence imposition to the corresponding offence details.
 *
 * @param imposition - The imposition object containing minor creditor information.
 * @param index - The position index of the imposition in the list.
 * @returns An object containing the mapped minor creditor state details.
 */
const mapAccountOffencesMinorCreditorState = (
  minorCreditor: IFinesMacPayloadAccountOffencesMinorCreditor,
  index: number,
): IFinesMacOffenceDetailsMinorCreditorState => {
  const creditorType = getCreditorType(minorCreditor.company_flag);

  return {
    fm_offence_details_imposition_position: index,
    fm_offence_details_minor_creditor_creditor_type: creditorType,
    fm_offence_details_minor_creditor_title: minorCreditor.title,
    fm_offence_details_minor_creditor_forenames: minorCreditor.forenames,
    fm_offence_details_minor_creditor_surname: minorCreditor.surname,
    fm_offence_details_minor_creditor_company_name: minorCreditor.company_name,
    fm_offence_details_minor_creditor_address_line_1: minorCreditor.address_line_1,
    fm_offence_details_minor_creditor_address_line_2: minorCreditor.address_line_2,
    fm_offence_details_minor_creditor_address_line_3: minorCreditor.address_line_3,
    fm_offence_details_minor_creditor_post_code: minorCreditor.post_code,
    fm_offence_details_minor_creditor_pay_by_bacs: minorCreditor.pay_by_bacs,
    fm_offence_details_minor_creditor_bank_account_name: minorCreditor.bank_account_name,
    fm_offence_details_minor_creditor_bank_sort_code: minorCreditor.bank_sort_code,
    fm_offence_details_minor_creditor_bank_account_number: minorCreditor.bank_account_number,
    fm_offence_details_minor_creditor_bank_account_ref: minorCreditor.bank_account_ref,
  };
};

/**
 * Determines the type of creditor based on the provided major creditor ID and minor creditor details.
 *
 * @param majorCreditorId - The ID of the major creditor. If this is provided, the function will return 'minor'.
 * @param minorCreditor - An object containing details of the minor creditor. If the major creditor ID is not provided and the minor creditor has a surname, the function will return 'major'.
 * @returns 'minor' if the major creditor ID is provided, 'major' if the minor creditor has a surname, or null if neither condition is met.
 */
const getCreditor = (
  majorCreditorId: number | null,
  minorCreditor: IFinesMacPayloadAccountOffencesMinorCreditor | null,
): string | null => {
  const majorCreditorValue = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS[0].key;
  const minorCreditorValue = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS[1].key;

  if (majorCreditorId) {
    return majorCreditorValue;
  }

  if (minorCreditor?.surname) {
    return minorCreditorValue;
  }

  return null;
};

/**
 * Determines if a creditor is needed based on the imposition result ID.
 *
 * @param impositionResultId - The ID of the imposition result, which can be a string or null.
 * @returns `true` if the imposition result ID is 'FCOMP' or 'FCOST', otherwise `false`.
 */
const getNeedsCreditor = (impositionResultId: string | null): boolean => {
  return (
    impositionResultId === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation ||
    impositionResultId === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs
  );
};

/**
 * Calculates the remaining balance by subtracting the amount paid from the amount imposed.
 *
 * @param {number | null} amountImposed - The total amount imposed. If null, it defaults to 0.
 * @param {number | null} amountPaid - The total amount paid. If null, it defaults to 0.
 * @returns {number} The remaining balance after subtracting the amount paid from the amount imposed.
 */
const getBalanceRemaining = (amountImposed: number | null, amountPaid: number | null): number => {
  const imposed = amountImposed ?? 0;
  const paid = amountPaid ?? 0;
  return imposed - paid;
};

/**
 * Maps an imposition object to an offence details impositions state object.
 *
 * @param imposition - The imposition object containing details about the offence imposition.
 * @param index - The index of the imposition in the list.
 * @returns An object representing the offence details impositions state.
 */
const mapAccountOffencesImpositionsState = (
  imposition: IFinesMacPayloadAccountOffencesImposition,
  index: number,
): IFinesMacOffenceDetailsImpositionsState => {
  const { result_id, amount_imposed, amount_paid, major_creditor_id, minor_creditor } = imposition;

  const creditor = getCreditor(major_creditor_id, minor_creditor);
  const needsCreditor = getNeedsCreditor(result_id);
  const balanceRemaining = getBalanceRemaining(amount_imposed, amount_paid);

  return {
    fm_offence_details_imposition_id: index,
    fm_offence_details_result_id: result_id,
    fm_offence_details_amount_imposed: amount_imposed,
    fm_offence_details_amount_paid: amount_paid,
    fm_offence_details_balance_remaining: balanceRemaining,
    fm_offence_details_needs_creditor: needsCreditor,
    fm_offence_details_creditor: creditor,
    fm_offence_details_major_creditor_id: major_creditor_id,
  };
};

/**
 * Maps an array of impositions to an array of minor creditor states.
 *
 * @param impositions - An array of impositions or null.
 * @returns An array of minor creditor states. If the input is null or empty, returns an empty array.
 */
const mapAccountOffencesMinorCreditors = (
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null,
): IFinesMacOffenceDetailsMinorCreditorState[] => {
  // Return an empty array if the input is null or empty
  if (!impositions?.length) {
    return [];
  }

  // Filter impositions with valid minor creditors and map them
  return impositions
    .filter((imposition) => !!imposition.minor_creditor)
    .map(({ minor_creditor: minorCreditor }, index) =>
      minorCreditor ? mapAccountOffencesMinorCreditorState(minorCreditor, index) : null,
    )
    .filter((state): state is IFinesMacOffenceDetailsMinorCreditorState => state !== null);
};
/**
 * Maps an array of IFinesMacPayloadAccountOffencesImposition to an array of IFinesMacOffenceDetailsImpositionsState.
 *
 * @param impositions - An array of IFinesMacPayloadAccountOffencesImposition or null.
 * @returns An array of IFinesMacOffenceDetailsImpositionsState. If the input is null, returns an empty array.
 */
const mapAccountOffencesImpositions = (
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null,
): IFinesMacOffenceDetailsImpositionsState[] => {
  if (!impositions?.length) {
    return [];
  }

  return impositions.map((imposition, index) => mapAccountOffencesImpositionsState(imposition, index));
};

/**
 * Builds the default state for the offence details child form.
 *
 * @returns {IFinesMacOffenceDetailsMinorCreditorForm} The default state object for the offence details child form.
 */
const buildDefaultOffenceDetailsChildFormState = (): IFinesMacOffenceDetailsMinorCreditorForm => {
  return structuredClone({
    formData: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE,
    nestedFlow: false,
    status: null,
  });
};

/**
 * Maps an array of minor creditor offence details state objects to an array of minor creditor offence details form objects.
 *
 * @param minorCreditors - An array of `IFinesMacOffenceDetailsMinorCreditorState` objects representing the state of minor creditor offence details.
 * @returns An array of `IFinesMacOffenceDetailsMinorCreditorForm` objects representing the form data for minor creditor offence details.
 */
const mapAccountOffenceDetailsMinorCreditorForm = (
  minorCreditors: IFinesMacOffenceDetailsMinorCreditorState[],
): IFinesMacOffenceDetailsMinorCreditorForm[] => {
  return minorCreditors.map((minorCreditor) => {
    const offenceDetailsChildFormState = buildDefaultOffenceDetailsChildFormState();
    return {
      ...offenceDetailsChildFormState,
      formData: minorCreditor,
    };
  });
};

/**
 * Builds the default state for the offence details form.
 *
 * @returns {IFinesMacOffenceDetailsForm} The default state of the offence details form, including:
 * - `formData`: The initial state of the form data.
 * - `nestedFlow`: A boolean indicating if the form is part of a nested flow.
 * - `status`: The current status of the form, initially set to null.
 * - `childFormData`: Any child form data, initially set to null.
 */
const buildDefaultOffenceDetailsFormState = (): IFinesMacOffenceDetailsForm => {
  return structuredClone({
    formData: FINES_MAC_OFFENCE_DETAILS_STATE,
    nestedFlow: false,
    childFormData: null,
  });
};

/**
 * Maps the account offences payload to the fines MAC state.
 *
 * @param {IFinesMacState} mappedFinesMacState - The current state of the fines MAC.
 * @param {IFinesMacPayloadAccountOffences[] | null} offences - The offences payload to be mapped.
 * @returns {IFinesMacState} - The updated fines MAC state with the mapped offences.
 *
 * This function processes each offence in the provided offences payload and maps it to the fines MAC state.
 * It initializes the offence details form state, maps impositions and minor creditor state if available,
 * and appends the mapped offence details to the main state.
 */
const mapAccountOffencesPayload = (
  mappedFinesMacState: IFinesMacState,
  offences: IFinesMacPayloadAccountOffences[] | null,
  offencesRefData: IOpalFinesOffencesNonSnakeCase[] | null,
): IFinesMacState => {
  if (!offences?.length) {
    return mappedFinesMacState;
  }

  offences.forEach((offence, index) => {
    // Initialize offence details form state
    const offenceDetailsFormState: IFinesMacOffenceDetailsForm = buildDefaultOffenceDetailsFormState();

    // Map impositions and minor creditor state if available
    const mappedOffenceDetailsImpositionsState = mapAccountOffencesImpositions(offence.impositions);

    const mappedOffenceDetailsMinorCreditorForm = mapAccountOffenceDetailsMinorCreditorForm(
      mapAccountOffencesMinorCreditors(offence.impositions),
    );

    let offenceRefData;
    if (offencesRefData) {
      offenceRefData = offencesRefData.find((refData) => refData.offenceId === offence.offence_id);
    }

    // Map the offence details state
    offenceDetailsFormState.formData = {
      ...offenceDetailsFormState.formData,
      fm_offence_details_id: index,
      fm_offence_details_date_of_sentence: offence.date_of_sentence,
      fm_offence_details_offence_id: offence.offence_id,
      fm_offence_details_offence_cjs_code: offenceRefData ? offenceRefData.cjsCode : null,
      fm_offence_details_impositions: mappedOffenceDetailsImpositionsState,
    };

    // Assign minor creditor form data
    offenceDetailsFormState.childFormData = mappedOffenceDetailsMinorCreditorForm;

    // Append the mapped offence to the main state
    mappedFinesMacState.offenceDetails.push(offenceDetailsFormState);
  });

  return mappedFinesMacState;
};

/**
 * Maps the account offences from the payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account offences to be mapped.
 * @returns The updated fines MAC state with the mapped account offences.
 */
export const finesMacPayloadMapAccountOffences = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
  offencesRefData: IOpalFinesOffencesNonSnakeCase[] | null,
): IFinesMacState => {
  return mapAccountOffencesPayload(mappedFinesMacState, payload.account.offences, offencesRefData);
};
