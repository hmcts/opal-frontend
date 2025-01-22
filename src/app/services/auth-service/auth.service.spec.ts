import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SsoEndpoints } from '@routing/enums/sso-endpoints';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalStore } from 'src/app/stores/global/global.store';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalStore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    globalStore = TestBed.inject(GlobalStore);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(true);
      expect(globalStore.authenticated()).toEqual(true);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should be not authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(false);
      expect(globalStore.authenticated()).toEqual(false);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(false);
  });

  it('should make a GET request to check authentication and set authenticated state to false on error', () => {
    service.checkAuthenticated().subscribe(
      () => {},
      () => {
        expect(globalStore.authenticated()).toEqual(false);
      },
    );

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush('401 error', { status: 401, statusText: 'Not Authenticated' });
  });
});
