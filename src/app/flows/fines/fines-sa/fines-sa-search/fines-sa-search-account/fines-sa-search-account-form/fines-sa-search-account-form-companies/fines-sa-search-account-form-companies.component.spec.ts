import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinesSaSearchAccountFormCompaniesComponent } from './fines-sa-search-account-form-companies.component';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS } from './constants/fines-sa-search-account-form-companies-controls.constant';
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

    component.form = new FormGroup(FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS);
    component.formControlErrorMessages = {};

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

  it('should skip validation logic if controls are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_companies_company_name: new FormControl('test'),
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    expect(() => component['handleConditionalValidation']()).not.toThrow();
  });

  it('should skip setup if exact match or include aliases are missing', () => {
    component.form = new FormGroup({
      fsa_search_account_companies_company_name: new FormControl('test'),
    });
    component.formControlErrorMessages = {};
    fixture.detectChanges();

    expect(() => component['setupConditionalValidation']()).not.toThrow();
  });
});
