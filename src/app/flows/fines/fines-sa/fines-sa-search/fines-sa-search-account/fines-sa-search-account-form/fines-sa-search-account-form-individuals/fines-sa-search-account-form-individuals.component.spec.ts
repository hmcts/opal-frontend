import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesSaSearchAccountFormIndividualsComponent } from './fines-sa-search-account-form-individuals.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesSaSearchAccountFormIndividualsComponent', () => {
  let component: FinesSaSearchAccountFormIndividualsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormIndividualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormIndividualsComponent, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: { fragment: of('individuals'), parent: 'search' } },
        DateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormIndividualsComponent);
    component = fixture.componentInstance;

    // Provide an empty parent FormGroup; the component under test will add its own controls in ngOnInit
    component.form = new FormGroup({});
    // Provide the required inputs expected by the abstract base
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = {};
    component.formControlErrorMessages = {};

    // Trigger ngOnInit so controls are installed into the empty group
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set yesterday date on init', () => {
    expect(component.yesterday).toBeTruthy();
  });

  it('should not require last name if first name and dob are empty and exact match and include aliases are set to false', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name_exact_match')?.setValue(false);
    component.form.get('fsa_search_account_individuals_include_aliases')?.setValue(false);
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
    component.form.get('fsa_search_account_individuals_last_name_exact_match')?.setValue(false);
    component.form.get('fsa_search_account_individuals_include_aliases')?.setValue(false);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should require first name if firstNamesExactMatch is set and first name is empty', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component['handleConditionalValidation']();
    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_first_names')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require last name if lastNameExactMatch is set and last name is empty', () => {
    component.form.get('fsa_search_account_individuals_last_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component['handleConditionalValidation']();
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require last name if includeAliases is set and last name is empty', () => {
    component.form.get('fsa_search_account_individuals_include_aliases')?.setValue(true);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component['handleConditionalValidation']();
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require last name when first name is a non-string value (covers non-string branch of hasValue)', () => {
    // Force a non-string value into first names to hit the `: true` ternary branch
    const fnCtrl = component.form.get('fsa_search_account_individuals_first_names') as FormControl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fnCtrl.setValue(0 as any); // number, not string
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');

    component['handleConditionalValidation']();
    fnCtrl.updateValueAndValidity();
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should NOT require first names when exact match is true but first names already contain a value', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('Jane');

    component['handleConditionalValidation']();
    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_first_names')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should treat whitespace-only first names as empty and require when exact match is true', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('   ');

    component['handleConditionalValidation']();
    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_individuals_first_names')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should skip validation logic if controls are missing', () => {
    component.form = new FormGroup({
      // only some controls
      fsa_search_account_individuals_first_names: new FormControl('test'),
      // missing dob and last name
      fsa_search_account_individuals_last_name: new FormControl(''),
      // missing date_of_birth and other optional controls
    });
    // keep inputs consistent when swapping the form mid-test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = (component as any).fieldErrors ?? {};
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['handleConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if first names or dob controls or other validators are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_individuals_last_name: new FormControl('Smith'),
      // missing both first name and dob and other controls
    });
    // keep inputs consistent when swapping the form mid-test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = (component as any).fieldErrors ?? {};
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['setupConditionalValidation']()).not.toThrow();
  });
});
