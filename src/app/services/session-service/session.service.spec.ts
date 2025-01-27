import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@services/session-service/mocks/session-token-expiry.mock';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SESSION_ENDPOINTS } from './constants/session-endpoints.constant';

const mockTokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let globalStateService: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [GlobalStateService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    globalStateService = TestBed.inject(GlobalStateService);
  });

  beforeEach(() => {
    mockTokenExpiry.expiry = '3600';
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user state', () => {
    const mockUserState: ISessionUserState = SESSION_USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SESSION_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should return cached response ', () => {
    const mockUserState: ISessionUserState = SESSION_USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    const req = httpMock.expectOne(SESSION_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);

    // Make a second call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.userState);
  });

  it('should do a new request if the cached response is empty ', () => {
    const mockUserState: ISessionUserState = SESSION_USER_STATE_MOCK;

    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    let req = httpMock.expectOne(SESSION_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);

    // Make a second call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
      expect(globalStateService.userState()).toEqual(mockUserState);
    });

    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.userState);

    // Clear the cache
    globalStateService.userState.set({} as ISessionUserState);

    // Make a third call
    service.getUserState().subscribe((response) => {
      expect(response).toEqual(mockUserState);
    });

    req = httpMock.expectOne(SESSION_ENDPOINTS.userState);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserState);
  });

  it('should return the token expiry information', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStateService.tokenExpiry).toEqual(mockTokenExpiry);
    });

    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);
  });

  it('should return cached response', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStateService.tokenExpiry).toEqual(mockTokenExpiry);
    });
    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);
    // Make a second call
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStateService.tokenExpiry).toEqual(mockTokenExpiry);
    });
    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.expiry);
  });

  it('should do a new request if the cached response is empty', () => {
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStateService.tokenExpiry).toEqual(mockTokenExpiry);
    });
    const req = httpMock.expectOne(SESSION_ENDPOINTS.expiry);
    expect(req.request.method).toBe('GET');
    req.flush(mockTokenExpiry);

    // Make a second call
    service.getTokenExpiry().subscribe((response) => {
      expect(response).toEqual(mockTokenExpiry);
      expect(globalStateService.tokenExpiry).toEqual(mockTokenExpiry);
    });
    // No new request should be made since the response is cached
    httpMock.expectNone(SESSION_ENDPOINTS.expiry);
  });
});
