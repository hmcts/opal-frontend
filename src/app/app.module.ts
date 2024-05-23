import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { MojHeaderComponent, MojHeaderNavigationItemComponent, GovukFooterComponent } from '@components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpErrorInterceptor } from '@interceptors';
import { AppInitializerService } from '@services';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule,
    MojHeaderComponent,
    MojHeaderNavigationItemComponent,
    GovukFooterComponent,
    BrowserAnimationsModule,
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
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
