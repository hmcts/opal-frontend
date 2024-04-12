import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';

import { SessionEndpoints } from '@enums';
import { USER_STATE_MOCK } from '@mocks';
import { StateService } from '@services';
import { IUserState } from '@interfaces';
import { of } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StateService],
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    stateService = TestBed.inject(StateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user state when stateService has a value', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;
    stateService.userState = mockUserState;

    service.getUserState().subscribe((userState: IUserState) => {
      expect(userState).toEqual(mockUserState);
    });
  });

  it('should return user state when stateService is empty', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserState().subscribe((userState: IUserState) => {
      expect(userState).toEqual(mockUserState);
      expect(stateService.userState).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });
});
