import { TestBed } from '@angular/core/testing';

import { UserStateService } from './user-state.service';
import { USER_STATE_MOCK } from '@mocks';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store user state in state store', () => {
    // Act
    service['storedUserState'] = USER_STATE_MOCK;
    service.storeUserStateInStateStore();

    // Assert
    expect(service['stateService'].userState()).toEqual(service['storedUserState']);
  });
});
