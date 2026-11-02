import { HttpClient, HttpContext, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpRetryInterceptor, withHttpRetry } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  finesAccAprHttpErrorInterceptor,
  HANDLE_APR_DUPLICATE_LOCALLY,
  isAprDuplicate,
} from './fines-acc-apr-http-error.interceptor';

const duplicateProblem = {
  type: 'https://hmcts.gov.uk/problems/BusinessRuleViolationException',
  title: 'Alternate Payment Reference text already exists in business unit',
};
const aprUrl = '/opal-fines-service/defendant-accounts/141/alternate-payment-references';

describe('isAprDuplicate', () => {
  it.each([undefined, false])('identifies the exact duplicate problem with retriable=%s', (retriable) => {
    expect(isAprDuplicate(new HttpErrorResponse({ status: 422, error: { ...duplicateProblem, retriable } }))).toBe(
      true,
    );
  });

  it.each([
    new HttpErrorResponse({ status: 409, error: duplicateProblem }),
    new HttpErrorResponse({ status: 422, error: { ...duplicateProblem, type: 'https://example.test/other' } }),
    new HttpErrorResponse({ status: 422, error: { ...duplicateProblem, title: 'Another business rule failed' } }),
    new HttpErrorResponse({ status: 422, error: null }),
    new HttpErrorResponse({ status: 422, error: 'Invalid request' }),
    { status: 422, error: duplicateProblem },
    null,
  ])('does not classify a different or malformed error as an APR duplicate', (error) => {
    expect(isAprDuplicate(error)).toBe(false);
  });
});

describe('finesAccAprHttpErrorInterceptor HTTP chain', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let globalStore: { setBannerError: ReturnType<typeof vi.fn>; resetBannerError: ReturnType<typeof vi.fn> };
  let insights: { logException: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // Keep the production digest interceptor in the chain while isolating its unrelated crypto calculation.
    vi.stubGlobal('crypto', { subtle: { digest: async () => new ArrayBuffer(64) } });
    globalStore = { setBannerError: vi.fn(), resetBannerError: vi.fn() };
    insights = { logException: vi.fn() };
    router = { navigate: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([finesAccAprHttpErrorInterceptor, contentDigestInterceptor, httpRetryInterceptor]),
        ),
        provideHttpClientTesting(),
        { provide: GlobalStore, useValue: globalStore },
        { provide: AppInsightsService, useValue: insights },
        { provide: Router, useValue: router },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
  });

  const sendRequest = (method = 'POST', url = aprUrl, marked = true) => {
    const error = vi.fn();
    const next = vi.fn();
    const complete = vi.fn();
    const context = withHttpRetry({ retryCount: 2, delayMs: 0 }, new HttpContext());
    if (marked) context.set(HANDLE_APR_DUPLICATE_LOCALLY, true);
    client.request(method, url, { body: { apr_text: 'TEST-APR' }, context }).subscribe({ next, error, complete });
    return { error, next, complete };
  };

  it.each([
    ['POST', undefined],
    ['POST', false],
    ['PATCH', undefined],
    ['PATCH', false],
  ] as const)(
    'leaves the expected duplicate to the local %s caller with retriable=%s and sends one request',
    async (method, retriable) => {
      const url = method === 'POST' ? aprUrl : `${aprUrl}/11`;
      const callbacks = sendRequest(method, url);
      const request = await vi.waitFor(() => http.expectOne(url));
      expect(request.request.method).toBe(method);
      expect(request.request.headers.has('Content-Digest')).toBe(true);

      request.flush({ ...duplicateProblem, retriable }, { status: 422, statusText: 'Unprocessable Entity' });

      expect(callbacks.error).toHaveBeenCalledOnce();
      expect(callbacks.error).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
      expect(globalStore.setBannerError).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(insights.logException).not.toHaveBeenCalled();
      http.expectNone(url);
    },
  );

  it.each([
    [422, '/error/internal-server'],
    [409, '/error/concurrency-failure'],
    [403, '/error/permission-denied'],
    [500, '/error/internal-server'],
  ])('delegates unexpected non-retriable status %s to the shared error handler once', async (status, destination) => {
    const callbacks = sendRequest();
    const request = await vi.waitFor(() => http.expectOne(aprUrl));
    request.flush(
      { type: 'https://example.test/unknown', title: 'Other failure', retriable: false },
      { status: Number(status), statusText: 'Test failure' },
    );

    expect(callbacks.error).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(
      [destination],
      ...(status === 422 || status === 500 ? [expect.anything()] : []),
    );
    expect(insights.logException).toHaveBeenCalledOnce();
    expect(globalStore.setBannerError).not.toHaveBeenCalled();
    http.expectNone(aprUrl);
  });

  it.each([422, 503])(
    'uses shared banner handling for unexpected status %s without retrying the APR write',
    async (status) => {
      const callbacks = sendRequest();
      const request = await vi.waitFor(() => http.expectOne(aprUrl));
      request.flush(
        { title: 'Other failure', detail: 'Test technical failure' },
        { status, statusText: 'Test failure' },
      );

      expect(callbacks.error).toHaveBeenCalledOnce();
      expect(globalStore.setBannerError).toHaveBeenCalledOnce();
      expect(globalStore.setBannerError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Other failure', message: 'Test technical failure' }),
      );
      expect(insights.logException).toHaveBeenCalledOnce();
      expect(router.navigate).not.toHaveBeenCalled();
      http.expectNone(aprUrl);
    },
  );

  it('preserves shared retriable concurrency handling, including its completed stream', async () => {
    const callbacks = sendRequest();
    const request = await vi.waitFor(() => http.expectOne(aprUrl));
    request.flush({ title: 'Version changed' }, { status: 409, statusText: 'Conflict' });

    expect(globalStore.setBannerError).toHaveBeenCalledOnce();
    expect(callbacks.complete).toHaveBeenCalledOnce();
    expect(callbacks.error).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    http.expectNone(aprUrl);
  });

  it('clears existing global error feedback after a successful opted-in request', async () => {
    const callbacks = sendRequest();
    const request = await vi.waitFor(() => http.expectOne(aprUrl));
    request.flush({ apr_text: 'TEST-APR' });

    expect(callbacks.next).toHaveBeenCalledWith({ apr_text: 'TEST-APR' });
    expect(globalStore.resetBannerError).toHaveBeenCalled();
    expect(globalStore.setBannerError).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(insights.logException).not.toHaveBeenCalled();
  });

  it('retains shared handling when the APR request has not opted into local duplicate handling', async () => {
    const callbacks = sendRequest('POST', aprUrl, false);
    const request = await vi.waitFor(() => http.expectOne(aprUrl));
    request.flush(duplicateProblem, { status: 422, statusText: 'Unprocessable Entity' });

    expect(callbacks.error).toHaveBeenCalledOnce();
    expect(globalStore.setBannerError).toHaveBeenCalledOnce();
    expect(insights.logException).toHaveBeenCalledOnce();
    http.expectNone(aprUrl);
  });

  it.each([
    ['GET', aprUrl],
    ['DELETE', `${aprUrl}/11`],
    ['POST', '/opal-fines-service/defendant-accounts/141/notes'],
  ])('retains shared handling for an opted-in %s request outside APR create/update', async (method, url) => {
    const callbacks = sendRequest(method, url);
    const request = await vi.waitFor(() => http.expectOne(url));
    request.flush(duplicateProblem, { status: 422, statusText: 'Unprocessable Entity' });

    expect(callbacks.error).toHaveBeenCalledOnce();
    expect(globalStore.setBannerError).toHaveBeenCalledOnce();
    expect(insights.logException).toHaveBeenCalledOnce();
    http.expectNone(url);
  });
});
