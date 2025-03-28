import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NavigationEnd, RouterModule, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DateTime } from 'luxon';
import { GovukFooterComponent } from '@components/govuk/govuk-footer/govuk-footer.component';
import { MojHeaderComponent } from '@components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from '@components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
import { Observable, of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/types';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/interfaces';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/constants';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@hmcts/opal-frontend-common/mocks';

const mockTokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;

describe('AppComponent - browser', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let globalStore: GlobalStoreType;
  let dateService: jasmine.SpyObj<DateService>;

  beforeEach(() => {
    const dateServiceSpy = jasmine.createSpyObj(DateService, [
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
        MojBannerComponent,
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

    dateService = TestBed.inject(DateService) as jasmine.SpyObj<DateService>;
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

    spyOn(app['launchDarklyService'], 'initializeLaunchDarklyFlags').and.returnValue(Promise.resolve());

    fixture.detectChanges();

    expect(app['launchDarklyService'].initializeLaunchDarklyFlags).toHaveBeenCalled();
  });

  it('should test handle authentication when authenticated is false', () => {
    globalStore.setAuthenticated(false);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const spy = spyOn(component, 'handleRedirect').and.callFake(() => {
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
    const spy = spyOn(component, 'handleRedirect').and.callFake(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.logout;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.logout);
  });

  it('should unsubscribe from the timeout interval subscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    spyOn(component['ngUnsubscribe'], 'next');
    spyOn(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });

  it('should show expired warning when remaining minutes is zero', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.and.returnValue(5);
    dateService.calculateMinutesDifference.and.returnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    // Simulate timer tick
    tick(component['POLL_INTERVAL'] * 1000);
    fixture.detectChanges();

    expect(component.showExpiredWarning).toBeTrue();

    flush();
  }));

  it('should handle no expiry case correctly', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    globalStore.setTokenExpiry({ expiry: null, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.and.returnValue(5);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    // No timer should be set
    expect(component['timerSub']).toBeUndefined();

    flush();
  }));

  it('should convert warningThresholdInMilliseconds to minutes', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().plus({ minutes: 10 }).toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: null });
    dateService.convertMillisecondsToMinutes.and.returnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    expect(dateService.convertMillisecondsToMinutes).toHaveBeenCalledWith(0);
    expect(component.thresholdInMinutes).toBe(0);

    // Clean up pending timers
    tick(component['POLL_INTERVAL'] * 1000);
    flush();
  }));

  it('should set up token expiry and initialize timeout interval', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    spyOn(component['sessionService'], 'getTokenExpiry').and.returnValue(of(SESSION_TOKEN_EXPIRY_MOCK));

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should not set up token expiry if sessionService.getTokenExpiry does not emit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    spyOn(component['sessionService'], 'getTokenExpiry').and.returnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should track page views on navigation end', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const mockNavigationEnd = new NavigationEnd(1, '/test', '/test');
    spyOn(component['router'].events, 'pipe').and.returnValue(of(mockNavigationEnd));
    spyOn(component['appInsightsService'], 'logPageView');

    component.ngOnInit();
    tick();

    expect(component['appInsightsService'].logPageView).toHaveBeenCalledWith('test', '/test');
  }));
});

describe('AppComponent - server', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        MojBannerComponent,
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
    spyOn(component['sessionService'], 'getTokenExpiry').and.returnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).not.toHaveBeenCalled();
  });

  it('should not track page views on server', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    spyOn(component['appInsightsService'], 'logPageView');

    component.ngOnInit();
    tick();

    expect(component['appInsightsService'].logPageView).not.toHaveBeenCalled();
  }));
});
