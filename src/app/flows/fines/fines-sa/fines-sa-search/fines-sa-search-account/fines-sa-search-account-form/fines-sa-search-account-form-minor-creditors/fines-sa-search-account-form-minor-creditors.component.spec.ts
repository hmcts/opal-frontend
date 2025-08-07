import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors.component';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS } from './constants/fines-sa-search-account-form-minor-creditors-controls.constant';

describe('FinesSaSearchAccountFormMinorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMinorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMinorCreditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMinorCreditorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup(FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS);
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  afterEach(() => {
    component.form.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not require last name if first name is empty', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('individual');
    component.form.get('fsa_search_account_minor_creditors_first_names')?.setValue('');
    component.form.get('fsa_search_account_minor_creditors_last_name')?.setValue('');

    const hasRequired = component.form
      .get('fsa_search_account_minor_creditors_last_name')
      ?.hasValidator(Validators.required);

    expect(hasRequired).toBeFalse();
  });

  it('should require last name if first name is populated', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('individual');
    component.form.get('fsa_search_account_minor_creditors_first_names')?.setValue('John');
    component.form.get('fsa_search_account_minor_creditors_last_name')?.setValue('');

    expect(
      component.form.get('fsa_search_account_minor_creditors_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should skip validation logic if controls are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_minor_creditors_first_names: new FormControl('test'),
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (component as any)['handleLastNameConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if first names control is missing', () => {
    component.form = new FormGroup({
      fsa_search_account_minor_creditors_last_name: new FormControl('Smith'),
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (component as any)['setupConditionalLastNameValidation']()).not.toThrow();
  });

  it('should set requiredIndividualMinorCreditorData error if individual fields are empty', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('individual');

    component.applyMinorCreditorValidation();
    fixture.detectChanges();

    const control = component.form.get('fsa_search_account_minor_creditors_minor_creditor_type');
    expect(control?.hasError('requiredIndividualMinorCreditorData')).toBeTrue();
  });

  it('should not set error if any individual field is populated', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('individual');
    component.form.get('fsa_search_account_minor_creditors_last_name')?.setValue('Smith');

    component['applyMinorCreditorValidation']();
    fixture.detectChanges();

    const control = component.form.get('fsa_search_account_minor_creditors_minor_creditor_type');
    expect(control?.hasError('requiredIndividualMinorCreditorData')).toBeFalsy();
  });

  it('should set requiredCompanyMinorCreditorData error if company fields are empty', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('company');

    component.applyMinorCreditorValidation();
    fixture.detectChanges();

    const control = component.form.get('fsa_search_account_minor_creditors_minor_creditor_type');
    expect(control?.hasError('requiredCompanyMinorCreditorData')).toBeTrue();
  });

  it('should not set error if any company field is populated', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('company');
    component.form.get('fsa_search_account_minor_creditors_company_name')?.setValue('Example Ltd');

    component['applyMinorCreditorValidation']();

    const error = component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.errors;
    expect(error?.['requiredCompanyMinorCreditorData']).toBeFalsy();
  });

  it('should do nothing if minor creditor type is not set', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue(null);

    component.applyMinorCreditorValidation();
    fixture.detectChanges();

    expect(component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.errors).toBeNull();
  });

  it('should not throw if minor creditor type control is missing', () => {
    component.form = new FormGroup({}); // no controls
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (component as any)['handleMinorCreditorTypeChange']()).not.toThrow();
  });

  it('should remove required validator if last name is filled and first name is empty', () => {
    component.form.get('fsa_search_account_minor_creditors_minor_creditor_type')?.setValue('individual');
    component.form.get('fsa_search_account_minor_creditors_first_names')?.setValue('');
    component.form.get('fsa_search_account_minor_creditors_last_name')?.setValue('Smith');

    const hasRequired = component.form
      .get('fsa_search_account_minor_creditors_last_name')
      ?.hasValidator(Validators.required);

    expect(hasRequired).toBeFalse();
  });

  it('should not throw if setupMinorCreditorTypeChangeListener is called without type control', () => {
    component.form = new FormGroup({}); // No controls at all
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (component as any).setupMinorCreditorTypeChangeListener()).not.toThrow();
  });

  it('should return early if last name or first names controls are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_minor_creditors_minor_creditor_type: new FormControl('individual'),
      // deliberately exclude first_names or last_name
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => (component as any).handleLastNameConditionalValidation()).not.toThrow();
  });
});
