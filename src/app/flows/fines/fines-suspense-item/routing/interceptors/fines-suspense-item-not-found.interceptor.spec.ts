import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { routing } from '../fines-suspense-item.routes';
import { Router } from '@angular/router';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { finesSuspenseItemNotFoundInterceptor } from './fines-suspense-item-not-found.interceptor';

describe('suspense item 404 handling with the shared interceptor', () => {
  const summaryUrl = '/opal-fines-service/suspense-accounts/22/suspense-items/001234/summary';
  const router = { navigate: vi.fn() };
  const globalStore = { setBannerError: vi.fn(), resetBannerError: vi.fn() };
  const insights = { logException: vi.fn() };
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor, finesSuspenseItemNotFoundInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: GlobalStore, useValue: globalStore },
        { provide: AppInsightsService, useValue: insights },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });
  afterEach(() => backend.verify());

  it.each([true, false])('returns an empty summary for a 404 (retriable: %s)', (retriable) => {
    const received = vi.fn();
    const failed = vi.fn();
    http.get(summaryUrl).subscribe({ next: received, error: failed });
    backend.expectOne(summaryUrl).flush({ retriable }, { status: 404, statusText: 'Not Found' });
    expect(received).toHaveBeenCalledExactlyOnceWith(null);
    expect(failed).not.toHaveBeenCalled();
    expect(globalStore.setBannerError).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('preserves the successful summary response', () => {
    const received = vi.fn();
    http.get(summaryUrl).subscribe(received);
    backend.expectOne(summaryUrl).flush({ suspense_item_id: 1 });
    expect(received).toHaveBeenCalledExactlyOnceWith({ suspense_item_id: 1 });
  });

  it('uses the results route client and service to handle a summary 404', () => {
    const resultsRoute = routing.find((route) => route.path?.includes(':suspenseItemId'))!;
    const injector = createEnvironmentInjector(
      [...resultsRoute.providers!, provideHttpClientTesting()],
      TestBed.inject(EnvironmentInjector),
    );
    try {
      const received = vi.fn();
      injector.get(OpalFines).getSuspenseItemSummary(22, '001234').subscribe(received);
      injector
        .get(HttpTestingController)
        .expectOne(summaryUrl)
        .flush({ retriable: false }, { status: 404, statusText: 'Not Found' });
      expect(received).toHaveBeenCalledExactlyOnceWith(null);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(globalStore.setBannerError).not.toHaveBeenCalled();
      injector.get(HttpTestingController).verify();
    } finally {
      injector.destroy();
    }
  });

  it('retains the shared error page for a 500 on the summary', () => {
    const failed = vi.fn();
    http.get(summaryUrl).subscribe({ error: failed });
    backend.expectOne(summaryUrl).flush({ retriable: false }, { status: 500, statusText: 'Error' });
    expect(failed).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/error/internal-server'], expect.any(Object));
  });

  it('retains the shared banner for a 404 on a different request', () => {
    const failed = vi.fn();
    const url = '/opal-fines-service/suspense-accounts/22/suspense-items/001234/history';
    http.get(url).subscribe({ error: failed });
    backend.expectOne(url).flush({}, { status: 404, statusText: 'Not Found' });
    expect(failed).toHaveBeenCalledOnce();
    expect(globalStore.setBannerError).toHaveBeenCalledWith(expect.objectContaining({ error: true }));
  });
});
