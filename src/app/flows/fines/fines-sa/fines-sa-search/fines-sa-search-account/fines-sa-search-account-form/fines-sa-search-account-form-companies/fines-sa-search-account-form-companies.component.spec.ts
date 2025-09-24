import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinesSaSearchAccountFormCompaniesComponent } from './fines-sa-search-account-form-companies.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesSaSearchAccountFormCompaniesComponent', () => {
  let component: FinesSaSearchAccountFormCompaniesComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormCompaniesComponent, ReactiveFormsModule],
      providers: [{ provide: ActivatedRoute, useValue: { fragment: of('companies'), parent: 'search' } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormCompaniesComponent);
    component = fixture.componentInstance;

    // Provide an empty parent FormGroup; the subcomponent installs its controls in ngOnInit
    component.form = new FormGroup({});
    component.formControlErrorMessages = {};

    // Trigger ngOnInit -> installs controls, registers errors, sets up subscriptions
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not require company name if exact match or include aliases are false', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(false);
    component.form.get('fsa_search_account_companies_include_aliases')?.setValue(false);
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should require company name if exact match is set to true and company name is empty', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require company name if add aliases is set to true', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_include_aliases')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require company name if both add aliases and exact match are true', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_include_aliases')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.setValue('');
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should NOT require company name when a non-empty value is present even if exact match is true', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('Acme Ltd');
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should treat whitespace-only as empty and require when exact match is true', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue('   ');
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should require company name when value is null and include aliases is true', () => {
    component.form.get('fsa_search_account_companies_company_name')?.setValue(null);
    component.form.get('fsa_search_account_companies_include_aliases')?.setValue(true);
    component.form.get('fsa_search_account_companies_company_name')?.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should treat non-string values as present and NOT require company name even if flags are true', () => {
    // Force a non-string value into the control to cover the ternary branch `: true`
    const ctrl = component.form.get('fsa_search_account_companies_company_name') as FormControl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctrl.setValue(0 as any); // number, not string/null
    component.form.get('fsa_search_account_companies_company_name_exact_match')?.setValue(true);
    component.form.get('fsa_search_account_companies_include_aliases')?.setValue(true);

    ctrl.updateValueAndValidity();

    expect(
      component.form.get('fsa_search_account_companies_company_name')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should skip validation logic if controls are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_companies_company_name: new FormControl('test'),
    });
    // Keep abstract inputs consistent when swapping the form mid-test
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['handleConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if exact match or include aliases are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_companies_company_name: new FormControl('test'),
    });
    // Keep abstract inputs consistent when swapping the form mid-test
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['setupConditionalValidation']()).not.toThrow();
  });

  it('should install its controls into the provided FormGroup on init', () => {
    const names = [
      'fsa_search_account_companies_company_name',
      'fsa_search_account_companies_company_name_exact_match',
      'fsa_search_account_companies_include_aliases',
      'fsa_search_account_companies_address_line_1',
      'fsa_search_account_companies_post_code',
    ];
    names.forEach((n) => expect(component.form.get(n)).withContext(n).toBeTruthy());
  });

  it('should remove its installed controls on destroy when nested in a parent group', () => {
    // Recreate an isolated child group and nest it under a parent to ensure `form.parent` is truthy
    const child = new FormGroup({});
    const parent = new FormGroup({ fsa_search_account_companies_search_criteria: child });

    component.form = child;
    component.formControlErrorMessages = {};
    fixture.detectChanges(); // triggers ngOnInit -> installs controls
    component.ngOnInit();

    // Sanity check: controls are present
    expect(child.get('fsa_search_account_companies_company_name')).toBeTruthy();

    // Destroy and ensure controls are removed from the child group
    component.ngOnDestroy();

    const names = Object.keys(child.controls);
    expect(names).withContext('expected no controls after destroy').toEqual([]);
    // parent still has the child group placeholder
    expect(parent.get('fsa_search_account_companies_search_criteria')).toBe(child);
  });
});
