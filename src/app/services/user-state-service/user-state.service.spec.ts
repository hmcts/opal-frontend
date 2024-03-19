import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserStateService } from './user-state.service';

import { IUserState } from '@interfaces';
import { USER_STATE_MOCK } from '@mocks';
import { StateService } from '@services';

describe('UserStateService', () => {
  let service: UserStateService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserStateService],
    });
    service = TestBed.inject(UserStateService);
    stateService = TestBed.inject(StateService);
  });

  it('should initialize user state', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service['storedUserState'] = mockUserState;
    service.initializeUserState();

    expect(stateService.userState()).toEqual(mockUserState);
  });

  it('should return unique permission IDs', () => {
    service['storedUserState'] = USER_STATE_MOCK;

    // Act
    service.getUserUniquePermissions();

    // Assert
    expect(service['storedUniquePermissionIds']).toEqual([54, 41]);
  });
});
