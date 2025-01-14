import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukNotificationBannerComponent } from './govuk-notification-banner.component';
import { By } from '@angular/platform-browser';

describe('GovukNotificationBannerComponent', () => {
  let component: GovukNotificationBannerComponent | null;
  let fixture: ComponentFixture<GovukNotificationBannerComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukNotificationBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukNotificationBannerComponent);
    component = fixture.componentInstance;

    component.titleText = 'This is a test notification banner title';
    component.headingText = 'This is a test notification banner heading';
    component.messageText = 'This is a test notification banner message';

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a success message', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    component.type = 'success';
    fixture.detectChanges();

    // Query the element with the class 'govuk-notification-banner--success'
    const bannerElement = fixture.debugElement.query(By.css('.govuk-notification-banner--success'));
    expect(bannerElement).toBeTruthy(); // Check if the element exists

    // Query the element with the class 'govuk-notification-banner__title'
    const titleElement = fixture.debugElement.query(By.css('.govuk-notification-banner__title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe(component.titleText);

    // Query the element with the class 'govuk-notification-banner__heading'
    const headingElement = fixture.debugElement.query(By.css('.govuk-notification-banner__heading'));
    expect(headingElement.nativeElement.textContent.trim()).toBe(component.headingText);

    // Query the element with the class 'govuk-body'
    const bodyElement = fixture.debugElement.query(By.css('.govuk-body'));
    expect(bodyElement.nativeElement.textContent.trim()).toBe(component.messageText);
  });

  it('should create a success message', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    component.type = 'information';
    fixture.detectChanges();

    // Query the element with the class 'govuk-notification-banner--information'
    const bannerElement = fixture.debugElement.query(By.css('.govuk-notification-banner--information'));
    expect(bannerElement).toBeTruthy(); // Check if the element exists

    // Query the element with the class 'govuk-notification-banner__title'
    const titleElement = fixture.debugElement.query(By.css('.govuk-notification-banner__title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe(component.titleText);

    // Query the element with the class 'govuk-notification-banner__heading'
    const headingElement = fixture.debugElement.query(By.css('.govuk-notification-banner__heading'));
    expect(headingElement.nativeElement.textContent.trim()).toBe(component.headingText);

    // Query the element with the class 'govuk-body'
    const bodyElement = fixture.debugElement.query(By.css('.govuk-body'));
    expect(bodyElement.nativeElement.textContent.trim()).toBe(component.messageText);
  });
});
