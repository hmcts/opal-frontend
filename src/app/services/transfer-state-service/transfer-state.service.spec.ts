import { TestBed } from '@angular/core/testing';

import { TransferStateService } from './transfer-state.service';

import { TRANSFER_STATE_MOCK } from './mocks';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { PLATFORM_ID, makeStateKey } from '@angular/core';
import { ITransferStateServerState } from './interfaces/transfer-state-server-state.interface';

describe('TransferStateService', () => {
  let service: TransferStateService;
  let globalStateService: GlobalStateService;

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
    globalStateService = TestBed.inject(GlobalStateService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).storedServerTransferState = TRANSFER_STATE_MOCK;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the transfer state from the server', () => {
    const storeKeyTransferState = makeStateKey<ITransferStateServerState>('serverTransferState');
    const serverTransferState = service['transferState'].get(storeKeyTransferState, undefined);
    expect(serverTransferState).toEqual(TRANSFER_STATE_MOCK);
  });

  it('should initialize SSO enabled', () => {
    service.initializeSsoEnabled();

    expect(globalStateService.ssoEnabled).toEqual(service['storedServerTransferState'].ssoEnabled);
  });

  it('should initialize launch darkly', () => {
    service.initializeLaunchDarklyConfig();

    expect(globalStateService.launchDarklyConfig).toEqual(service['storedServerTransferState'].launchDarklyConfig);
  });
});
