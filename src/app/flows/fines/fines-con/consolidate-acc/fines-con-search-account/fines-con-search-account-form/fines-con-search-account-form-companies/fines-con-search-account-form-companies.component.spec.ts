import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinesConSearchAccountFormCompaniesComponent } from './fines-con-search-account-form-companies.component';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FinesConStore } from '../../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../../stores/types/fines-con-store.type';
import { FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_MOCK } from '../../mocks/fines-con-search-account-form-companies.mock';

describe('FinesConSearchAccountFormCompaniesComponent', () => {
  let component: FinesConSearchAccountFormCompaniesComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormCompaniesComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesConSearchAccountFormCompaniesComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountFormCompaniesComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);

    finesConStore.updateSearchAccountFormTemporary(FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_MOCK.formData);

    component.form = new FormGroup({
      fcon_search_account_companies_search_criteria: new FormGroup({}),
    });
    component.formControlErrorMessages = {} as IAbstractFormControlErrorMessage;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all companies nested form controls', () => {
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name'),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match',
      ),
    ).toBeTruthy();
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_include_aliases'),
    ).toBeTruthy();
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1'),
    ).toBeTruthy();
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code'),
    ).toBeTruthy();
  });

  it('should rehydrate companies criteria values from store after control setup', () => {
    const mockData =
      FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_MOCK.formData.fcon_search_account_companies_search_criteria!;
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
        ?.value,
    ).toBe(mockData.fcon_search_account_companies_company_name);
    expect(
      component.form.get(
        'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match',
      )?.value,
    ).toBe(mockData.fcon_search_account_companies_company_name_exact_match);
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1')
        ?.value,
    ).toBe(mockData.fcon_search_account_companies_address_line_1);
    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code')
        ?.value,
    ).toBe(mockData.fcon_search_account_companies_post_code);
  });

  it('should require company name when exact match flag is set', () => {
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
      ?.setValue(null);
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match')
      ?.setValue(true);

    expect(
      component.form
        .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
        ?.hasError('required'),
    ).toBe(true);
  });

  it('should require company name when include aliases flag is set', () => {
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
      ?.setValue(null);
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_include_aliases')
      ?.setValue(true);

    expect(
      component.form
        .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
        ?.hasError('required'),
    ).toBe(true);
  });

  it('should not require company name when both flags are false', () => {
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
      ?.setValue(null);
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match')
      ?.setValue(false);
    component.form
      .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_include_aliases')
      ?.setValue(false);

    expect(
      component.form
        .get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
        ?.hasError('required'),
    ).toBe(false);
  });

  it('should validate company name with letters spaces hyphens and apostrophes pattern', () => {
    const companyNameControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name',
    );

    companyNameControl?.setValue("Valid-Company Name's Ltd");
    expect(companyNameControl?.hasError('lettersWithSpacesHyphensApostrophesPattern')).toBe(false);

    companyNameControl?.setValue('Invalid123Company');
    expect(companyNameControl?.hasError('lettersWithSpacesHyphensApostrophesPattern')).toBe(true);
  });

  it('should validate company name max length of 50 characters', () => {
    const companyNameControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name',
    );

    companyNameControl?.setValue('a'.repeat(50));
    expect(companyNameControl?.hasError('maxlength')).toBe(false);

    companyNameControl?.setValue('a'.repeat(51));
    expect(companyNameControl?.hasError('maxlength')).toBe(true);
  });

  it('should validate address line 1 with alphanumeric hyphens apostrophes and spaces pattern', () => {
    const addressControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1',
    );

    addressControl?.setValue('123 Main Street-North');
    expect(addressControl?.hasError('alphanumericTextPattern')).toBe(false);

    addressControl?.setValue('123 Main St &');
    expect(addressControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate address line 1 max length of 30 characters', () => {
    const addressControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1',
    );

    addressControl?.setValue('a'.repeat(30));
    expect(addressControl?.hasError('maxlength')).toBe(false);

    addressControl?.setValue('a'.repeat(31));
    expect(addressControl?.hasError('maxlength')).toBe(true);
  });

  it('should validate postcode with alphanumeric hyphens apostrophes and spaces pattern', () => {
    const postcodeControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code',
    );

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A@1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate postcode max length of 8 characters', () => {
    const postcodeControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code',
    );

    postcodeControl?.setValue('SW1A1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AAA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should set input value and trigger conditional validation for nested control path', () => {
    component['setInputValue'](
      'XYZ Industries',
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name',
    );

    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name')
        ?.value,
    ).toBe('XYZ Industries');
  });

  it('should set address line 1 value via setInputValue', () => {
    component['setInputValue'](
      '456 Commerce Street',
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1',
    );

    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_address_line_1')
        ?.value,
    ).toBe('456 Commerce Street');
  });

  it('should set postcode value via setInputValue', () => {
    component['setInputValue'](
      'M1 1AA',
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code',
    );

    expect(
      component.form.get('fcon_search_account_companies_search_criteria.fcon_search_account_companies_post_code')
        ?.value,
    ).toBe('M1 1AA');
  });

  it('should toggle exact match checkbox value', () => {
    const exactMatchControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match',
    );

    exactMatchControl?.setValue(true);
    expect(exactMatchControl?.value).toBe(true);

    exactMatchControl?.setValue(false);
    expect(exactMatchControl?.value).toBe(false);
  });

  it('should toggle include aliases checkbox value', () => {
    const includeAliasesControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_include_aliases',
    );

    includeAliasesControl?.setValue(true);
    expect(includeAliasesControl?.value).toBe(true);

    includeAliasesControl?.setValue(false);
    expect(includeAliasesControl?.value).toBe(false);
  });

  it('should remove required validation from company name when both flags are set to false', () => {
    const companyNameControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name',
    );
    const exactMatchControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_company_name_exact_match',
    );
    const includeAliasesControl = component.form.get(
      'fcon_search_account_companies_search_criteria.fcon_search_account_companies_include_aliases',
    );

    exactMatchControl?.setValue(true);
    companyNameControl?.setValue(null);
    expect(companyNameControl?.hasError('required')).toBe(true);

    exactMatchControl?.setValue(false);
    includeAliasesControl?.setValue(false);
    expect(companyNameControl?.hasError('required')).toBe(false);
  });
});
