import { finesMacPayloadMapAccountOffences } from './fines-mac-payload-map-account-offences.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../mocks/fines-mac-payload-add-account.mock';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from '../mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';

describe('finesMacPayloadMapAccountOffences', () => {
  let initialState: IFinesMacState | null;
  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  afterAll(() => {
    initialState = null;
  });

  it('should map offences with impositions that have major creditors to the state correctly', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    const result = finesMacPayloadMapAccountOffences(initialState, payload);

    const offencesMockState: IFinesMacOffenceDetailsForm[] = result.offenceDetails;
    offencesMockState.push(structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE));

    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[0].formData);
    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[1].formData);
  });

  it('should map offences with impositions that have minor creditors to the state correctly', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);

    const result = finesMacPayloadMapAccountOffences(initialState, payload);
    const offencesMockState: IFinesMacOffenceDetailsForm[] = [];
    offencesMockState.push(structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE));

    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[0].formData);
  });

  it('should return a null creditor', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    if (payload.account.offences[0].impositions) {
      payload.account.offences[0].impositions[0].minor_creditor = null;
    }

    const result = finesMacPayloadMapAccountOffences(initialState, payload);

    expect(result.offenceDetails[0].formData.fm_offence_details_impositions[0].fm_offence_details_creditor).toEqual(
      null,
    );
  });

  it('should return balance remaining of 0 if amount imposed and paid if null', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    if (payload.account.offences[0].impositions) {
      payload.account.offences[0].impositions[0].amount_imposed = null;
      payload.account.offences[0].impositions[0].amount_paid = null;
    }

    const result = finesMacPayloadMapAccountOffences(initialState, payload);

    expect(
      result.offenceDetails[0].formData.fm_offence_details_impositions[0].fm_offence_details_balance_remaining,
    ).toEqual(0);
  });

  it('should return an empty array if no offences', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = null;

    const result = finesMacPayloadMapAccountOffences(initialState, payload);

    expect(result.offenceDetails).toEqual([]);
  });

  it('should return an empty array for impositions and child form data if impositions is null', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    payload.account.offences[0].impositions = null;

    const result = finesMacPayloadMapAccountOffences(initialState, payload);

    expect(result.offenceDetails[0].formData.fm_offence_details_impositions).toEqual([]);
    expect(result.offenceDetails[0].childFormData).toEqual([]);
  });
});
