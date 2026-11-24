import { HttpErrorResponse, HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { catchError, of, throwError } from 'rxjs';

export interface SsrSessionContext {
  port: number;
  cookie?: string;
}

/** Request-scoped session information for calls to the local frontend server during SSR. */
export const SSR_SESSION_CONTEXT = new InjectionToken<SsrSessionContext>('ssrSessionContext');

const SESSION_ENDPOINTS = new Set([SSO_ENDPOINTS.authenticated, SSO_ENDPOINTS.logout, '/api/user-state']);
const API_PREFIXES = ['/opal-fines-service/', '/opal-user-service/'];

/** Selects the frontend session cookie without forwarding unrelated browser cookies. */
export function getSsrSessionCookie(cookieHeader: string | undefined, cookieName: string): string | undefined {
  const prefix = `${cookieName}=`;
  return cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));
}

/** Sends approved local GET requests to the frontend server with the current request's session. */
export const ssrSessionInterceptor: HttpInterceptorFn = (request, next) => {
  const context = inject(SSR_SESSION_CONTEXT, { optional: true });
  if (
    !context ||
    request.method !== 'GET' ||
    !request.url.startsWith('/') ||
    request.url.startsWith('//') ||
    request.url.includes('\\')
  ) {
    return next(request);
  }

  const origin = `http://127.0.0.1:${context.port}`;
  const url = new URL(request.url, origin);
  if (
    url.origin !== origin ||
    (!SESSION_ENDPOINTS.has(url.pathname) && !API_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)))
  ) {
    return next(request);
  }

  const headers = context.cookie ? request.headers.set('Cookie', context.cookie) : request.headers.delete('Cookie');
  const isLogout = url.pathname === SSO_ENDPOINTS.logout;
  const localRequest = request.clone({
    url: url.toString(),
    headers,
    redirect: isLogout ? 'manual' : 'error',
  });

  if (!isLogout) {
    return next(localRequest);
  }

  return next(localRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 302 && error.headers.get('Location') === '/') {
        return of(new HttpResponse({ status: 200, body: '' }));
      }
      return throwError(() => error);
    }),
  );
};
