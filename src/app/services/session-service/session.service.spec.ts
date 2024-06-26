import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { SessionEndpoints } from '@enums';
import { USER_STATE_MOCK } from '@mocks';
import { GlobalStateService } from '@services';
import { IUserState } from '@interfaces';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let globalStateService: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GlobalStateService],
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStateService = TestBed.inject(GlobalStateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user state', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should return cached response ', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);

    // Make a second call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(SessionEndpoints.userState);
  });

  it('should do a new request if the cached response is empty ', () => {
    const mockUserState: IUserState = USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    let req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);

    // Make a second call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(SessionEndpoints.userState);

    // Clear the cache
    globalStateService.userState.set({} as IUserState);

    // Make a third call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
    });

    req = httpMock.expectOne(SessionEndpoints.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });
});
