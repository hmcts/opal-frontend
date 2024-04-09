import { TestBed } from '@angular/core/testing';

import { TransferStateService } from './transfer-state.service';

import { TRANSFER_STATE_MOCK } from '@mocks';
import { StateService } from '../state-service/state.service';
import { PLATFORM_ID, makeStateKey } from '@angular/core';
import { ITransferServerState } from '@interfaces';

describe('TransferStateService', () => {
  let service: TransferStateService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: 'serverTransferState',
          useValue: TRANSFER_STATE_MOCK,
        },
      ],
    });
    service = TestBed.inject(TransferStateService);
    stateService = TestBed.inject(StateService);
    service['storedServerTransferState'] = TRANSFER_STATE_MOCK;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the transfer state from the server', () => {
    const storeKeyTransferState = makeStateKey<ITransferServerState>('serverTransferState');
    const serverTransferState = service['transferState'].get(storeKeyTransferState, undefined);
    expect(serverTransferState).toEqual(TRANSFER_STATE_MOCK);
  });

  it('should initialize SSO enabled', () => {
    service.initializeSsoEnabled();

    expect(stateService.ssoEnabled).toEqual(service['storedServerTransferState'].ssoEnabled);
  });

  it('should initialize launch darkly', () => {
    service.initializeLaunchDarklyConfig();

    expect(stateService.launchDarklyConfig).toEqual(service['storedServerTransferState'].launchDarklyConfig);
  });
});
