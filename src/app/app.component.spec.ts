import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NavigationEnd, RouterModule, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DateTime } from 'luxon';
import { GovukFooterComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-footer';
import {
  MojHeaderComponent,
  MojHeaderNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-header';
import { Observable, of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSpyObj } from './testing/create-spy-obj.helper';

const mockTokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;

describe('AppComponent - browser', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let globalStore: GlobalStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dateService: any;

  beforeEach(() => {
    const dateServiceSpy = createSpyObj(DateService, [
      'convertMillisecondsToMinutes',
      'calculateMinutesDifference',
      'getFromIso',
      'getDateNow',
    ]);

    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        MojAlertComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: DateService, useValue: dateServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dateService = TestBed.inject(DateService) as any;
    globalStore = TestBed.inject(GlobalStore);
  });

  beforeEach(() => {
    globalStore.setTokenExpiry(mockTokenExpiry);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize launchDarklyFlags and subscribe to launchDarklyFlags$', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(app['launchDarklyService'], 'initializeLaunchDarklyFlags').mockReturnValue(Promise.resolve());

    fixture.detectChanges();

    expect(app['launchDarklyService'].initializeLaunchDarklyFlags).toHaveBeenCalled();
  });

  it('should test handle authentication when authenticated is false', () => {
    globalStore.setAuthenticated(false);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = vi.spyOn<any, any>(component, 'handleRedirect').mockImplementation(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.login;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.login);
  });

  it('should test handle authentication when authenticated is true', () => {
    globalStore.setAuthenticated(true);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = vi.spyOn<any, any>(component, 'handleRedirect').mockImplementation(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.logout;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.logout);
  });

  it('should unsubscribe from the timeout interval subscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'next');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });

  it('should show expired warning when remaining minutes is zero', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.mockReturnValue(5);
    dateService.calculateMinutesDifference.mockReturnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    // Simulate timer tick
    vi.advanceTimersByTime(component['POLL_INTERVAL'] * 1000);
    fixture.detectChanges();

    expect(component.showExpiredWarning).toBe(true);

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should handle no expiry case correctly', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    globalStore.setTokenExpiry({ expiry: null, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.mockReturnValue(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupTimerSubSpy = vi.spyOn<any, any>(
      component as unknown as {
        setupTimerSub: (expiry: string) => void;
      },
      'setupTimerSub',
    );

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    // No timer should be set
    expect(setupTimerSubSpy).not.toHaveBeenCalled();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should convert warningThresholdInMilliseconds to minutes', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().plus({ minutes: 10 }).toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: null });
    dateService.convertMillisecondsToMinutes.mockReturnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    expect(dateService.convertMillisecondsToMinutes).toHaveBeenCalledWith(0);
    expect(component.thresholdInMinutes).toBe(0);

    // Clean up pending timers
    vi.advanceTimersByTime(component['POLL_INTERVAL'] * 1000);
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should set up token expiry and initialize timeout interval', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(of(SESSION_TOKEN_EXPIRY_MOCK));

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should not set up token expiry if sessionService.getTokenExpiry does not emit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should track page views on navigation end', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const mockNavigationEnd = new NavigationEnd(1, '/test', '/test');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'].events, 'pipe').mockReturnValue(of(mockNavigationEnd));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['appInsightsService'], 'logPageView');

    component.ngOnInit();
    vi.runOnlyPendingTimers();

    expect(component['appInsightsService'].logPageView).toHaveBeenCalledWith('test', '/test');
    vi.useRealTimers();
  });
});

describe('AppComponent - server', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        MojAlertComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
  });

  beforeEach(() => {
    mockTokenExpiry.expiry = '2023-07-03T12:30:00Z';
  });

  it('should not call getTokenExpiry as on server ', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).not.toHaveBeenCalled();
  });

  it('should not track page views on server', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['appInsightsService'], 'logPageView');

    component.ngOnInit();
    vi.runOnlyPendingTimers();

    expect(component['appInsightsService'].logPageView).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
