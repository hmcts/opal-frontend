import {
  HttpBackend,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { uploadProgressHttpBackendFactory } from '@hmcts/opal-frontend-common/interceptors/helpers';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';

/**
 * Configures upload progress within the Variant Banking route's own HTTP client.
 * Upload failures reach the file list without global error banners or navigation.
 * The client retains digest, retry and DI interceptors and inherits the application's XSRF settings.
 * @returns Route providers for the progress-capable transport and its local API service.
 */
export function provideVariantBankingUpload(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(
      withFetch(),
      withInterceptors([contentDigestInterceptor, httpRetryInterceptor]),
      withInterceptorsFromDi(),
    ),
    { provide: HttpBackend, useFactory: uploadProgressHttpBackendFactory },
    // Resolve the route's HTTP client when constructing the upload API service.
    OpalFileHandlingService,
  ]);
}
