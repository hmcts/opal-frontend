import { of } from 'rxjs';
import { setupAppComponent } from './setup/AppComponent.setup';

const LIVE_ALERT = 'opal-lib-custom-deferred-live-region-announcement output[role="alert"]';

const assertLiveAlert = (message: string): void => {
  cy.get(LIVE_ALERT).should('contain.text', message);
};

describe('Global alerts', { tags: ['@JIRA-STORY:PO-9041', '@JIRA-EPIC:PO-2472'] }, () => {
  it('announces the session expiry warning', () => {
    setupAppComponent().then(({ fixture }) => {
      fixture.componentInstance.thresholdInMinutes = 5;
      fixture.componentInstance.minutesRemaining$ = of(1);
      fixture.detectChanges();
    });

    assertLiveAlert('warning : Your session will expire');
  });

  it('announces the session expired warning', () => {
    setupAppComponent().then(({ fixture }) => {
      fixture.componentInstance.showExpiredWarning = true;
      fixture.detectChanges();
    });

    assertLiveAlert('warning : Your session has expired');
  });

  it('announces the global error banner', () => {
    setupAppComponent().then(({ fixture }) => {
      fixture.componentInstance.globalStore.setAuthenticated(true);
      fixture.componentInstance.globalStore.setBannerError({
        error: true,
        title: 'There is a problem',
        message: 'The service is unavailable.',
        operationId: null,
      });
      fixture.detectChanges();
    });

    assertLiveAlert('error : Error Message');
  });
});
