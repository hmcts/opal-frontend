import { HttpErrorResponse, HttpInterceptorFn, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';

export const finesSuspenseItemNotFoundInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      // The shared handler runs before the resolver and would show a banner or redirect for this expected 404.
      const summaryPath = `${OPAL_FINES_PATHS.suspenseAccounts}/`;
      if (
        request.method === 'GET' &&
        request.url.startsWith(summaryPath) &&
        /^\d+\/suspense-items\/[^/]+\/summary$/.test(request.url.slice(summaryPath.length)) &&
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.NotFound
      ) {
        return of(new HttpResponse({ body: null, url: request.url }));
      }
      return throwError(() => error);
    }),
  );
