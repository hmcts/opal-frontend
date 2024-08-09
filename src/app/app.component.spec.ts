import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SsoEndpoints } from '@enums';
import { GlobalStateService, UtilsService } from '@services';
import { RouterModule, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TOKEN_EXPIRY_MOCK } from '@mocks';
import { DateTime } from 'luxon';
import { ITokenExpiry } from '@interfaces';
import { MojBannerComponent, MojHeaderComponent, MojHeaderNavigationItemComponent } from '@components/moj';
import { GovukFooterComponent } from '@components/govuk';

const mockTokenExpiry: ITokenExpiry = TOKEN_EXPIRY_MOCK;

describe('AppComponent', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let globalStateService: GlobalStateService;
  let utilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'convertMillisecondsToMinutes',
      'calculateMinutesDifference',
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
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
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    });

    globalStateService = TestBed.inject(GlobalStateService);
    utilsService = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  beforeEach(() => {
    mockTokenExpiry.expiry = '2023-07-03T12:30:00Z';
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
    globalStateService.authenticated.set(false);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const spy = spyOn(component, 'handleRedirect').and.callFake(() => {
      mockDocumentLocation.location.href = SsoEndpoints.login;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.login);
  });

  it('should test handle authentication when authenticated is true', () => {
    globalStateService.authenticated.set(true);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const spy = spyOn(component, 'handleRedirect').and.callFake(() => {
      mockDocumentLocation.location.href = SsoEndpoints.logout;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.logout);
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
    globalStateService.tokenExpiry = { expiry: expiryTime, warningThresholdInMilliseconds: 300000 }; // 5 minutes
    utilsService.convertMillisecondsToMinutes.and.returnValue(5);
    utilsService.calculateMinutesDifference.and.returnValue(0);

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
    globalStateService.tokenExpiry = { expiry: null, warningThresholdInMilliseconds: 300000 }; // 5 minutes
    utilsService.convertMillisecondsToMinutes.and.returnValue(5);

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
    globalStateService.tokenExpiry = { expiry: expiryTime, warningThresholdInMilliseconds: null };
    utilsService.convertMillisecondsToMinutes.and.returnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    expect(utilsService.convertMillisecondsToMinutes).toHaveBeenCalledWith(0);
    expect(component.thresholdInMinutes).toBe(0);

    // Clean up pending timers
    tick(component['POLL_INTERVAL'] * 1000);
    flush();
  }));
});
