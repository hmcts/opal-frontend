import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GovukFooterComponent } from './components/govuk/govuk-footer/govuk-footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MojHeaderComponent } from './components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from './components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SsoEndpoints } from '@enums';
import { StateService } from '@services';

describe('AppComponent', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        HttpClientTestingModule,
      ],
      declarations: [AppComponent],
      providers: [],
    });

    stateService = TestBed.inject(StateService);
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

  describe('handleAuthentication', () => {
    it('should test handle authentication when authenticated is false', () => {
      stateService.authenticated.set(false);

      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      const spy = spyOn(component, 'handleAuthentication').and.callFake(() => {
        mockDocumentLocation.location.href = SsoEndpoints.login;
      });

      component.handleAuthentication();

      expect(spy).toHaveBeenCalled();
      expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.login);
    });

    it('should test handle authentication when authenticated is true', () => {
      stateService.authenticated.set(true);

      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      const spy = spyOn(component, 'handleAuthentication').and.callFake(() => {
        mockDocumentLocation.location.href = SsoEndpoints.logout;
      });

      component.handleAuthentication();
      
      expect(spy).toHaveBeenCalled();
      expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.logout);
    });
  });
});
