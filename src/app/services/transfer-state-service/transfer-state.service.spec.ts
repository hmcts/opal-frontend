import { TestBed } from '@angular/core/testing';

import { TransferStateService } from './transfer-state.service';

import { LAUNCH_DARKLY_CONFIG_MOCK, USER_STATE_MOCK } from '@mocks';
import { StateService } from '../state-service/state.service';

describe('TransferStateService', () => {
  let service: TransferStateService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferStateService);
    stateService = TestBed.inject(StateService);
    service['storedServerTransferState'] = {
      launchDarklyConfig: LAUNCH_DARKLY_CONFIG_MOCK,
      userState: USER_STATE_MOCK,
      ssoEnabled: true,
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize user state', () => {
    service.initializeUserState();

    expect(stateService.userState).toEqual(service['storedServerTransferState']?.userState);
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
