import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GovukFooterComponent } from './components/govuk/govuk-footer/govuk-footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MojHeaderComponent } from './components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from './components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
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
