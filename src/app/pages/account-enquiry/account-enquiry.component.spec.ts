import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountEnquiryComponent } from './account-enquiry.component';
import { MacStateService, StateService } from '@services';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

describe('AccountEnquiryComponent', () => {
  let component: AccountEnquiryComponent;
  let fixture: ComponentFixture<AccountEnquiryComponent>;
  let macStateService: MacStateService;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEnquiryComponent],
      providers: [StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    macStateService = TestBed.inject(MacStateService);
    macStateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;
    stateService = TestBed.inject(StateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(macStateService.accountEnquiry).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    expect(stateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call handleBeforeUnload ', () => {
    // Empty state, should return true
    macStateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;
    expect(component.handleBeforeUnload()).toBeTruthy();

    macStateService.accountEnquiry.search.court = 'test';
    expect(component.handleBeforeUnload()).toBeFalsy();
  });
});
