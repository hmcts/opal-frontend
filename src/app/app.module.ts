import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';

import {
  MojHeaderComponent,
  MojHeaderNavigationItemComponent,
  GovukFooterComponent,
  MojBannerComponent,
} from '@components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpErrorInterceptor } from '@interceptors';
import { AppInitializerService } from '@services';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MojHeaderComponent,
    MojHeaderNavigationItemComponent,
    GovukFooterComponent,
    BrowserAnimationsModule,
    MojBannerComponent,
  ],
  providers: [
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (appInitializerService: AppInitializerService) => {
        return () => {
          return appInitializerService.initializeApp();
        };
      },
      deps: [AppInitializerService],
    },
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        headerName: 'X-XSRF-TOKEN',
        cookieName: 'XSRF-TOKEN',
      }),
    ),
  ],
})
export class AppModule {}
