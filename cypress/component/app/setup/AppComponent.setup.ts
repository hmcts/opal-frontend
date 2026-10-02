import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { NEVER } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

/** Mounts the application shell with external services isolated for global UI component tests. */
export const setupAppComponent = () =>
  mount(AppComponent, {
    providers: [
      provideHttpClient(),
      provideRouter([]),
      {
        provide: SessionService,
        useValue: { getTokenExpiry: () => NEVER },
      },
      {
        provide: AppInsightsService,
        useValue: { logPageView: () => null },
      },
      {
        provide: LaunchDarklyService,
        useValue: {
          initializeLaunchDarklyClient: () => null,
          initializeLaunchDarklyFlags: () => Promise.resolve(),
          initializeLaunchDarklyChangeListener: () => null,
        },
      },
      GlobalStore,
    ],
  });
