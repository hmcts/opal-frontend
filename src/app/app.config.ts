import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { AppInitializerService, AppInsightsService } from '@hmcts/opal-frontend-common/core/services';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        canceledNavigationResolution: 'computed',
      }),
    ),
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(
      withFetch(),
      withInterceptors([httpErrorInterceptor]),
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        headerName: 'X-XSRF-TOKEN',
        cookieName: 'XSRF-TOKEN',
      }),
    ),
    AppInsightsService,
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.initializeApp();
    }),
  ],
};
