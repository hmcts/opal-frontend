import { finesMacPayloadMapAccountOffences } from './fines-mac-payload-map-account-offences.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../mocks/fines-mac-payload-add-account.mock';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from '../mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE } from '../../../../fines-mac-offence-details/fines-mac-offence-details-minor-creditor/constants/fines-mac-offence-details-minor-creditor-creditor-type.constant';

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
    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

    const offencesMockState: IFinesMacOffenceDetailsForm[] = result.offenceDetails;
    offencesMockState.push(structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE));

    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[0].formData);
    expect(result.offenceDetails[1].formData).toEqual(offencesMockState[1].formData);
  });

  it('should map offences with impositions that have minor creditors to the state correctly', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);
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

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

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

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

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

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

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

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

    expect(result.offenceDetails[0].formData.fm_offence_details_impositions).toEqual([]);
    expect(result.offenceDetails[0].childFormData).toEqual([]);
  });

  it('should return an empty array for impositions and child form data if impositions is an empty array', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    payload.account.offences[0].impositions = [];

    const result = finesMacPayloadMapAccountOffences(initialState, payload, null);

    expect(result.offenceDetails[0].formData.fm_offence_details_impositions).toEqual([]);
    expect(result.offenceDetails[0].childFormData).toEqual([]);
  });

  it('should return a cjs_code when offencesRefData is supplied', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const offencesRefData = structuredClone(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK);
    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    if (payload.account.offences[0].impositions) {
      payload.account.offences[0].impositions[0].minor_creditor = null;
      payload.account.offences[0].offence_id = offencesRefData.offenceId;
    }

    const result = finesMacPayloadMapAccountOffences(initialState, payload, [offencesRefData]);

    expect(result.offenceDetails[0].formData.fm_offence_details_offence_cjs_code).toEqual(
      OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK.cjsCode,
    );
  });

  it('should map creditor type to second entry when company_flag is true', () => {
    if (!initialState) fail('Initial state not initialised');

    const payload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
    payload.account.offences[0].impositions![0].minor_creditor!.company_flag = true;

    const result = finesMacPayloadMapAccountOffences(initialState as IFinesMacState, payload, null);
    const creditorType =
      result.offenceDetails[0].childFormData![0].formData.fm_offence_details_minor_creditor_creditor_type;
    const expectedType = Object.keys(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE)[1];

    expect(creditorType).toBe(expectedType);
  });

  it('should map creditor type to first entry when company_flag is false or null', () => {
    if (!initialState) fail('Initial state not initialised');

    const payload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);

    // false
    payload.account.offences[0].impositions![0].minor_creditor!.company_flag = false;
    let result = finesMacPayloadMapAccountOffences(initialState as IFinesMacState, payload, null);
    let creditorType =
      result.offenceDetails[0].childFormData![0].formData.fm_offence_details_minor_creditor_creditor_type;
    let expectedType = Object.keys(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE)[0];
    expect(creditorType).toBe(expectedType);

    // null
    payload.account.offences[0].impositions![0].minor_creditor!.company_flag = null;
    result = finesMacPayloadMapAccountOffences(initialState as IFinesMacState, payload, null);
    creditorType = result.offenceDetails[0].childFormData![0].formData.fm_offence_details_minor_creditor_creditor_type;
    expectedType = Object.keys(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_CREDITOR_TYPE)[0];
    expect(creditorType).toBe(expectedType);
  });
});
