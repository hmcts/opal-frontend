import { HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse, type HttpHandlerFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSsrSessionCookie, SSR_SESSION_CONTEXT, ssrSessionInterceptor } from './ssr-session.interceptor';

describe('SSR session forwarding', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SSR_SESSION_CONTEXT, useValue: { port: 4000, cookie: 'session=alpha' } }],
    });
  });

  it.each([
    ['/sso/authenticated', 'http://127.0.0.1:4000/sso/authenticated'],
    ['/api/user-state', 'http://127.0.0.1:4000/api/user-state'],
    ['/opal-fines-service/accounts?limit=2', 'http://127.0.0.1:4000/opal-fines-service/accounts?limit=2'],
    ['/opal-user-service/users', 'http://127.0.0.1:4000/opal-user-service/users'],
  ])('forwards the session for %s to the local server', async (path, expectedUrl) => {
    const next = vi.fn<HttpHandlerFn>(() => of(new HttpResponse({ status: 200 })));
    await firstValueFrom(
      TestBed.runInInjectionContext(() => ssrSessionInterceptor(new HttpRequest('GET', path), next)),
    );
    expect(next).toHaveBeenCalledTimes(1);
    const forwarded = next.mock.calls[0][0];
    expect(forwarded.url).toBe(expectedUrl);
    expect(forwarded.headers.get('Cookie')).toBe('session=alpha');
    expect(forwarded.redirect).toBe('error');
  });

  it.each([
    ['GET', 'https://example.invalid/opal-fines-service/accounts'],
    ['GET', '//example.invalid/opal-fines-service/accounts'],
    ['GET', '/opal-fines-service/../other'],
    ['GET', '/opal-fines-service/%2e%2e/other'],
    ['GET', '/opal-fines-service\\@example.invalid/other'],
    ['GET', '/another-endpoint'],
    ['POST', '/opal-fines-service/accounts'],
  ])('does not forward a session to %s %s', async (method, url) => {
    const next = vi.fn<HttpHandlerFn>(() => of(new HttpResponse({ status: 200 })));
    const request = new HttpRequest(method, url, null);
    await firstValueFrom(TestBed.runInInjectionContext(() => ssrSessionInterceptor(request, next)));
    expect(next).toHaveBeenCalledWith(request);
    expect(next.mock.calls[0][0].headers.has('Cookie')).toBe(false);
  });

  it('does not alter requests when there is no SSR session context', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const next = vi.fn<HttpHandlerFn>(() => of(new HttpResponse({ status: 200 })));
    const request = new HttpRequest('GET', '/sso/authenticated');
    await firstValueFrom(TestBed.runInInjectionContext(() => ssrSessionInterceptor(request, next)));
    expect(next).toHaveBeenCalledWith(request);
  });

  it('treats the local non-SSO logout redirect as success without following it', async () => {
    const next = vi.fn<HttpHandlerFn>(() =>
      throwError(() => new HttpErrorResponse({ status: 302, headers: new HttpHeaders({ Location: '/' }) })),
    );
    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() => ssrSessionInterceptor(new HttpRequest('GET', '/sso/logout'), next)),
    );
    expect(next.mock.calls[0][0].redirect).toBe('manual');
    expect(result).toBeInstanceOf(HttpResponse);
    expect((result as HttpResponse<unknown>).status).toBe(200);
  });

  it('does not accept an unexpected logout redirect', async () => {
    const next = vi.fn<HttpHandlerFn>(() =>
      throwError(
        () =>
          new HttpErrorResponse({ status: 302, headers: new HttpHeaders({ Location: 'https://example.invalid/' }) }),
      ),
    );
    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() => ssrSessionInterceptor(new HttpRequest('GET', '/sso/logout'), next)),
      ),
    ).rejects.toMatchObject({ status: 302 });
    expect(next.mock.calls[0][0].redirect).toBe('manual');
  });

  it('selects only the configured session cookie', () => {
    expect(getSsrSessionCookie('other=one; session=alpha; another=two', 'session')).toBe('session=alpha');
    expect(getSsrSessionCookie('other=one; session-extra=alpha', 'session')).toBeUndefined();
    expect(getSsrSessionCookie(undefined, 'session')).toBeUndefined();
  });
});
