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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpErrorInterceptor } from '@interceptors/http-error/http-error.interceptor';
import { AppInitializerService } from '@services/app-initializer-service/app-initializer.service';
import { MojBannerComponent, MojHeaderComponent, MojHeaderNavigationItemComponent } from '@components/moj';
import { GovukFooterComponent } from '@components/govuk';

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
