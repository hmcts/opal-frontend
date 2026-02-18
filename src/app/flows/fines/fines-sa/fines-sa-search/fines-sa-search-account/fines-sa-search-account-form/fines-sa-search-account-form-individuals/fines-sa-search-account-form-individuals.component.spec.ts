import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesSaSearchAccountFormIndividualsComponent } from './fines-sa-search-account-form-individuals.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesSaSearchAccountFormIndividualsComponent', () => {
  let component: FinesSaSearchAccountFormIndividualsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormIndividualsComponent>;
  let originalConfigureDatePicker: () => void;

  beforeAll(() => {
    originalConfigureDatePicker = MojDatePickerComponent.prototype.configureDatePicker;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(MojDatePickerComponent.prototype, 'configureDatePicker').mockImplementation(() => {});
  });

  afterAll(() => {
    MojDatePickerComponent.prototype.configureDatePicker = originalConfigureDatePicker;
  });

  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
  });

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

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      false,
    );
  });

  it('should require last name if first name is populated', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('John');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should require last name if date of birth is populated', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('2000-01-01');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should not require last name if both first name and dob are empty', () => {
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name_exact_match')?.setValue(false);
    component.form.get('fsa_search_account_individuals_include_aliases')?.setValue(false);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      false,
    );
  });

  it('should require first name if firstNamesExactMatch is set and first name is empty', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('');
    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_first_names')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should require last name if lastNameExactMatch is set and last name is empty', () => {
    component.form.get('fsa_search_account_individuals_last_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should require last name if includeAliases is set and last name is empty', () => {
    component.form.get('fsa_search_account_individuals_include_aliases')?.setValue(true);
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should require last name when first name is a non-string value', () => {
    const fnCtrl = component.form.get('fsa_search_account_individuals_first_names') as FormControl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fnCtrl.setValue(0 as any); // number, not string
    component.form.get('fsa_search_account_individuals_date_of_birth')?.setValue('');
    component.form.get('fsa_search_account_individuals_last_name')?.setValue('');

    fnCtrl.updateValueAndValidity();
    component.form.get('fsa_search_account_individuals_last_name')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_last_name')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should not show required error when exact match is true and first names already contain a value', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('Jane');

    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_first_names')?.hasError('required')).toBe(false);
  });

  it('should treat whitespace-only first names as empty and require when exact match is true', () => {
    component.form.get('fsa_search_account_individuals_first_names_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_individuals_first_names')?.setValue('   ');

    component.form.get('fsa_search_account_individuals_first_names')?.updateValueAndValidity();

    expect(component.form.get('fsa_search_account_individuals_first_names')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should install its controls into the provided FormGroup on init', () => {
    const names = [
      'fsa_search_account_individuals_last_name',
      'fsa_search_account_individuals_last_name_exact_match',
      'fsa_search_account_individuals_first_names',
      'fsa_search_account_individuals_first_names_exact_match',
      'fsa_search_account_individuals_include_aliases',
      'fsa_search_account_individuals_date_of_birth',
      'fsa_search_account_individuals_national_insurance_number',
      'fsa_search_account_individuals_address_line_1',
      'fsa_search_account_individuals_post_code',
    ];
    names.forEach((n) => expect(component.form.get(n), n).toBeTruthy());
  });

  it('should remove its installed controls on destroy when nested in a parent group', () => {
    // Recreate an isolated child group and nest it under a parent to ensure `form.parent` is truthy
    const child = new FormGroup({});
    const parent = new FormGroup({ fsa_search_account_individuals_search_criteria: child });

    component.form = child;
    component.formControlErrorMessages = {};
    fixture.detectChanges(); // triggers ngOnInit -> installs controls
    component.ngOnInit();

    // Sanity check: controls are present
    expect(child.get('fsa_search_account_individuals_last_name')).toBeTruthy();

    // Destroy and ensure controls are removed from the child group
    component.ngOnDestroy();

    const names = Object.keys(child.controls);
    expect(names, 'expected no controls after destroy').toEqual([]);
    // parent still has the child group placeholder
    expect(parent.get('fsa_search_account_individuals_search_criteria')).toBe(child);
  });
});
