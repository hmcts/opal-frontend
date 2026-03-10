import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { finesSaSearchAccountFormCompaniesValidator } from './fines-sa-search-account-form-companies.validator';

function createCompaniesGroup(overrides?: Partial<Record<string, unknown>>) {
  return new FormGroup({
    fsa_search_account_companies_company_name: new FormControl<string | null>(
      (overrides?.['fsa_search_account_companies_company_name'] as string | null) ?? null,
    ),
    fsa_search_account_companies_company_name_exact_match: new FormControl<boolean>(
      (overrides?.['fsa_search_account_companies_company_name_exact_match'] as boolean) ?? false,
    ),
    fsa_search_account_companies_include_aliases: new FormControl<boolean>(
      (overrides?.['fsa_search_account_companies_include_aliases'] as boolean) ?? false,
    ),
    fsa_search_account_companies_address_line_1: new FormControl<string | null>(
      (overrides?.['fsa_search_account_companies_address_line_1'] as string | null) ?? null,
    ),
    fsa_search_account_companies_post_code: new FormControl<string | null>(
      (overrides?.['fsa_search_account_companies_post_code'] as string | null) ?? null,
    ),
  });
}

describe('finesSaSearchAccountFormCompaniesValidator', () => {
  it('should return null for non-FormGroup control', () => {
    const control = new FormControl('value');

    expect(finesSaSearchAccountFormCompaniesValidator(control)).toBeNull();
  });

  it('should require company name when exact match is checked', () => {
    const group = createCompaniesGroup({
      fsa_search_account_companies_company_name_exact_match: true,
      fsa_search_account_companies_company_name: null,
    });

    finesSaSearchAccountFormCompaniesValidator(group);

    expect(group.get('fsa_search_account_companies_company_name')?.hasError('required')).toBe(true);
  });

  it('should require company name when include aliases is checked', () => {
    const group = createCompaniesGroup({
      fsa_search_account_companies_include_aliases: true,
      fsa_search_account_companies_company_name: null,
    });

    finesSaSearchAccountFormCompaniesValidator(group);

    expect(group.get('fsa_search_account_companies_company_name')?.hasError('required')).toBe(true);
  });

  it('should not show required error when company name has value and exact match is checked', () => {
    const group = createCompaniesGroup({
      fsa_search_account_companies_company_name_exact_match: true,
      fsa_search_account_companies_company_name: 'Acme Ltd',
    });

    finesSaSearchAccountFormCompaniesValidator(group);

    expect(group.get('fsa_search_account_companies_company_name')?.hasError('required')).toBe(false);
  });

  it('should clear conditional required from company name when triggers are removed', () => {
    const group = createCompaniesGroup({
      fsa_search_account_companies_include_aliases: true,
      fsa_search_account_companies_company_name: null,
    });

    finesSaSearchAccountFormCompaniesValidator(group);
    expect(group.get('fsa_search_account_companies_company_name')?.hasError('required')).toBe(true);

    group.get('fsa_search_account_companies_include_aliases')?.setValue(false);
    finesSaSearchAccountFormCompaniesValidator(group);

    expect(group.get('fsa_search_account_companies_company_name')?.hasError('required')).toBe(false);
  });
});
