import { finesMacPayloadMapAccountOffences } from './fines-mac-payload-map-account-offences.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../mocks/fines-mac-payload-add-account.mock';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_STATE } from '../fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';

describe('finesMacPayloadMapAccountOffences', () => {
  let initialState: IFinesMacState;
  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  it('should map offences with impositions that have major creditors to the state correctly', () => {
    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    const result = finesMacPayloadMapAccountOffences(initialState, payload);
    const offencesMockState: IFinesMacOffenceDetailsForm[] = result.offenceDetails;
    offencesMockState.push(structuredClone(FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_STATE));

    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[0].formData);
    expect(result.offenceDetails[1].formData).toEqual(offencesMockState[1].formData);
  });

  it('should map offences with impositions that have minor creditors to the state correctly', () => {
    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    payload.account.offences = structuredClone(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);

    const result = finesMacPayloadMapAccountOffences(initialState, payload);
    const offencesMockState: IFinesMacOffenceDetailsForm[] = [];
    offencesMockState.push(structuredClone(FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE));

    expect(result.offenceDetails[0].formData).toEqual(offencesMockState[0].formData);
  });
});
