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
    // Provide required inputs used by the abstract base
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = {};
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = (component as any).fieldErrors ?? {};
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['handleConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if exact match or include aliases are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_companies_company_name: new FormControl('test'),
    });
    // Keep abstract inputs consistent when swapping the form mid-test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = (component as any).fieldErrors ?? {};
    component.formControlErrorMessages = component.formControlErrorMessages ?? {};
    fixture.detectChanges();

    expect(() => component['setupConditionalValidation']()).not.toThrow();
  });
});
