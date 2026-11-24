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
import { Component, createEnvironmentInjector, EnvironmentInjector, inject, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from '@app/app.config';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_FINANCE_ROUTING_PATHS } from './constants/fines-finance-routing-paths.constant';
import { FinesFinanceComponent } from '../fines-finance.component';
import { FinesFinanceInboundFilesComponent } from '../fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FinesFinanceOutboundFilesComponent } from '../fines-finance-outbound-files/fines-finance-outbound-files.component';
import { FinesFinanceUploadVariantBankingFilesComponent } from '../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { release1cBankingInterfacesFeatureFlagGuard, routing } from './fines-finance.routes';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';

@Component({
  selector: 'app-interface-files-route-stub',
  template: '<p>{{ route.snapshot.data["title"] }}</p>',
})
class InterfaceFilesRouteStubComponent {
  public readonly route = inject(ActivatedRoute);
}

describe('fines finance routes', () => {
  const interfaceFilesRoutes = [
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
      component: FinesFinanceInboundFilesComponent,
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
      component: FinesFinanceOutboundFilesComponent,
    },
  ];

  it('should redirect the Finance root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.redirectTo);

    expect(rootRoute?.path).toBe('');
    expect(rootRoute?.redirectTo).toBe(PAGES_ROUTING_PATHS.children.dashboard);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it.each(interfaceFilesRoutes)(
    'should define the guarded, resolved $path route directly beneath Finance',
    async ({ path, title, component }) => {
      const route = routing.find((routeItem) => routeItem.path === path);

      expect(route?.data).toEqual({ title, routePermissionId: [FINES_PERMISSIONS['view-interface-files']] });
      expect(route?.resolve).toEqual({ title: TitleResolver, businessUnits: fetchBusinessUnitsResolver });
      expect(route?.canActivate).toEqual([routePermissionsGuard, release1cBankingInterfacesFeatureFlagGuard]);
      await expect(route?.loadComponent?.()).resolves.toBe(component);
    },
  );

  it.each(interfaceFilesRoutes)(
    'should navigate through the Finance shell to $path with resolved data on the leaf route',
    async ({ path, title }) => {
      const authGuardStub = vi.fn(() => true);
      const permissionsGuardStub = vi.fn(() => true);
      const businessUnits = [{ business_unit_id: 46, business_unit_name: 'Business unit' }];
      const businessUnitsResolverStub = vi.fn(() => businessUnits);
      const titleResolverStub = vi.fn(() => title);
      const url = `/${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}/${path}`;

      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              path: `${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}`,
              component: FinesFinanceComponent,
              children: routing.map((route) =>
                route.path === path
                  ? {
                      ...route,
                      loadComponent: () => Promise.resolve(InterfaceFilesRouteStubComponent),
                      canActivate: [authGuardStub, permissionsGuardStub],
                      resolve: { title: titleResolverStub, businessUnits: businessUnitsResolverStub },
                    }
                  : route,
              ),
            },
          ]),
        ],
      });

      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(url, FinesFinanceComponent);
      const child = harness.routeDebugElement?.query(By.directive(InterfaceFilesRouteStubComponent))
        .componentInstance as InterfaceFilesRouteStubComponent;

      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement?.textContent).toContain(title);
      expect(child.route.parent?.component).toBe(FinesFinanceComponent);
      expect(child.route.snapshot.routeConfig?.path).toBe(path);
      expect(child.route.snapshot.data).toEqual({
        title,
        routePermissionId: [FINES_PERMISSIONS['view-interface-files']],
        businessUnits,
      });
      expect(authGuardStub).toHaveBeenCalledOnce();
      expect(permissionsGuardStub).toHaveBeenCalledOnce();
      expect(titleResolverStub).toHaveBeenCalledOnce();
      expect(businessUnitsResolverStub).toHaveBeenCalledOnce();
    },
  );

  it('should guard against leaving an unfinished upload', () => {
    const route = routing.find(
      (item) =>
        item.path ===
        `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
    );
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('should preserve the guarded variant banking upload route', async () => {
    const uploadRoute = routing.find(
      (route) =>
        route.path ===
        `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
    );

    expect(uploadRoute?.data).toEqual({
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
      routePermissionId: [FINES_PERMISSIONS['upload-variant-banking-files']],
    });
    expect(uploadRoute?.resolve).toEqual({ title: TitleResolver });
    expect(uploadRoute?.canActivate).toEqual([routePermissionsGuard, release1cBankingInterfacesFeatureFlagGuard]);
    await expect(uploadRoute?.loadComponent?.()).resolves.toBe(FinesFinanceUploadVariantBankingFilesComponent);
  });

  describe('upload-route access', () => {
    it.each([
      { permissions: [27], allowed: true },
      { permissions: [18, 27], allowed: true },
      { permissions: [19], allowed: false },
      { permissions: [18, 19], allowed: false },
      { permissions: [18], allowed: false },
      { permissions: [], allowed: false },
    ])('checks upload permission 27 for a user with $permissions', async ({ permissions, allowed }) => {
      const userState = {
        ...OPAL_USER_STATE_MOCK,
        business_unit_users: [
          {
            ...OPAL_USER_STATE_MOCK.business_unit_users[0],
            permissions: permissions.map((permissionId) => ({
              permission_id: permissionId,
              permission_name: 'Test permission',
            })),
          },
        ],
      };
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: OpalUserService, useValue: { getLoggedInUserState: () => of(userState) } },
        ],
      });
      const uploadRoute = routing.find((route) => route.path === 'variant-banking-files/upload')!;
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() =>
          routePermissionsGuard({ data: uploadRoute.data } as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
        ) as Observable<boolean | UrlTree>,
      );

      if (allowed) {
        expect(result).toBe(true);
      } else {
        expect(result).toBeInstanceOf(UrlTree);
        expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/access-denied');
      }
    });
  });

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
      file_name: 'a121_261027_VB_123_01.dat',
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

describe('finance banking interfaces feature flag', () => {
  let featureFlags: Record<string, boolean>;

  beforeEach(() => {
    featureFlags = {};
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GlobalStore, useValue: { featureFlags: () => featureFlags } },
        {
          provide: LaunchDarklyService,
          useValue: { initializeLaunchDarklyFlags: vi.fn(), initializeLaunchDarklyClient: vi.fn() },
        },
      ],
    });
  });

  it.each([false, undefined])('uses the shared access-denied redirect when the flag is %s', async (enabled) => {
    if (enabled !== undefined) featureFlags[RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG] = enabled;

    const result = await TestBed.runInInjectionContext(() =>
      release1cBankingInterfacesFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/access-denied');
  });

  it('allows the Finance journey when banking interfaces is enabled', async () => {
    featureFlags[RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG] = true;

    const result = await TestBed.runInInjectionContext(() =>
      release1cBankingInterfacesFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
