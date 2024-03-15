import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { GovukHeaderComponent, GovukFooterComponent } from '@components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpErrorInterceptor } from '@interceptors';
import { LaunchDarklyService, UserStateService } from '@services';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule,
    GovukHeaderComponent,
    GovukFooterComponent,
    BrowserAnimationsModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (launchDarklyService: LaunchDarklyService, userStateService: UserStateService) => {
        return () => {
          // Set the user state in the global store
          userStateService.storeUserStateInStateStore();

          // Initialize the LaunchDarkly client and flags
          launchDarklyService.initializeLaunchDarklyClient();
          launchDarklyService.initializeLaunchDarklyChangeListener();
          return launchDarklyService.initializeLaunchDarklyFlags();
        };
      },
      deps: [LaunchDarklyService, UserStateService],
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
