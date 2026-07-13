import { beforeEach, describe, expect, it, vi } from 'vitest';

const provideRouterMock = vi.fn();
const withRouterConfigMock = vi.fn();
const withInMemoryScrollingMock = vi.fn();
const provideClientHydrationMock = vi.fn();
const withNoHttpTransferCacheMock = vi.fn();
const provideHttpClientMock = vi.fn();
const withFetchMock = vi.fn();
const withInterceptorsMock = vi.fn();
const withInterceptorsFromDiMock = vi.fn();
const withXsrfConfigurationMock = vi.fn();
const provideAppInitializerMock = vi.fn();

vi.mock('@angular/router', () => ({
  provideRouter: provideRouterMock,
  withInMemoryScrolling: withInMemoryScrollingMock,
  withRouterConfig: withRouterConfigMock,
}));

vi.mock('@angular/platform-browser', () => ({
  provideClientHydration: provideClientHydrationMock,
  withNoHttpTransferCache: withNoHttpTransferCacheMock,
}));

vi.mock('@angular/common/http', () => ({
  provideHttpClient: provideHttpClientMock,
  withFetch: withFetchMock,
  withInterceptors: withInterceptorsMock,
  withInterceptorsFromDi: withInterceptorsFromDiMock,
  withXsrfConfiguration: withXsrfConfigurationMock,
}));

vi.mock('@angular/core', () => ({
  inject: vi.fn(),
  provideAppInitializer: provideAppInitializerMock,
}));

vi.mock('./app.routes', () => ({
  routes: [{ path: 'test' }],
}));

vi.mock('@hmcts/opal-frontend-common/services/app-initializer-service', () => ({
  AppInitializerService: class AppInitializerService {},
}));

vi.mock('@hmcts/opal-frontend-common/interceptors/http-error', () => ({
  httpErrorInterceptor: 'httpErrorInterceptor',
}));

vi.mock('@hmcts/opal-frontend-common/interceptors/content-digest', () => ({
  contentDigestInterceptor: 'contentDigestInterceptor',
}));

describe('appConfig', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    withRouterConfigMock.mockReturnValue('routerConfigFeature');
    withInMemoryScrollingMock.mockReturnValue('inMemoryScrollingFeature');
    provideRouterMock.mockReturnValue('routerProvider');
    withNoHttpTransferCacheMock.mockReturnValue('noHttpTransferCacheFeature');
    provideClientHydrationMock.mockReturnValue('clientHydrationProvider');
    withFetchMock.mockReturnValue('fetchFeature');
    withInterceptorsMock.mockReturnValue('interceptorsFeature');
    withInterceptorsFromDiMock.mockReturnValue('interceptorsFromDiFeature');
    withXsrfConfigurationMock.mockReturnValue('xsrfFeature');
    provideHttpClientMock.mockReturnValue('httpClientProvider');
    provideAppInitializerMock.mockReturnValue('appInitializerProvider');
  });

  it('should configure router scrolling to reset new navigations to the top', async () => {
    await import('./app.config');

    expect(withRouterConfigMock).toHaveBeenCalledWith({
      canceledNavigationResolution: 'computed',
    });
    expect(withInMemoryScrollingMock).toHaveBeenCalledWith({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
    });
    expect(provideRouterMock).toHaveBeenCalledWith(
      [{ path: 'test' }],
      'routerConfigFeature',
      'inMemoryScrollingFeature',
    );
  });
});
