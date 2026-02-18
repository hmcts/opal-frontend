import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { finesSaSearchAccountFormIndividualsValidator } from './fines-sa-search-account-form-individuals.validator';

function createIndividualsGroup(overrides?: Partial<Record<string, unknown>>) {
  return new FormGroup({
    fsa_search_account_individuals_last_name: new FormControl<string | null>(
      (overrides?.['fsa_search_account_individuals_last_name'] as string | null) ?? null,
    ),
    fsa_search_account_individuals_last_name_exact_match: new FormControl<boolean>(
      (overrides?.['fsa_search_account_individuals_last_name_exact_match'] as boolean) ?? false,
    ),
    fsa_search_account_individuals_first_names: new FormControl<string | null>(
      (overrides?.['fsa_search_account_individuals_first_names'] as string | null) ?? null,
    ),
    fsa_search_account_individuals_first_names_exact_match: new FormControl<boolean>(
      (overrides?.['fsa_search_account_individuals_first_names_exact_match'] as boolean) ?? false,
    ),
    fsa_search_account_individuals_include_aliases: new FormControl<boolean>(
      (overrides?.['fsa_search_account_individuals_include_aliases'] as boolean) ?? false,
    ),
    fsa_search_account_individuals_date_of_birth: new FormControl<string | null>(
      (overrides?.['fsa_search_account_individuals_date_of_birth'] as string | null) ?? null,
    ),
    fsa_search_account_individuals_address_line_1: new FormControl<string | null>(
      (overrides?.['fsa_search_account_individuals_address_line_1'] as string | null) ?? null,
    ),
    fsa_search_account_individuals_post_code: new FormControl<string | null>(
      (overrides?.['fsa_search_account_individuals_post_code'] as string | null) ?? null,
    ),
  });
}

describe('finesSaSearchAccountFormIndividualsValidator', () => {
  it('should return null for non-FormGroup control', () => {
    const control = new FormControl('value');

    expect(finesSaSearchAccountFormIndividualsValidator(control)).toBeNull();
  });

  it('should require last name when first names is populated', () => {
    const group = createIndividualsGroup({
      fsa_search_account_individuals_first_names: 'Jane',
      fsa_search_account_individuals_last_name: null,
    });

    finesSaSearchAccountFormIndividualsValidator(group);

    expect(group.get('fsa_search_account_individuals_last_name')?.hasError('required')).toBe(true);
  });

  it('should require last name when include aliases is checked', () => {
    const group = createIndividualsGroup({
      fsa_search_account_individuals_include_aliases: true,
      fsa_search_account_individuals_last_name: null,
    });

    finesSaSearchAccountFormIndividualsValidator(group);

    expect(group.get('fsa_search_account_individuals_last_name')?.hasError('required')).toBe(true);
  });

  it('should require first names when first names exact match is checked', () => {
    const group = createIndividualsGroup({
      fsa_search_account_individuals_first_names_exact_match: true,
      fsa_search_account_individuals_first_names: null,
    });

    finesSaSearchAccountFormIndividualsValidator(group);

    expect(group.get('fsa_search_account_individuals_first_names')?.hasError('required')).toBe(true);
  });

  it('should clear conditional required from last name when triggers are removed', () => {
    const group = createIndividualsGroup({
      fsa_search_account_individuals_first_names: 'Jane',
      fsa_search_account_individuals_last_name: null,
    });

    finesSaSearchAccountFormIndividualsValidator(group);
    expect(group.get('fsa_search_account_individuals_last_name')?.hasError('required')).toBe(true);

    group.get('fsa_search_account_individuals_first_names')?.setValue(null);
    finesSaSearchAccountFormIndividualsValidator(group);

    expect(group.get('fsa_search_account_individuals_last_name')?.hasError('required')).toBe(false);
  });
});
