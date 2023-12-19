import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEnquiryComponent } from './account-enquiry.component';
import { StateService } from '@services';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';

describe('AccountEnquiryComponent', () => {
  let component: AccountEnquiryComponent;
  let fixture: ComponentFixture<AccountEnquiryComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEnquiryComponent],
      providers: [StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

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
    expect(stateService.accountEnquiry()).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE);
    expect(stateService.error()).toEqual({ error: false, message: '' });
  });
});
