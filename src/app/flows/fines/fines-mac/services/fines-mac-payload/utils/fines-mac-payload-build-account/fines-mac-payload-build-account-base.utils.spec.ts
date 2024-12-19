import { finesMacPayloadBuildAccountBase } from './fines-mac-payload-build-account-base.utils';
import { IFinesMacAccountDetailsState } from '../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCourtDetailsState } from '../../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPayloadAccountAccountInitial } from '../../interfaces/fines-mac-payload-account-initial.interface';

import { FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-account-details-state.mock';
import { FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-court-details-state.mock';
import { FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK } from '../mocks/state/fines-mac-payload-payment-terms-state.mock';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';

const EXPECTED_PAYLOAD: IFinesMacPayloadAccountAccountInitial = {
  account_type: 'conditionalCaution',
  defendant_type: 'adultOrYouthOnly',
  originator_name: 'Crown Prosecution Service',
  originator_id: '4821',
  prosecutor_case_reference: 'P2BC305678',
  enforcement_court_id: 'Magistrates Court Database (204)',
  collection_order_made: true,
  collection_order_made_today: null,
  collection_order_date: '22/10/2024',
  suspended_committal_date: '12/10/2024',
  payment_card_request: true,
  account_sentence_date: '01/09/2024',
};

fdescribe('finesMacPayloadBuildAccountBase', () => {
  it('should build the initial payload correctly', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(EXPECTED_PAYLOAD);
  });

  it('should build the initial payload correctly with the most recent offence as account_sentence_date', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);
    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: '01/07/2024',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);
    expectedPayload.account_sentence_date = '01/07/2024';

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if both dates are invalid it should not change position', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);
    offenceDetailsState[0].fm_offence_details_date_of_sentence = 'Hello World';
    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: 'Hello Worldddd',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);
    expectedPayload.account_sentence_date = 'Hello World';

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if one date if start date is valid it should move to front of array', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);

    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: null,
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if if start date invalid it should move to bottom of array', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);
    offenceDetailsState[0].fm_offence_details_date_of_sentence = null;

    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: '01/07/2024',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);
    expectedPayload.account_sentence_date = '01/07/2024';
    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if start date is invalid it should move to bottom of array', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);
    offenceDetailsState[0].fm_offence_details_date_of_sentence = 'Hello';

    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: '01/07/2024',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);
    expectedPayload.account_sentence_date = '01/07/2024';
    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if one date if end date invalid it should move to bottom of array', () => {
    const accountDetailsState: IFinesMacAccountDetailsState = structuredClone(
      FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    );

    const courtDetailsState: IFinesMacCourtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    const paymentTermsState: IFinesMacPaymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    const offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);

    offenceDetailsState.push({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: 'Hello',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FCOST',
          fm_offence_details_amount_imposed: 300,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 9999,
        },
      ],
    });

    const expectedPayload: IFinesMacPayloadAccountAccountInitial = structuredClone(EXPECTED_PAYLOAD);

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });
});
