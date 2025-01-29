import { finesMacPayloadBuildAccountBase } from './fines-mac-payload-build-account-base.utils';
import { IFinesMacAccountDetailsState } from '../../../../fines-mac-account-details/interfaces/fines-mac-account-details-state.interface';
import { IFinesMacCourtDetailsState } from '../../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPayloadAccountAccountInitial } from '../../interfaces/fines-mac-payload-account-initial.interface';

import { FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-account-details-state.mock';
import { FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-court-details-state.mock';
import { FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK } from '../mocks/state/fines-mac-payload-payment-terms-state.mock';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';
import { IFinesMacOffenceDetailsState } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_ACCOUNT_INITIAL_MOCK } from '../mocks/fines-mac-payload-account-account-initial.mock';

describe('finesMacPayloadBuildAccountBase', () => {
  let expectedPayload: IFinesMacPayloadAccountAccountInitial | null;
  let offenceMock: IFinesMacOffenceDetailsState | null;
  let courtDetailsState: IFinesMacCourtDetailsState | null;
  let accountDetailsState: IFinesMacAccountDetailsState | null;
  let paymentTermsState: IFinesMacPaymentTermsState | null;
  let offenceDetailsState: IFinesMacOffenceDetailsState[] | null;

  beforeEach(() => {
    expectedPayload = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_ACCOUNT_INITIAL_MOCK);
    courtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    accountDetailsState = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK);
    paymentTermsState = structuredClone(FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK);
    offenceDetailsState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData]);
    offenceMock = structuredClone({
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: null,
      fm_offence_details_offence_cjs_code: 'OFF1234',
      fm_offence_details_offence_id: 1234,
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
  });

  afterAll(() => {
    expectedPayload = null;
    courtDetailsState = null;
    accountDetailsState = null;
    paymentTermsState = null;
    offenceDetailsState = null;
    offenceMock = null;
  });

  it('should build the initial payload correctly', () => {
    if (!offenceDetailsState || !expectedPayload || !accountDetailsState || !courtDetailsState || !paymentTermsState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload correctly with the most recent offence as account_sentence_date', () => {
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const mostRecentOffenceDate = '01/07/2024';
    offenceMock.fm_offence_details_date_of_sentence = mostRecentOffenceDate;
    offenceDetailsState.push(structuredClone(offenceMock));
    expectedPayload.account_sentence_date = mostRecentOffenceDate;

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if both dates are invalid it should not change position', () => {
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offenceMock.fm_offence_details_date_of_sentence = 'Hello World';
    offenceDetailsState.push(structuredClone(offenceMock));

    offenceDetailsState[0].fm_offence_details_date_of_sentence = 'Hello World';

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
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offenceDetailsState.push(offenceMock);

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and if if start date invalid it should move to bottom of array', () => {
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offenceDetailsState[0].fm_offence_details_date_of_sentence = null;

    offenceMock.fm_offence_details_date_of_sentence = '01/07/2024';
    offenceDetailsState.push(offenceMock);

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
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offenceDetailsState[0].fm_offence_details_date_of_sentence = 'Hello';

    offenceMock.fm_offence_details_date_of_sentence = '01/07/2024';
    offenceDetailsState.push(offenceMock);

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
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offenceMock.fm_offence_details_date_of_sentence = 'Hello';
    offenceDetailsState.push(offenceMock);

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expect(result).toEqual(expectedPayload);
  });

  it('should build the initial payload and handle undefined values', () => {
    if (
      !offenceMock ||
      !offenceDetailsState ||
      !expectedPayload ||
      !accountDetailsState ||
      !courtDetailsState ||
      !paymentTermsState
    ) {
      fail('Required mock states are not properly initialised');
      return;
    }

    // paymentTermsState.fm_payment_terms_collection_order_made = undefined;
    // paymentTermsState.fm_payment_terms_collection_order_made_today = undefined;
    // paymentTermsState.fm_payment_terms_collection_order_date = undefined;
    // paymentTermsState.fm_payment_terms_suspended_committal_date = undefined;
    // paymentTermsState.fm_payment_terms_payment_card_request = undefined;

    const result = finesMacPayloadBuildAccountBase(
      accountDetailsState,
      courtDetailsState,
      paymentTermsState,
      offenceDetailsState,
    );

    expectedPayload.collection_order_made = null;
    expectedPayload.collection_order_made_today = null;
    expectedPayload.collection_order_date = null;
    expectedPayload.suspended_committal_date = null;
    expectedPayload.payment_card_request = null;

    expect(result).toEqual(expectedPayload);
  });
});
