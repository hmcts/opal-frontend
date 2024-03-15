import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserStateService } from './user-state.service';
import { SessionEndpoints } from '@enums';
import { IUserState } from '@interfaces';
import { USER_STATE_MOCK } from '@mocks';
import { StateService } from '@services';

describe('UserStateService', () => {
  let service: UserStateService;
  let stateService: StateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserStateService],
    });
    service = TestBed.inject(UserStateService);
    stateService = TestBed.inject(StateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve user state on initialize', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserStateOnInitialize().then((userState) => {
      expect(userState).toEqual(mockUserState);
      expect(stateService.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });
});
