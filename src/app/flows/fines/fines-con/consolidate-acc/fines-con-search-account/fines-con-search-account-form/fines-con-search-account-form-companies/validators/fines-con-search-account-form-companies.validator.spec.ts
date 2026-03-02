import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { finesConSearchAccountFormCompaniesValidator } from './fines-con-search-account-form-companies.validator';

function createCompaniesGroup(overrides?: Partial<Record<string, unknown>>) {
  return new FormGroup({
    fcon_search_account_companies_company_name: new FormControl<string | null>(
      (overrides?.['fcon_search_account_companies_company_name'] as string | null) ?? null,
    ),
    fcon_search_account_companies_company_name_exact_match: new FormControl<boolean>(
      (overrides?.['fcon_search_account_companies_company_name_exact_match'] as boolean) ?? false,
    ),
    fcon_search_account_companies_include_aliases: new FormControl<boolean>(
      (overrides?.['fcon_search_account_companies_include_aliases'] as boolean) ?? false,
    ),
    fcon_search_account_companies_address_line_1: new FormControl<string | null>(
      (overrides?.['fcon_search_account_companies_address_line_1'] as string | null) ?? null,
    ),
    fcon_search_account_companies_post_code: new FormControl<string | null>(
      (overrides?.['fcon_search_account_companies_post_code'] as string | null) ?? null,
    ),
  });
}

describe('finesConSearchAccountFormCompaniesValidator', () => {
  it('should return null for non-FormGroup control', () => {
    const control = new FormControl('value');

    expect(finesConSearchAccountFormCompaniesValidator(control)).toBeNull();
  });

  it('should require company name when exact match is checked', () => {
    const group = createCompaniesGroup({
      fcon_search_account_companies_company_name_exact_match: true,
      fcon_search_account_companies_company_name: null,
    });

    finesConSearchAccountFormCompaniesValidator(group);

    expect(group.get('fcon_search_account_companies_company_name')?.hasError('required')).toBe(true);
  });

  it('should require company name when include aliases is checked', () => {
    const group = createCompaniesGroup({
      fcon_search_account_companies_include_aliases: true,
      fcon_search_account_companies_company_name: null,
    });

    finesConSearchAccountFormCompaniesValidator(group);

    expect(group.get('fcon_search_account_companies_company_name')?.hasError('required')).toBe(true);
  });

  it('should not show required error when company name has value and exact match is checked', () => {
    const group = createCompaniesGroup({
      fcon_search_account_companies_company_name_exact_match: true,
      fcon_search_account_companies_company_name: 'Acme Ltd',
    });

    finesConSearchAccountFormCompaniesValidator(group);

    expect(group.get('fcon_search_account_companies_company_name')?.hasError('required')).toBe(false);
  });

  it('should clear conditional required from company name when triggers are removed', () => {
    const group = createCompaniesGroup({
      fcon_search_account_companies_include_aliases: true,
      fcon_search_account_companies_company_name: null,
    });

    finesConSearchAccountFormCompaniesValidator(group);
    expect(group.get('fcon_search_account_companies_company_name')?.hasError('required')).toBe(true);

    group.get('fcon_search_account_companies_include_aliases')?.setValue(false);
    finesConSearchAccountFormCompaniesValidator(group);

    expect(group.get('fcon_search_account_companies_company_name')?.hasError('required')).toBe(false);
  });
});
