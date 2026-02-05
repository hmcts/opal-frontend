import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FinesAccSummaryHeaderComponent } from './fines-acc-summary-header.component';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages-component';

describe('FinesAccSummaryHeaderComponent', () => {
  let component: FinesAccSummaryHeaderComponent;
  let fixture: ComponentFixture<FinesAccSummaryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccSummaryHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccSummaryHeaderComponent);
    component = fixture.componentInstance;

    component.accountStore = {
      hasVersionMismatch: jasmine.createSpy('hasVersionMismatch').and.returnValue(false),
      successMessage: jasmine.createSpy('successMessage').and.returnValue(null),
      clearSuccessMessage: jasmine.createSpy('clearSuccessMessage'),
      account_number: jasmine.createSpy('account_number').and.returnValue('123456'),
      party_name: jasmine.createSpy('party_name').and.returnValue('Test Person'),
    } as unknown as typeof component.accountStore;

    component.hasAddAccountActivityNotePermission = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit refreshPage when handleRefreshPage is called', () => {
    spyOn(component.refreshPage, 'emit');

    component.handleRefreshPage();

    expect(component.refreshPage.emit).toHaveBeenCalled();
  });

  it('should emit navigateToAddAccountNotePage when handleNavigateToAddAccountNotePage is called', () => {
    spyOn(component.navigateToAddAccountNotePage, 'emit');

    component.handleNavigateToAddAccountNotePage();

    expect(component.navigateToAddAccountNotePage.emit).toHaveBeenCalled();
  });

  it('should pass banner inputs from accountStore', () => {
    (component.accountStore.hasVersionMismatch as unknown as jasmine.Spy).and.returnValue(true);
    (component.accountStore.successMessage as unknown as jasmine.Spy).and.returnValue('Saved');
    fixture.detectChanges();

    const banner = fixture.debugElement.query(By.directive(FinesAccBannerMessagesComponent));
    expect(banner.componentInstance.hasVersionMismatch).toBeTrue();
    expect(banner.componentInstance.successMessage).toBe('Saved');
  });

  it('should clear success message when banner emits clearSuccessMessage', () => {
    const banner = fixture.debugElement.query(By.directive(FinesAccBannerMessagesComponent));

    banner.triggerEventHandler('clearSuccessMessage');

    expect(component.accountStore.clearSuccessMessage).toHaveBeenCalled();
  });

  it('should show the add account note button when permission is true', () => {
    component.hasAddAccountActivityNotePermission = true;
    fixture.detectChanges();

    const addButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find((el) => el.nativeElement.textContent.includes('Add account note'));

    expect(addButton).toBeTruthy();
  });

  it('should not show the add account note button when permission is false', () => {
    component.hasAddAccountActivityNotePermission = false;
    fixture.detectChanges();

    const addButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find((el) => el.nativeElement.textContent.includes('Add account note'));

    expect(addButton).toBeFalsy();
  });
});
