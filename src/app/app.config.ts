import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        canceledNavigationResolution: 'computed',
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(
      withFetch(),
      // Response errors unwind in reverse order, so retry handles transient failures before the error UI.
      withInterceptors([httpErrorInterceptor, contentDigestInterceptor, httpRetryInterceptor]),
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        headerName: 'X-XSRF-TOKEN',
        cookieName: 'XSRF-TOKEN',
      }),
    ),
    provideAppInitializer(async () => {
      const appInitializerService = inject(AppInitializerService);
      appInitializerService.initializeApp();
    }),
  ],
};
