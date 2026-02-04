import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FinesAccBannerMessagesComponent } from './fines-acc-banner-messages-component';

describe('FinesAccBannerMessagesComponent', () => {
  let component: FinesAccBannerMessagesComponent;
  let fixture: ComponentFixture<FinesAccBannerMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccBannerMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccBannerMessagesComponent);
    component = fixture.componentInstance;
    component.hasVersionMismatch = false;
    component.successMessage = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clearSuccessMessage when handleClearSuccessMessage is called', () => {
    spyOn(component.clearSuccessMessage, 'emit');

    component.handleClearSuccessMessage();

    expect(component.clearSuccessMessage.emit).toHaveBeenCalled();
  });

  it('should emit refreshPage when handleRefreshPage is called', () => {
    spyOn(component.refreshPage, 'emit');

    component.handleRefreshPage();

    expect(component.refreshPage.emit).toHaveBeenCalled();
  });

  it('should render the version mismatch banner when hasVersionMismatch is true', () => {
    component.hasVersionMismatch = true;
    fixture.detectChanges();

    const bannerText = fixture.debugElement.query(By.css('opal-lib-moj-alert-content-text'))?.nativeElement
      ?.textContent;
    expect(bannerText).toContain('Some information on this page may be out of date');
  });

  it('should render the success banner when successMessage is provided', () => {
    component.hasVersionMismatch = false;
    component.successMessage = 'Saved';
    fixture.detectChanges();

    const bannerText = fixture.debugElement.query(By.css('opal-lib-moj-alert-content-text'))?.nativeElement
      ?.textContent;
    expect(bannerText).toContain('Saved');
  });
});
