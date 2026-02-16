import { FormGroup, FormControl } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { exclusiveSearchFieldValidator } from './fines-con-search-account.validator';

describe('exclusiveSearchFieldValidator', () => {
  it('should return null when exactly one individuals criterion is provided', () => {
    const formGroup = new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl('Smith'),
      fcon_search_account_individuals_first_names: new FormControl(null),
      fcon_search_account_individuals_date_of_birth: new FormControl(null),
    });

    const validator = exclusiveSearchFieldValidator();
    expect(validator(formGroup)).toBeNull();
  });

  it('should return error when no criteria are provided', () => {
    const formGroup = new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl(null),
      fcon_search_account_individuals_first_names: new FormControl(null),
      fcon_search_account_individuals_date_of_birth: new FormControl(null),
    });

    const validator = exclusiveSearchFieldValidator();
    expect(validator(formGroup)).toEqual({ formEmpty: true });
  });

  it('should return null when first names criterion is provided', () => {
    const formGroup = new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl(null),
      fcon_search_account_individuals_first_names: new FormControl('John'),
      fcon_search_account_individuals_date_of_birth: new FormControl(null),
    });

    const validator = exclusiveSearchFieldValidator();
    expect(validator(formGroup)).toBeNull();
  });

  it('should return null when date of birth criterion is provided', () => {
    const formGroup = new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl(null),
      fcon_search_account_individuals_first_names: new FormControl(null),
      fcon_search_account_individuals_date_of_birth: new FormControl('01/01/1990'),
    });

    const validator = exclusiveSearchFieldValidator();
    expect(validator(formGroup)).toBeNull();
  });

  it('should return null when control is not a FormGroup', () => {
    const formControl = new FormControl('test');

    const validator = exclusiveSearchFieldValidator();
    expect(validator(formControl)).toBeNull();
  });
});
