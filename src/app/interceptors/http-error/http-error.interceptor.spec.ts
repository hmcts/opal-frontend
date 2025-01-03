import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { httpErrorInterceptor } from './http-error.interceptor';
import { throwError } from 'rxjs';
import { GlobalStateService } from '@services/global-state-service/global-state.service';

describe('httpErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(req, next));
  let globalStateService: GlobalStateService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalStateService],
    });
    globalStateService = TestBed.inject(GlobalStateService);
  });

  afterAll(() => {
    globalStateService = null;
    TestBed.resetTestingModule();
  });

  it('should have no errors', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be created', () => {
    if (!globalStateService) {
      fail('Required properties not properly initialised');
      return;
    }

    expect(globalStateService.error().error).toBeFalsy();
  });

  it('should intercept and set an error', () => {
    if (!globalStateService) {
      fail('Required properties not properly initialised');
      return;
    }

    const errorResponse = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStateService.error().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        if (!globalStateService) {
          fail('Required properties not properly initialised');
          return;
        }

        const errorState = globalStateService.error().error;
        expect(errorState).toBeTruthy();
      },
    });
  });

  it('should intercept and set an error.error', () => {
    if (!globalStateService) {
      fail('Required properties not properly initialised');
      return;
    }

    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: new ErrorEvent('Error', {
        error: new Error('Error'),
        message: 'Error has occurred!',
        lineno: 402,
        filename: 'test.html',
      }),
    });
    const request = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    expect(globalStateService.error().error).toBeFalsy();

    interceptor(request, next).subscribe({
      error: () => {
        if (!globalStateService) {
          fail('Required properties not properly initialised');
          return;
        }

        const errorState = globalStateService.error().error;
        expect(errorState).toBeTruthy();
      },
    });
  });
});
