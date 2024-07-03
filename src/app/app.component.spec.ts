import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GovukFooterComponent } from './components/govuk/govuk-footer/govuk-footer.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MojHeaderComponent } from './components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from './components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { SsoEndpoints } from '@enums';
import { GlobalStateService } from '@services';
import { RouterModule, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ITokenExpiry } from './interfaces/token-expiry.interface';
import { TOKEN_EXPIRY_MOCK } from '@mocks';

const mockTokenExpiry: ITokenExpiry = TOKEN_EXPIRY_MOCK;

describe('AppComponent', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let globalStateService: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MojHeaderComponent, MojHeaderNavigationItemComponent, GovukFooterComponent, RouterModule.forRoot([])],
      providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    globalStateService = TestBed.inject(GlobalStateService);
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
    component['timerSub'] = new Subscription();
    spyOn(component['timerSub'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['timerSub'].unsubscribe).toHaveBeenCalled();
  });

  it('should initialize the timeout interval and update minutesRemaining$', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    globalStateService.tokenExpiry = mockTokenExpiry;
    spyOn(component['utilsService'], 'calculateMinutesDifference').and.returnValue(10);

    component['initializeTimeoutInterval']();

    tick(60000); // Simulate 1 minute passing

    component.minutesRemaining$.subscribe((minutes) => {
      expect(minutes).toBe(10);
    });

    // Clean up the interval
    if (component['timerSub']) {
      component['timerSub'].unsubscribe();
    }

    flush(); // Ensure all timers are cleared
  }));
});
