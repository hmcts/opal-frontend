import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import {
  FetchBackend,
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { createEnvironmentInjector, EnvironmentInjector, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { appConfig } from '@app/app.config';
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { Observable, of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_FINANCE_ROUTING_PATHS } from './constants/fines-finance-routing-paths.constant';
import { FinesFinanceInboundFilesComponent } from '../fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FinesFinanceOutboundFilesComponent } from '../fines-finance-outbound-files/fines-finance-outbound-files.component';
import { FinesFinanceUploadVariantBankingFilesComponent } from '../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { routing } from './fines-finance.routes';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
describe('fines finance routes', () => {
  it('should redirect the Finance root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.path === '');
    expect(rootRoute?.redirectTo).toBe(PAGES_ROUTING_PATHS.children.dashboard);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('should guard against leaving an unfinished upload', () => {
    const route = routing.find(
      (item) =>
        item.path ===
        `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
    );
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it.each([
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
      routePermissionId: FINES_PERMISSIONS['view-interface-files'],
      component: FinesFinanceInboundFilesComponent,
      expectedResolvers: { title: TitleResolver, businessUnits: fetchBusinessUnitsResolver },
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
      routePermissionId: FINES_PERMISSIONS['view-interface-files'],
      component: FinesFinanceOutboundFilesComponent,
      expectedResolvers: { title: TitleResolver },
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
      routePermissionId: FINES_PERMISSIONS['create-interface-files'],
      component: FinesFinanceUploadVariantBankingFilesComponent,
      expectedResolvers: { title: TitleResolver },
    },
  ])(
    'should title and lazy-load the $title route',
    async ({ path, title, routePermissionId, component, expectedResolvers }) => {
      const route = routing.find((routeItem) => routeItem.path === path);

      expect(route?.data).toEqual({ title, routePermissionId: [routePermissionId] });
      expect(route?.resolve).toEqual(expectedResolvers);
      expect(route?.canActivate).toEqual([authGuard, routePermissionsGuard]);
      await expect(route?.loadComponent?.()).resolves.toBe(component);
    },
  );

  describe('upload-route HTTP providers', () => {
    let routeInjectors: EnvironmentInjector[];
    const fetchHandle = vi.fn<(request: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>>();
    const xhrHandle = vi.fn<(request: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>>();
    const intercept = vi.fn((request: HttpRequest<unknown>, next: HttpHandler) => next.handle(request));
    const resetBannerError = vi.fn();
    const setBannerError = vi.fn();
    const logException = vi.fn();
    const fetchBackend = { handle: fetchHandle };
    const xhrBackend = { handle: xhrHandle };
    const metadata = {
      file_name: 'a121_261027_VB_123_AA.dat',
      source: 'VARIANT_BANKING',
      target: 'OPAL',
      type: 'SOURCE',
      domain: 'FINES',
      should_pre_process_file: true,
    };

    /**
     * Creates a route injector using real HTTP providers and controlled transport responses.
     * @param path - Finance route whose scoped providers should be exercised.
     * @returns A child injector that is destroyed after the test.
     */
    const createRouteInjector = (path: string) => {
      const route = routing.find((item) => item.path === path);
      if (!route) {
        throw new Error(`Expected the Finance route ${path}.`);
      }
      const injector = createEnvironmentInjector(
        [
          ...(route.providers ?? []),
          { provide: FetchBackend, useValue: fetchBackend },
          { provide: HttpXhrBackend, useValue: xhrBackend },
        ],
        TestBed.inject(EnvironmentInjector),
      );
      routeInjectors.push(injector);
      return injector;
    };

    beforeEach(() => {
      routeInjectors = [];
      fetchHandle.mockReset().mockReturnValue(of(new HttpResponse({ body: { uploaded: true } })));
      xhrHandle.mockReset();
      intercept.mockClear();
      resetBannerError.mockReset();
      setBannerError.mockReset();
      logException.mockReset();
      TestBed.configureTestingModule({
        providers: [
          ...appConfig.providers,
          { provide: AppInitializerService, useValue: { initializeApp: vi.fn().mockResolvedValue(undefined) } },
          { provide: FetchBackend, useValue: fetchBackend },
          { provide: HttpXhrBackend, useValue: xhrBackend },
          { provide: HttpXsrfTokenExtractor, useValue: { getToken: () => 'test-xsrf' } },
          { provide: HTTP_INTERCEPTORS, useValue: { intercept }, multi: true },
          { provide: GlobalStore, useValue: { resetBannerError, setBannerError } },
          { provide: AppInsightsService, useValue: { logException } },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
    });

    afterEach(() => {
      routeInjectors.forEach((injector) => injector.destroy());
      vi.restoreAllMocks();
    });

    it('uses XHR only for the route-owned upload service and keeps one interceptor chain per request', () => {
      const events = new Subject<HttpEvent<unknown>>();
      xhrHandle.mockReturnValue(events.asObservable());
      const rootService = TestBed.inject(OpalFileHandlingService);
      const rootClient = TestBed.inject(HttpClient);
      const uploadInjector = createRouteInjector('variant-banking-files/upload');
      const siblingInjector = createRouteInjector('inbound-files/search');
      const uploadService = uploadInjector.get(OpalFileHandlingService);
      const siblingService = siblingInjector.get(OpalFileHandlingService);
      const selected = new File(['banking'], metadata.file_name);
      const next = vi.fn();

      expect(uploadService).not.toBe(rootService);
      expect(uploadInjector.get(HttpClient)).not.toBe(rootClient);
      expect(siblingService).toBe(rootService);
      expect(siblingInjector.get(HttpClient)).toBe(rootClient);

      const subscription = uploadService.uploadInterfaceFile(selected, metadata).subscribe(next);

      expect(xhrHandle).toHaveBeenCalledOnce();
      expect(fetchHandle).not.toHaveBeenCalled();
      expect(intercept).toHaveBeenCalledOnce();
      const request = xhrHandle.mock.calls[0][0];
      expect(request.reportProgress).toBe(true);
      expect(request.body).toBeInstanceOf(FormData);
      expect(request.headers.get('Want-Content-Digest')).toBe('sha-512');
      expect(request.headers.get('X-XSRF-TOKEN')).toBe('test-xsrf');
      const progress: HttpEvent<unknown> = { type: HttpEventType.UploadProgress, loaded: 40, total: 100 };
      events.next(progress);
      expect(next).toHaveBeenCalledWith(progress);

      rootService.uploadInterfaceFile(selected, metadata).subscribe();
      siblingService.uploadInterfaceFile(selected, metadata).subscribe();

      expect(fetchHandle).toHaveBeenCalledTimes(2);
      expect(fetchHandle.mock.calls.every(([rootRequest]) => rootRequest.reportProgress)).toBe(true);
      expect(xhrHandle).toHaveBeenCalledOnce();
      expect(intercept).toHaveBeenCalledTimes(3);
      subscription.unsubscribe();
    });

    it('preserves the exact Fetch backend for server-rendered upload-route requests', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      const uploadInjector = createRouteInjector('variant-banking-files/upload');
      const service = uploadInjector.get(OpalFileHandlingService);

      expect(uploadInjector.get(HttpBackend)).toBe(uploadInjector.get(FetchBackend));
      service.uploadInterfaceFile(new File(['banking'], metadata.file_name), metadata).subscribe();

      expect(fetchHandle).toHaveBeenCalledOnce();
      expect(xhrHandle).not.toHaveBeenCalled();
      expect(intercept).toHaveBeenCalledOnce();
    });

    it.each([
      { status: 400, retriable: false },
      { status: 409, retriable: true },
    ])('forwards upload HTTP $status failures without global error effects', ({ status, retriable }) => {
      const events = new Subject<HttpEvent<unknown>>();
      xhrHandle.mockReturnValue(events.asObservable());
      const uploadInjector = createRouteInjector('variant-banking-files/upload');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const error = vi.fn();
      const complete = vi.fn();
      const failure = new HttpErrorResponse({
        status,
        error: { title: 'Upload rejected', detail: 'The banking file could not be accepted.', retriable },
      });

      uploadInjector
        .get(OpalFileHandlingService)
        .uploadInterfaceFile(new File(['banking'], metadata.file_name), metadata)
        .subscribe({ error, complete });
      events.error(failure);

      expect(error).toHaveBeenCalledExactlyOnceWith(failure);
      expect(complete).not.toHaveBeenCalled();
      expect(resetBannerError).not.toHaveBeenCalled();
      expect(setBannerError).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(logException).not.toHaveBeenCalled();
      expect(xhrHandle).toHaveBeenCalledOnce();
      expect(fetchHandle).not.toHaveBeenCalled();
      expect(intercept).toHaveBeenCalledOnce();
    });

    it('preserves an existing global banner after upload success while root success still clears it', () => {
      xhrHandle.mockReturnValue(of(new HttpResponse({ body: { uploaded: true } })));
      const uploadInjector = createRouteInjector('variant-banking-files/upload');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const next = vi.fn();

      uploadInjector
        .get(OpalFileHandlingService)
        .uploadInterfaceFile(new File(['banking'], metadata.file_name), metadata)
        .subscribe(next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ body: { uploaded: true } }));
      expect(resetBannerError).not.toHaveBeenCalled();
      expect(setBannerError).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(logException).not.toHaveBeenCalled();

      TestBed.inject(HttpClient).get('/opal-file-handling-service/interface-files').subscribe();

      expect(resetBannerError).toHaveBeenCalledOnce();
      expect(fetchHandle).toHaveBeenCalledOnce();
    });

    it('keeps the global navigation and logging policy for non-retriable root errors', () => {
      const failure = new HttpErrorResponse({ status: 403, error: { title: 'Permission denied', retriable: false } });
      fetchHandle.mockReturnValue(throwError(() => failure));
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const error = vi.fn();

      TestBed.inject(HttpClient).get('/opal-file-handling-service/interface-files').subscribe({ error });

      expect(error).toHaveBeenCalledExactlyOnceWith(failure);
      expect(navigate).toHaveBeenCalledExactlyOnceWith(['/error/permission-denied']);
      expect(logException).toHaveBeenCalledExactlyOnceWith(failure);
      expect(setBannerError).not.toHaveBeenCalled();
      expect(resetBannerError).not.toHaveBeenCalled();
      expect(xhrHandle).not.toHaveBeenCalled();
    });

    it('keeps the global retriable-conflict banner policy for sibling Finance routes', () => {
      const failure = new HttpErrorResponse({
        status: 409,
        error: { title: 'Conflict', detail: 'The record has changed.', retriable: true },
      });
      fetchHandle.mockReturnValue(throwError(() => failure));
      const siblingInjector = createRouteInjector('inbound-files/search');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const error = vi.fn();
      const complete = vi.fn();

      siblingInjector.get(HttpClient).get('/opal-file-handling-service/interface-files').subscribe({ error, complete });

      expect(setBannerError).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ error: true, title: 'Conflict', message: 'The record has changed.' }),
      );
      expect(complete).toHaveBeenCalledOnce();
      expect(error).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(logException).not.toHaveBeenCalled();
      expect(resetBannerError).not.toHaveBeenCalled();
      expect(xhrHandle).not.toHaveBeenCalled();
    });
  });
});
