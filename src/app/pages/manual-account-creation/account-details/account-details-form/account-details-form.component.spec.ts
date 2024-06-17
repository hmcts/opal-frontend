import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsFormComponent } from './account-details-form.component';
import {
  BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
  BUSINESS_UNIT_REF_DATA_MOCK,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
} from '@mocks';

describe('AccountDetailsFormComponent', () => {
  let component: AccountDetailsFormComponent;
  let fixture: ComponentFixture<AccountDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsFormComponent);
    component = fixture.componentInstance;

    component.autoCompleteItems = BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });
});
