import { FormControl, FormGroup, Validators } from '@angular/forms';
import { consolidateSearchAccountFormValidator } from '@app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/fines-con-search-account-form/validators/fines-con-search-account-form.validator';
import { describe, expect, it } from 'vitest';

function createForm({
  accountNumber,
  nationalInsuranceNumber,
  individuals,
  nestedValid = true,
}: {
  accountNumber?: string | null;
  nationalInsuranceNumber?: string | null;
  individuals?: string | null;
  nestedValid?: boolean;
}) {
  return new FormGroup(
    {
      fcon_search_account_number: new FormControl(accountNumber),
      fcon_search_account_national_insurance_number: new FormControl(nationalInsuranceNumber),
      fcon_search_account_individuals_search_criteria: new FormGroup({
        field: new FormControl(individuals, nestedValid ? [] : [Validators.required]),
      }),
    },
    { validators: consolidateSearchAccountFormValidator },
  );
}

describe('consolidateSearchAccountFormValidator', () => {
  it('should return null if the control is not a FormGroup', () => {
    const control = new FormControl('some value');
    expect(consolidateSearchAccountFormValidator(control)).toBeNull();
  });

  it('should return { formEmpty: true } if all criteria are empty', () => {
    const form = createForm({});
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ formEmpty: true });
  });

  it('should return null if only account number is populated', () => {
    const form = createForm({ accountNumber: '123456789' });
    expect(consolidateSearchAccountFormValidator(form)).toBeNull();
  });

  it('should return null if only national insurance number is populated', () => {
    const form = createForm({ nationalInsuranceNumber: 'AB123456C' });
    expect(consolidateSearchAccountFormValidator(form)).toBeNull();
  });

  it('should return null if only individuals group is populated', () => {
    const form = createForm({ individuals: 'John Smith' });
    expect(consolidateSearchAccountFormValidator(form)).toBeNull();
  });

  it('should return { atLeastOneCriteriaRequired: true } if account number and national insurance are populated', () => {
    const form = createForm({ accountNumber: '123456789', nationalInsuranceNumber: 'AB123456C' });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if account number and individuals group are populated', () => {
    const form = createForm({ accountNumber: '123456789', individuals: 'John Smith' });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should return { atLeastOneCriteriaRequired: true } if national insurance and individuals group are populated', () => {
    const form = createForm({ nationalInsuranceNumber: 'AB123456C', individuals: 'John Smith' });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });

  it('should treat whitespace-only values as empty', () => {
    const form = createForm({ accountNumber: '   ', nationalInsuranceNumber: '   ' });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ formEmpty: true });
  });

  it('should handle null and undefined values as empty', () => {
    const form = createForm({ accountNumber: null, nationalInsuranceNumber: undefined });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ formEmpty: true });
  });

  it('should still count populated criteria when nested group is invalid', () => {
    const form = createForm({ accountNumber: '123456789', individuals: 'John Smith', nestedValid: false });
    expect(consolidateSearchAccountFormValidator(form)).toEqual({ atLeastOneCriteriaRequired: true });
  });
});
