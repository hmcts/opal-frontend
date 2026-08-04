import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finesSaOneCriteriaValidator } from './fines-sa-search-account.validator';
import { describe, expect, it } from 'vitest';

function createForm({
  accountNumber,
  referenceNumber,
  nationalInsuranceNumber,
  individuals,
  companies,
  minorCreditors,
  majorCreditors,
  nestedValid = true,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accountNumber?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  referenceNumber?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nationalInsuranceNumber?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  individuals?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  companies?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  minorCreditors?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  majorCreditors?: any;
  nestedValid?: boolean;
}) {
  // Helper to create nested group with optional validity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeGroup = (value: any) =>
    new FormGroup({ field: new FormControl(value, nestedValid ? [] : [Validators.required]) });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeIndividualsGroup = (value: any) =>
    new FormGroup({
      field: new FormControl(value, nestedValid ? [] : [Validators.required]),
      fsa_search_account_individuals_national_insurance_number: new FormControl(nationalInsuranceNumber),
      fsa_search_account_individuals_last_name: new FormControl(value),
      fsa_search_account_individuals_last_name_exact_match: new FormControl(null),
      fsa_search_account_individuals_first_names: new FormControl(null),
      fsa_search_account_individuals_first_names_exact_match: new FormControl(null),
      fsa_search_account_individuals_include_aliases: new FormControl(null),
      fsa_search_account_individuals_date_of_birth: new FormControl(null),
      fsa_search_account_individuals_address_line_1: new FormControl(null),
      fsa_search_account_individuals_post_code: new FormControl(null),
    });

  return new FormGroup(
    {
      fsa_search_account_number: new FormControl(accountNumber),
      fsa_search_account_reference_case_number: new FormControl(referenceNumber),
      fsa_search_account_individuals_search_criteria: makeIndividualsGroup(individuals),
      fsa_search_account_companies_search_criteria: makeGroup(companies),
      fsa_search_account_minor_creditors_search_criteria: makeGroup(minorCreditors),
      fsa_search_account_major_creditors_search_criteria: makeGroup(majorCreditors),
    },
    { validators: finesSaOneCriteriaValidator },
  );
}

describe('finesSaOneCriteriaValidator', () => {
  it('should return null if the control is not a FormGroup', () => {
    const control = new FormControl('some value');
    expect(finesSaOneCriteriaValidator(control)).toBeNull();
  });

  it('should return { formEmpty: true } if all criteria are empty', () => {
    const form = createForm({});
    expect(finesSaOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should return null if only account number is populated', () => {
    const form = createForm({ accountNumber: '123' });
    expect(finesSaOneCriteriaValidator(form)).toBeNull();
  });

  it('should return null if only reference number is populated', () => {
    const form = createForm({ referenceNumber: 'ABC' });
    expect(finesSaOneCriteriaValidator(form)).toBeNull();
  });

  it('should return null if only national insurance number is populated', () => {
    const form = createForm({ nationalInsuranceNumber: 'QQ123456C' });
    expect(finesSaOneCriteriaValidator(form)).toBeNull();
  });

  it('should return null if only one nested group is populated', () => {
    const form = createForm({ individuals: 'John Doe' });
    expect(finesSaOneCriteriaValidator(form)).toBeNull();
  });

  it('should return { atLeastOneCriteriaRequired: true } if two criteria are populated', () => {
    const form = createForm({ accountNumber: '123', referenceNumber: 'ABC' });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if account number and individuals group are populated', () => {
    const form = createForm({ accountNumber: '123', individuals: 'Acme Corp' });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if national insurance number and individuals group are populated', () => {
    const form = createForm({ nationalInsuranceNumber: 'QQ123456C', individuals: 'Jane' });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if two non-individual nested groups are populated', () => {
    const form = createForm({ individuals: 'Jane', companies: 'Acme' });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return null if only one non-individual nested value is non-empty (ignoring whitespace)', () => {
    const form = createForm({ majorCreditors: '   value   ' });
    expect(finesSaOneCriteriaValidator(form)).toBeNull();
  });

  it('should treat whitespace-only values as empty', () => {
    const form = createForm({ accountNumber: '   ' });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should ignore validation if any nested group is invalid', () => {
    const form = createForm({ accountNumber: '123', individuals: 'Jane', nestedValid: false });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should handle null and undefined values as empty', () => {
    const form = createForm({ accountNumber: null, referenceNumber: undefined });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should handle all nested groups missing (not FormGroup) gracefully', () => {
    // Remove nested groups
    const form = new FormGroup({
      fsa_search_account_number: new FormControl(''),
      fsa_search_account_reference_case_number: new FormControl(''),
    });
    expect(finesSaOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });
});
