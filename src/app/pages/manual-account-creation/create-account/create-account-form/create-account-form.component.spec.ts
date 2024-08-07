import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountFormComponent } from './create-account-form.component';
import {
  BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
} from '@mocks';
import { MacStateService } from '@services';
import { Validators } from '@angular/forms';

describe('CreateAccountFormComponent', () => {
  let component: CreateAccountFormComponent;
  let fixture: ComponentFixture<CreateAccountFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [CreateAccountFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountFormComponent);
    component = fixture.componentInstance;

    component.autoCompleteItems = BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup account type listener', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component.ngOnInit();
    component.form.controls['AccountType'].setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('AccountType')!.setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should unsubscribe from account type listener on ngOnDestroy', () => {
    spyOn(component['ngUnsubscribe'], 'next');
    spyOn(component['ngUnsubscribe'], 'complete');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'ngOnDestroy').and.callThrough();

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
    expect(component['ngOnDestroy']).toHaveBeenCalled();
  });

  it('should handle account type change - fine', () => {
    const accountType = 'fine';
    const fieldName = 'FineDefendantType';
    const validators = [Validators.required];
    const fieldsToRemove = ['FixedPenaltyDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - fixed penalty', () => {
    const accountType = 'fixedPenalty';
    const fieldName = 'FixedPenaltyDefendantType';
    const validators = [Validators.required];
    const fieldsToRemove = ['FineDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).toHaveBeenCalledWith(fieldName, validators);
  });

  it('should handle account type change - conditional caution', () => {
    const accountType = 'conditionalCaution';
    const fieldsToRemove = ['FineDefendantType', 'FixedPenaltyDefendantType'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');

    component['handleAccountTypeChange'](accountType);

    expect(component['removeControl']).toHaveBeenCalledTimes(fieldsToRemove.length);
    fieldsToRemove.forEach((field) => {
      expect(component['removeControl']).toHaveBeenCalledWith(field);
    });
    expect(component['createControl']).not.toHaveBeenCalled();
  });

  it('should set defendant type based on account type - fixed penalty', () => {
    const accountType = 'fixedPenalty';
    const fieldName = 'FixedPenaltyDefendantType';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(fieldValue);
  });

  it('should set defendant type based on account type - fine', () => {
    const accountType = 'fine';
    const fieldName = 'FineDefendantType';
    const fieldValue = 'adultOrYouthOnly';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(fieldValue);
  });

  it('should set defendant type to default for conditional caution account type', () => {
    const accountType = 'conditionalCaution';
    const defaultDefendantType = component.conditionalCautionPenaltyDefendantTypes[0].key;

    component.form.get('AccountType')?.setValue(accountType);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).toEqual(defaultDefendantType);
  });

  it('should not do anything as the account, fieldName, and fieldValue are not real', () => {
    const accountType = 'test';
    const fieldName = 'test';
    const fieldValue = 'test';

    component.form.get('AccountType')?.setValue(accountType);
    component.form.get(fieldName)?.setValue(fieldValue);

    component['setDefendantType']();

    expect(component.form.get('DefendantType')?.value).not.toBeDefined();
  });
});
