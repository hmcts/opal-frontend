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
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from './interceptors/content-digest.interceptor';

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
      withInterceptors([httpErrorInterceptor, contentDigestInterceptor]),
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
