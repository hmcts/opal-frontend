import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { ApplicationConfig, inject, makeStateKey, provideAppInitializer, TransferState } from '@angular/core';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { AppInitializerService } from '@hmcts/opal-frontend-common/services/app-initializer-service';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';

const SERVER_TRANSFER_STATE_KEY = makeStateKey<unknown>('serverTransferState');

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
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      const transferState = inject(TransferState);

      // `ng serve` does not render on the server, so no server configuration is available to initialise.
      if (!transferState.hasKey(SERVER_TRANSFER_STATE_KEY)) {
        return;
      }

      return appInitializerService.initializeApp();
    }),
  ],
};
