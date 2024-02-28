import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SsoEndpoints } from 'src/app/enums/sso-endpoints';
import { StateService } from '../state-service/state.service';

describe('AuthService', () => {
  let service: AuthService;
  let stateService: StateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    stateService = TestBed.inject(StateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(true);
      expect(stateService.authenticated()).toEqual(true);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should be not authenticated', () => {
    service.checkAuthenticated().subscribe((resp) => {
      expect(resp).toEqual(false);
      expect(stateService.authenticated()).toEqual(false);
    });

    const req = httpMock.expectOne(`${SsoEndpoints.authenticated}`);
    expect(req.request.method).toBe('GET');

    req.flush(false);
  });
});
