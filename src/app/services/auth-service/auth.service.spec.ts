import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SsoEndpoints } from '@routing/enums/sso-endpoints';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService | null;
  let globalStateService: GlobalStateService | null;
  let httpMock: HttpTestingController | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    globalStateService = TestBed.inject(GlobalStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterAll(() => {
    service = null;
    globalStateService = null;
    httpMock = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authenticated', () => {
    if (!service || !httpMock) {
      fail('Required properties not properly initialised');
      return;
    }

    service.checkAuthenticated().subscribe((resp) => {
      if (!globalStateService) {
        fail('Required properties not properly initialised');
        return;
      }

      expect(resp).toEqual(true);
      expect(globalStateService.authenticated()).toEqual(true);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should be not authenticated', () => {
    if (!service || !httpMock) {
      fail('Required properties not properly initialised');
      return;
    }

    service.checkAuthenticated().subscribe((resp) => {
      if (!globalStateService) {
        fail('Required properties not properly initialised');
        return;
      }

      expect(resp).toEqual(false);
      expect(globalStateService.authenticated()).toEqual(false);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(false);
  });

  it('should make a GET request to check authentication and set authenticated state to false on error', () => {
    if (!service || !httpMock) {
      fail('Required properties not properly initialised');
      return;
    }

    service.checkAuthenticated().subscribe(
      () => {},
      () => {
        if (!globalStateService) {
          fail('Required properties not properly initialised');
          return;
        }

        expect(globalStateService.authenticated()).toEqual(false);
      },
    );

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush('401 error', { status: 401, statusText: 'Not Authenticated' });
  });
});
