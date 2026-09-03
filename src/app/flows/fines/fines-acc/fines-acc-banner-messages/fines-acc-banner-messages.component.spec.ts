import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FinesAccBannerMessagesComponent } from './fines-acc-banner-messages.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES } from '../constants/fines-acc-collection-order-banner-messages.constant';

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
    component.hasPaymentHold = false;
    component.successMessage = null;
    component.collectionOrderBannerMessage = null;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit clearSuccessMessage when handleClearSuccessMessage is called', () => {
    vi.spyOn(component.clearSuccessMessage, 'emit');

    component.handleClearSuccessMessage();

    expect(component.clearSuccessMessage.emit).toHaveBeenCalled();
  });

  it('should emit refreshPage when handleRefreshPage is called', () => {
    vi.spyOn(component.refreshPage, 'emit');

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

  it('should render the Collection Order warning banner when collectionOrderBannerMessage is provided', () => {
    component.collectionOrderBannerMessage = FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.noCollectionOrder;
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.css('#acc-summary-header-banners-collection-order'));
    const bannerText = banner.query(By.css('opal-lib-moj-alert-content-text'))?.nativeElement?.textContent;
    const alert = banner.query(By.css('opal-lib-moj-alert'));

    expect(bannerText).toContain(FINES_ACC_COLLECTION_ORDER_BANNER_MESSAGES.noCollectionOrder);
    expect(alert.attributes['type']).toBe('warning');
    expect(alert.attributes['showDismiss']).toBeUndefined();
  });

  it('should not render the Collection Order warning banner when collectionOrderBannerMessage is null', () => {
    component.collectionOrderBannerMessage = null;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#acc-summary-header-banners-collection-order'))).toBeNull();
  });
});
