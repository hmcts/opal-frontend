import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountEnquiryComponent } from './account-enquiry.component';
import { GlobalStateService, AeStateService } from '@services';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

describe('AccountEnquiryComponent', () => {
  let component: AccountEnquiryComponent;
  let fixture: ComponentFixture<AccountEnquiryComponent>;
  let aeStateService: AeStateService;
  let globalStateService: GlobalStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEnquiryComponent],
      providers: [GlobalStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    aeStateService = TestBed.inject(AeStateService);
    aeStateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;
    globalStateService = TestBed.inject(GlobalStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(aeStateService.accountEnquiry).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    expect(globalStateService.error()).toEqual({ error: false, message: '' });
  });

  it('should call handleBeforeUnload ', () => {
    // Empty state, should return true
    aeStateService.accountEnquiry = ACCOUNT_ENQUIRY_DEFAULT_STATE;
    expect(component.handleBeforeUnload()).toBeTruthy();

    aeStateService.accountEnquiry.search.court = 'test';
    expect(component.handleBeforeUnload()).toBeFalsy();
  });
});
