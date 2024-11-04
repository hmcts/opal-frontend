import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_MOCK } from './mocks/fines-mac-payload-account.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an add account payload', () => {
    const finesMacState: IFinesMacState = { ...FINES_MAC_PAYLOAD_FINES_MAC_STATE };

    const result = service.buildAddAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    expect(result).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should create an account payload', () => {
    const finesMacState: IFinesMacState = { ...FINES_MAC_PAYLOAD_FINES_MAC_STATE };

    const result = service['buildAccountPayload'](finesMacState);
    expect(result).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_MOCK);
  });
});
