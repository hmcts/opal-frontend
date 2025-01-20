import { NgModule, inject, provideAppInitializer } from '@angular/core';
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
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
import { MojHeaderComponent } from '@components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from '@components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { GovukFooterComponent } from '@components/govuk/govuk-footer/govuk-footer.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    MojBannerComponent,
    MojHeaderComponent,
    MojHeaderNavigationItemComponent,
    GovukFooterComponent,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    provideAppInitializer(() => {
      const initializerFn = ((appInitializerService: AppInitializerService) => {
        return () => {
          return appInitializerService.initializeApp();
        };
      })(inject(AppInitializerService));
      return initializerFn();
    }),
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
