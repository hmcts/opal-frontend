import { FormGroup, FormControl } from '@angular/forms';
import { exclusiveSearchFieldValidator } from './fines-con-search-account-form-exclusive-field.validator';

describe('exclusiveSearchFieldValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      fcon_search_account_number: new FormControl(null),
      fcon_search_account_individuals_national_insurance_number: new FormControl(null),
      fcon_search_account_individuals_last_name: new FormControl(null),
      fcon_search_account_individuals_first_names: new FormControl(null),
      fcon_search_account_individuals_date_of_birth: new FormControl(null),
      fcon_search_account_individuals_address_line_1: new FormControl(null),
      fcon_search_account_individuals_post_code: new FormControl(null),
    });
  });

  describe('Account number exclusivity (AC6a)', () => {
    it('should return null when only account number is provided', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return error when account number is provided with last name', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with first names', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with date of birth', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with address', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_address_line_1')?.setValue('123 Main Street');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with postcode', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_post_code')?.setValue('SW1A 1AA');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with national insurance number', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error when account number is provided with multiple other fields', () => {
      formGroup.get('fcon_search_account_number')?.setValue('12345678');
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ accountNumberMustBeExclusive: true });
    });
  });

  describe('National Insurance number exclusivity (AC6b)', () => {
    it('should return null when only national insurance number is provided', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return error when national insurance number is provided with last name', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });

    it('should return error when national insurance number is provided with first names', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });

    it('should return error when national insurance number is provided with date of birth', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });

    it('should return error when national insurance number is provided with address', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_address_line_1')?.setValue('123 Main Street');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });

    it('should return error when national insurance number is provided with postcode', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_post_code')?.setValue('SW1A 1AA');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });

    it('should return error when national insurance number is provided with multiple other fields', () => {
      formGroup.get('fcon_search_account_individuals_national_insurance_number')?.setValue('AB123456C');
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
      formGroup.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toEqual({ nationalInsuranceNumberMustBeExclusive: true });
    });
  });

  describe('No conflicts', () => {
    it('should return null when no fields are provided', () => {
      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when only last name is provided', () => {
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when only first names is provided', () => {
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when only date of birth is provided', () => {
      formGroup.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when only address is provided', () => {
      formGroup.get('fcon_search_account_individuals_address_line_1')?.setValue('123 Main Street');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when only postcode is provided', () => {
      formGroup.get('fcon_search_account_individuals_post_code')?.setValue('SW1A 1AA');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when non-exclusive fields are combined (last name and first names)', () => {
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when non-exclusive fields are combined (last name, first names, and DOB)', () => {
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
      formGroup.get('fcon_search_account_individuals_first_names')?.setValue('John');
      formGroup.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });

    it('should return null when non-exclusive fields are combined with address and postcode', () => {
      formGroup.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
      formGroup.get('fcon_search_account_individuals_address_line_1')?.setValue('123 Main Street');
      formGroup.get('fcon_search_account_individuals_post_code')?.setValue('SW1A 1AA');

      const result = exclusiveSearchFieldValidator(formGroup);

      expect(result).toBeNull();
    });
  });
});
