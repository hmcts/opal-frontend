import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesSaSearchAccountFormIndividualsComponent } from './fines-sa-search-account-form-individuals.component';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS } from './constants/fines-sa-search-account-form-individuals-controls.constant';

describe('FinesSaSearchAccountFormIndividualsComponent', () => {
  let component: FinesSaSearchAccountFormIndividualsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormIndividualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormIndividualsComponent, ReactiveFormsModule],
      providers: [DateService],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormIndividualsComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup(FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS);
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set yesterday date on init', () => {
    expect(component.yesterday).toBeTruthy();
  });

  it('should not require last name if first name and dob are empty', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should require last name if first name is populated', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('John');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require last name if date of birth is populated', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('2000-01-01');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should not require last name if both first name and dob are empty', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should skip validation logic if controls are missing', () => {
    component.form = new FormGroup({
      // only some controls
      fsa_search_account_individuals_first_names: new FormControl('test'),
      // missing dob and last name
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    expect(() => component['handleLastNameConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if first names or dob controls are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_individuals_last_name: new FormControl('Smith'),
      // missing both first name and dob
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    expect(() => component['setupConditionalLastNameValidation']()).not.toThrow();
  });
});
