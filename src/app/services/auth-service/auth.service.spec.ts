import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';

describe('AuthService', () => {
  let service: AuthService;
  let globalStateService: GlobalStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    globalStateService = TestBed.inject(GlobalStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(true);
      expect(globalStateService.authenticated()).toEqual(true);
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should be not authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(false);
      expect(globalStateService.authenticated()).toEqual(false);
    });

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(false);
  });

  it('should make a GET request to check authentication and set authenticated state to false on error', () => {
    service.checkAuthenticated().subscribe(
      () => {},
      () => {
        expect(globalStateService.authenticated()).toEqual(false);
      },
    );

    const req = httpMock.expectOne(`${SSO_ENDPOINTS.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush('401 error', { status: 401, statusText: 'Not Authenticated' });
  });
});
