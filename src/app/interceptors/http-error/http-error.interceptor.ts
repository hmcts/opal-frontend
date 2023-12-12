import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from '@services';
import { catchError, tap, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);

  // return next(req);
  return next(req).pipe(
    tap(() => {
      stateService.error.set({ error: false, message: '' });
    }),
    catchError((error) => {
      let errMsg;

      if (error.error instanceof ErrorEvent) {
        errMsg = `Error: ${error.error.message}`;
      } else {
        errMsg = `Error: ${error.message}`;
      }

      stateService.error.set({
        error: true,
        message: errMsg,
      });

      return throwError(() => error);
    }),
  );
};
