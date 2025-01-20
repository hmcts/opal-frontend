import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { catchError, tap, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStateService = inject(GlobalStateService);

  return next(req).pipe(
    tap(() => {
      // Clear the state service on new requests
      globalStateService.error.set({ error: false, message: '' });
    }),
    catchError((error) => {
      // Ensure ErrorEvent is handled only in browser environments
      const isBrowser = typeof window !== 'undefined';
      const isErrorEvent = isBrowser && typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent;

      const errorMessage = isErrorEvent
        ? `Client Error: ${error.error.message}`
        : `Server Error: ${error.message || 'An unknown error occurred'}`;

      globalStateService.error.set({
        error: true,
        message: errorMessage,
      });

      return throwError(() => error);
    }),
  );
};
