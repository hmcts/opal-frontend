import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { catchError, tap, throwError } from 'rxjs';

export const HANDLE_APR_DUPLICATE_LOCALLY = new HttpContextToken<boolean>(() => false);

export const isAlternatePaymentReferenceDuplicate = (error: unknown): error is HttpErrorResponse =>
  error instanceof HttpErrorResponse &&
  error.status === 422 &&
  error.error?.type === 'https://hmcts.gov.uk/problems/BusinessRuleViolationException' &&
  error.error?.title === 'Alternate Payment Reference text already exists in business unit';

/** Keeps expected APR validation local while retaining the shared handling for all other failures. */
export const finesHttpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const isAprWrite =
    ['POST', 'PATCH'].includes(request.method) &&
    /\/defendant-accounts\/\d+\/alternate-payment-references(?:\/\d+)?$/.test(request.url);
  if (!isAprWrite || !request.context.get(HANDLE_APR_DUPLICATE_LOCALLY)) {
    return httpErrorInterceptor(request, next);
  }

  const injector = inject(EnvironmentInjector);
  const globalStore = inject(GlobalStore);
  return next(request).pipe(
    tap(() => globalStore.resetBannerError()),
    catchError((error: unknown) => {
      if (isAlternatePaymentReferenceDuplicate(error)) return throwError(() => error);
      // Delegate the received error, never the original network request.
      return runInInjectionContext(injector, () => httpErrorInterceptor(request, () => throwError(() => error)));
    }),
  );
};
