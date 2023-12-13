import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { httpErrorInterceptor } from './http-error.interceptor';
import { throwError } from 'rxjs';
import { StateService } from '@services';

describe('httpErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService],
    });
    stateService = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept and set an error', () => {
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);
    interceptor(request, next).subscribe({
      error: () => {
        const errorState = stateService.error().error;
        expect(errorState).toBeTruthy();
      },
    });
  });
});
