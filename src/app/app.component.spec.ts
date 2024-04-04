import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { GovukHeaderComponent } from './components/govuk-header/govuk-header.component';
import { GovukFooterComponent } from './components/govuk-footer/govuk-footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { SessionService, StateService } from '@services';
import { USER_STATE_MOCK } from '@mocks';

describe('AppComponent', () => {
  let sessionService: SessionService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, GovukHeaderComponent, GovukFooterComponent],
      declarations: [AppComponent],
      providers: [SessionService, StateService],
    });

    sessionService = TestBed.inject(SessionService);
    stateService = TestBed.inject(StateService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should not validate the userStateCache', () => {
    stateService.authenticated.set(false);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appSpy = spyOn<any>(app, 'validateUserStateCache');

    app.ngOnInit();

    expect(appSpy).not.toHaveBeenCalled();
  });

  it('should to validate the userStateCache', () => {
    stateService.authenticated.set(true);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appSpy = spyOn<any>(app, 'validateUserStateCache');

    app.ngOnInit();

    expect(appSpy).toHaveBeenCalled();
  });

  it('should reload the page if user state is different', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    const sessionServiceSpy = spyOn(sessionService, 'getUserState').and.returnValue(of(USER_STATE_MOCK));
    const modifiedMock = { ...USER_STATE_MOCK, userId: 'timTest' };
    stateService.userState = modifiedMock;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshUserStateCacheSpy = spyOn<any>(app, 'refreshUserStateCache');

    app['validateUserStateCache']();

    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(stateService.userState).toEqual(modifiedMock);
    expect(refreshUserStateCacheSpy).toHaveBeenCalled();
  });

  it('should not reload the page if user state is the same', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    const sessionServiceSpy = spyOn(sessionService, 'getUserState').and.returnValue(of(USER_STATE_MOCK));

    stateService.userState = USER_STATE_MOCK;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshUserStateCacheSpy = spyOn<any>(app, 'refreshUserStateCache');

    app['validateUserStateCache']();

    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(stateService.userState).toEqual(USER_STATE_MOCK);
    expect(refreshUserStateCacheSpy).not.toHaveBeenCalled();
  });
});
