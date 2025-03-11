import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { catchError, tap, throwError } from 'rxjs';
import { GlobalStore } from 'src/app/stores/global/global.store';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);
  const appInsightsService = inject(AppInsightsService);

  return next(req).pipe(
    tap(() => {
      // Clear the state service on new requests
      globalStore.setError({ error: false, message: '' });
    }),
    catchError((error) => {
      // Ensure ErrorEvent is handled only in browser environments
      const isBrowser = typeof window !== 'undefined';
      const isErrorEvent = isBrowser && typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent;

      const errorMessage = isErrorEvent ? `Error: ${error.error.message}` : `Error: ${error.message}`;

      globalStore.setError({
        error: true,
        message: errorMessage,
      });

      appInsightsService.logException(error);

      return throwError(() => error);
    }),
  );
};
