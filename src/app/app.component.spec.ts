import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { GovukHeaderComponent } from './components/govuk-header/govuk-header.component';
import { GovukFooterComponent } from './components/govuk-footer/govuk-footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, GovukHeaderComponent, GovukFooterComponent, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [],
    });
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
});
