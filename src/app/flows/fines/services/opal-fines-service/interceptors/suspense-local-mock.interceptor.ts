import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { OPAL_FINES_PATHS } from '../constants/opal-fines-paths.constant';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '../mocks/opal-fines-suspense-item-summary.mock';
import { OPAL_FINES_SUSPENSE_ITEM_HISTORY_MOCK } from '../mocks/opal-fines-suspense-item-history.mock';

// TODO(PO-9796, PO-9797): Remove this temporary fallback once both APIs are available locally.
export const suspenseLocalMockInterceptor: HttpInterceptorFn = (request, next) => {
  const hostname = inject(DOCUMENT).location?.hostname;
  if (
    !isDevMode() ||
    !hostname ||
    !['localhost', '127.0.0.1', '[::1]'].includes(hostname) ||
    request.method !== 'GET'
  ) {
    return next(request);
  }

  const summaryMatch = new RegExp(`^${OPAL_FINES_PATHS.suspenseAccounts}/[0-9]+/suspense-items/([^/]+)/summary$`).exec(
    request.url,
  );
  const isHistory = new RegExp(`^${OPAL_FINES_PATHS.suspenseItems}/[0-9]+/history$`).test(request.url);
  if (!summaryMatch && !isHistory) {
    return next(request);
  }

  // Run the real request first. Recover only the undeployed-endpoint 404 before
  // the outer global error interceptor displays a banner or navigates away.
  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
        return throwError(() => error);
      }
      const body = summaryMatch
        ? { ...OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK, suspense_item_number: decodeURIComponent(summaryMatch[1]) }
        : structuredClone(OPAL_FINES_SUSPENSE_ITEM_HISTORY_MOCK);
      return of(new HttpResponse({ status: 200, url: request.url, body }));
    }),
  );
};
