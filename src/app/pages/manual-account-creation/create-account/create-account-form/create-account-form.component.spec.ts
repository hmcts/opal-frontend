import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountFormComponent } from './create-account-form.component';
import { BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK } from '@mocks';
import { MacStateService } from '@services';

describe('CreateAccountFormComponent', () => {
  let component: CreateAccountFormComponent;
  let fixture: ComponentFixture<CreateAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountFormComponent],
      providers: [MacStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountFormComponent);
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
