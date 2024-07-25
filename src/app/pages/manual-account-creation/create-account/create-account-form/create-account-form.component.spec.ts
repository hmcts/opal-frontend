import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountFormComponent } from './create-account-form.component';
import {
  BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
} from '@mocks';
import { MacStateService } from '@services';

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
    component.form.controls['accountType'].setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should call handleAccountTypeChange when accountType value changes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleAccountTypeChange');

    component['setupAccountTypeListener']();
    component.form.get('accountType')!.setValue('fine');

    expect(component['handleAccountTypeChange']).toHaveBeenCalled();
  });

  it('should handle account type change correctly', () => {
    const accountType = 'fine';
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    formValue.defendantType = 'adultOrYouthOnly';
    formValue.accountType = accountType;
    formValue.fineDefendantType = formValue.defendantType;
    component.form.setValue(formValue);

    component['handleAccountTypeChange']();

    expect(component.form.get('defendantType')?.value).toBeNull();
    expect(component.form.get('fixedPenaltyDefendantType')?.value).toBeNull();
    expect(component.form.get('fineDefendantType')?.value).toBe('adultOrYouthOnly');
    expect(component.form.get('defendantType')?.validator).toBeNull();
    expect(component.form.get('fixedPenaltyDefendantType')?.validator).toBeNull();
  });

  it('should handle account type change correctly', () => {
    const accountType = 'fixedPenalty';
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    formValue.defendantType = 'adultOrYouthOnly';
    formValue.accountType = accountType;
    formValue.fixedPenaltyDefendantType = formValue.defendantType;
    component.form.setValue(formValue);

    component['handleAccountTypeChange']();

    expect(component.form.get('defendantType')?.value).toBeNull();
    expect(component.form.get('fineDefendantType')?.value).toBeNull();
    expect(component.form.get('fixedPenaltyDefendantType')?.value).toBe('adultOrYouthOnly');
    expect(component.form.get('defendantType')?.validator).toBeNull();
    expect(component.form.get('fineDefendantType')?.validator).toBeNull();
  });

  it('should handle account type change correctly', () => {
    const accountType = 'conditionalCaution';
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    formValue.accountType = accountType;
    formValue.fineDefendantType = '';
    component.form.setValue(formValue);

    component['handleAccountTypeChange']();

    expect(component.form.get('defendantType')?.value).not.toBeNull();
    expect(component.form.get('fineDefendantType')?.value).toBeNull();
    expect(component.form.get('fixedPenaltyDefendantType')?.value).toBeNull();
    expect(component.form.get('defendantType')?.validator).toBeNull();
    expect(component.form.get('fineDefendantType')?.validator).toBeNull();
  });

  it('should set defendant type correctly for account type "fine"', () => {
    component.form.get('accountType')?.setValue('fine');
    component['setDefendantType']();
    expect(component.form.get('defendantType')?.value).toBe(component.form.get('fineDefendantType')?.value);
  });

  it('should set defendant type correctly for account type "fixedPenalty"', () => {
    component.form.get('accountType')?.setValue('fixedPenalty');
    component['setDefendantType']();
    expect(component.form.get('defendantType')?.value).toBe(component.form.get('fixedPenaltyDefendantType')?.value);
  });

  it('should set defendant type correctly for account type "conditionalCaution"', () => {
    component.form.get('accountType')?.setValue('conditionalCaution');
    component['setDefendantType']();
    expect(component.form.get('defendantType')?.value).toBe(component.conditionalCautionPenaltyDefendantTypes[0].key);
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;
    formValue.defendantType = 'adultOrYouthOnly';
    formValue.fineDefendantType = 'adultOrYouthOnly';
    formValue.fixedPenaltyDefendantType = 'adultOrYouthOnly';
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should unsubscribe from account type listener on ngOnDestroy', () => {
    spyOn(component['accountTypeListener'], 'unsubscribe');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'ngOnDestroy').and.callThrough();

    component.ngOnDestroy();

    expect(component['accountTypeListener'].unsubscribe).toHaveBeenCalled();
    expect(component['ngOnDestroy']).toHaveBeenCalled();
  });
});
