import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalStateService } from '@services';
import { catchError, tap, throwError } from 'rxjs';

/**
 * Interceptor function to handle HTTP errors.
 * @param req - The HTTP request.
 * @param next - The next interceptor in the chain.
 * @returns An Observable of the HTTP response.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStateService = inject(GlobalStateService);

  return next(req).pipe(
    tap(() => {
      // Clear the state service on new requests
      globalStateService.error.set({ error: false, message: '' });
    }),
    catchError((error) => {
      globalStateService.error.set({
        error: true,
        message: error.error instanceof ErrorEvent ? `Error: ${error.error.message}` : `Error: ${error.message}`,
      });

      return throwError(() => error);
    }),
  );
};
