import { TestBed } from '@angular/core/testing';

import { TransferStateService } from './transfer-state.service';
import { IUserState } from '@interfaces';
import { USER_STATE_MOCK } from '@mocks';
import { StateService } from '../state-service/state.service';

describe('TransferStateService', () => {
  let service: TransferStateService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferStateService);
    stateService = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize user state', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service['storedUserState'] = mockUserState;
    service.initializeUserState();

    expect(stateService.userState).toEqual(mockUserState);
  });

  it('should initialize SSO enabled', () => {
    const storedSsoEnabled = true;
    service['storedSsoEnabled'] = storedSsoEnabled;

    service.initializeSsoEnabled();

    expect(stateService.ssoEnabled).toEqual(storedSsoEnabled);
    expect(service['storedSsoEnabled']).toBeNull();
  });
});
