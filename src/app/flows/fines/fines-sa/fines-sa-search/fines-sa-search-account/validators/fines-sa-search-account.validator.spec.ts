import { FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneCriteriaValidator } from './fines-sa-search-account.validator';

describe('atLeastOneCriteriaValidator', () => {
  function createForm({
    accountNumber,
    referenceNumber,
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

    return new FormGroup(
      {
        fsa_search_account_number: new FormControl(accountNumber),
        fsa_search_account_reference_case_number: new FormControl(referenceNumber),
        fsa_search_account_individuals_search_criteria: makeGroup(individuals),
        fsa_search_account_companies_search_criteria: makeGroup(companies),
        fsa_search_account_minor_creditors_search_criteria: makeGroup(minorCreditors),
        fsa_search_account_major_creditor_search_criteria: makeGroup(majorCreditors),
      },
      { validators: atLeastOneCriteriaValidator },
    );
  }

  it('should return null if the control is not a FormGroup', () => {
    const control = new FormControl('some value');
    expect(atLeastOneCriteriaValidator(control)).toBeNull();
  });

  it('should return { formEmpty: true } if all criteria are empty', () => {
    const form = createForm({});
    expect(atLeastOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should return null if only account number is populated', () => {
    const form = createForm({ accountNumber: '123' });
    expect(atLeastOneCriteriaValidator(form)).toBeNull();
  });

  it('should return null if only reference number is populated', () => {
    const form = createForm({ referenceNumber: 'ABC' });
    expect(atLeastOneCriteriaValidator(form)).toBeNull();
  });

  it('should return null if only one nested group is populated', () => {
    const form = createForm({ individuals: 'John Doe' });
    expect(atLeastOneCriteriaValidator(form)).toBeNull();
  });

  it('should return { atLeastOneCriteriaRequired: true } if two criteria are populated', () => {
    const form = createForm({ accountNumber: '123', referenceNumber: 'ABC' });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if account number and a nested group are populated', () => {
    const form = createForm({ accountNumber: '123', companies: 'Acme Corp' });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if two nested groups are populated', () => {
    const form = createForm({ individuals: 'Jane', companies: 'Acme' });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return null if only one deeply nested value is non-empty (ignoring whitespace)', () => {
    const form = createForm({ majorCreditors: '   value   ' });
    expect(atLeastOneCriteriaValidator(form)).toBeNull();
  });

  it('should treat whitespace-only values as empty', () => {
    const form = createForm({ accountNumber: '   ' });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should ignore validation if any nested group is invalid', () => {
    const form = createForm({ accountNumber: '123', individuals: 'Jane', nestedValid: false });
    // One nested group is invalid, so validator should return null (defer)
    expect(atLeastOneCriteriaValidator(form)).toBeNull();
  });

  it('should handle null and undefined values as empty', () => {
    const form = createForm({ accountNumber: null, referenceNumber: undefined });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });

  it('should handle all nested groups missing (not FormGroup) gracefully', () => {
    // Remove nested groups
    const form = new FormGroup({
      fsa_search_account_number: new FormControl(''),
      fsa_search_account_reference_case_number: new FormControl(''),
    });
    expect(atLeastOneCriteriaValidator(form)).toEqual({ formEmpty: true });
  });
});
