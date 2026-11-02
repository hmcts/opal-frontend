import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IOpalFinesApr } from './interfaces/opal-fines-apr.interface';
import { OpalFines } from './opal-fines.service';

const reference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  business_unit_id: 77,
  relationship: 'APR',
  category: 'APR',
  apr_text: 'TEST-REFERENCE',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};

describe('OpalFines alternate payment reference removal', () => {
  let service: OpalFines;
  let http: HttpTestingController;
  const url = '/opal-fines-service/defendant-accounts/141/alternate-payment-references/11';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpRetryInterceptor])), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpalFines);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deletes the selected reference with the exact account If-Match and maps the HTTP 200 item and new ETag', () => {
    const result = vi.fn();

    service.deleteApr(141, 11, '"7"').subscribe(result);

    const request = http.expectOne(url);
    expect(request.request.method).toBe('DELETE');
    expect(request.request.headers.get('If-Match')).toBe('"7"');
    expect(request.request.headers.has('Business-Unit-Id')).toBe(false);
    expect(request.request.body).toBeNull();
    request.flush(reference, { status: 200, statusText: 'OK', headers: { ETag: '"8"' } });
    expect(result).toHaveBeenCalledExactlyOnceWith({ reference, version: '"8"' });
  });

  it.each(['APR', 'CONSOLIDATED', 'AMALGAMATED'] as const)(
    'preserves the deleted %s reference returned by the service',
    (relationship) => {
      const result = vi.fn();
      const deleted = { ...reference, relationship };

      service.deleteApr(141, 11, '"7"').subscribe(result);
      http.expectOne(url).flush(deleted, { headers: { ETag: '"8"' } });

      expect(result).toHaveBeenCalledWith({ reference: deleted, version: '"8"' });
    },
  );

  it('represents a missing response ETag explicitly', () => {
    const result = vi.fn();

    service.deleteApr(141, 11, '"7"').subscribe(result);
    http.expectOne(url).flush(reference);

    expect(result).toHaveBeenCalledWith({ reference, version: null });
  });

  it.each([409, 503, 504])('does not replay a DELETE after HTTP %s and propagates the error', (status) => {
    const next = vi.fn();
    const error = vi.fn();
    service.deleteApr(141, 11, '"7"').subscribe({ next, error });
    const failure = { status, title: 'Test request failure', retriable: status !== 409 };

    http.expectOne(url).flush(failure, { status, statusText: 'Test request failure' });

    http.expectNone(url);
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ status, error: failure }));
  });
});

describe('APR removal with standard global HTTP error handling', () => {
  let service: OpalFines;
  let http: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let globalStore: { setBannerError: ReturnType<typeof vi.fn>; resetBannerError: ReturnType<typeof vi.fn> };
  const url = '/opal-fines-service/defendant-accounts/141/alternate-payment-references/11';

  beforeEach(() => {
    router = { navigate: vi.fn().mockResolvedValue(true) };
    globalStore = { setBannerError: vi.fn(), resetBannerError: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor, httpRetryInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: GlobalStore, useValue: globalStore },
        { provide: AppInsightsService, useValue: { logException: vi.fn() } },
      ],
    });
    service = TestBed.inject(OpalFines);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('retains the standard concurrency error redirect for a stale account version', () => {
    const next = vi.fn();
    const error = vi.fn();
    service.deleteApr(141, 11, '"7"').subscribe({ next, error });

    http
      .expectOne(url)
      .flush({ status: 409, title: 'Conflict', retriable: false }, { status: 409, statusText: 'Conflict' });

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/error/concurrency-failure']);
    expect(globalStore.setBannerError).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
    http.expectNone(url);
  });

  it('retains the global banner for a transient processing failure without replaying the deletion', () => {
    const error = vi.fn();
    service.deleteApr(141, 11, '"7"').subscribe({ error });

    http
      .expectOne(url)
      .flush(
        { status: 503, title: 'Test failure', detail: 'Test unavailable', retriable: true },
        { status: 503, statusText: 'Service unavailable' },
      );

    expect(globalStore.setBannerError).toHaveBeenCalledWith(
      expect.objectContaining({ error: true, title: 'Test failure', message: 'Test unavailable' }),
    );
    expect(router.navigate).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
    http.expectNone(url);
  });

  it('retains the technical error redirect for an unexpected non-retriable failure', () => {
    const error = vi.fn();
    service.deleteApr(141, 11, '"7"').subscribe({ error });

    http
      .expectOne(url)
      .flush(
        { status: 500, title: 'Test failure', retriable: false },
        { status: 500, statusText: 'Internal server error' },
      );

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/error/internal-server'], {
      state: { operationId: null },
    });
    expect(error).toHaveBeenCalledOnce();
    http.expectNone(url);
  });
});
