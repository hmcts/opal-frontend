import { FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { createExclusiveFieldValidator } from './exclusive-field.validator';
import { ExclusiveFieldRuleConfig } from './interfaces/exclusive-field-rule-config.interface';

function createForm(config: {
  accountNumber?: string | null;
  niNumber?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  companyName?: string | null;
}) {
  return new FormGroup({
    account_number: new FormControl(config.accountNumber),
    ni_number: new FormControl(config.niNumber),
    last_name: new FormControl(config.lastName),
    first_name: new FormControl(config.firstName),
    company_name: new FormControl(config.companyName),
  });
}

describe('createExclusiveFieldValidator', () => {
  it('should return null if the control is not a FormGroup', () => {
    const control = new FormControl('some value');
    const rules: ExclusiveFieldRuleConfig[] = [];
    const validator = createExclusiveFieldValidator(rules);
    expect(validator(control)).toBeNull();
  });

  describe('Single rule - Account number exclusivity', () => {
    const accountNumberRule: ExclusiveFieldRuleConfig = {
      primaryField: 'account_number',
      conflictingFields: ['ni_number', 'last_name', 'first_name', 'company_name'],
      errorKey: 'accountNumberMustBeExclusive',
    };

    it('should return null if only account number is populated', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345' }).controls, {
        validators: createExclusiveFieldValidator([accountNumberRule]),
      });
      expect(form.errors).toBeNull();
    });

    it('should return null if account number is empty and other fields are populated', () => {
      const form = new FormGroup(createForm({ niNumber: 'AA123456A', lastName: 'Smith' }).controls, {
        validators: createExclusiveFieldValidator([accountNumberRule]),
      });
      expect(form.errors).toBeNull();
    });

    it('should return null if account number is whitespace and other fields are populated', () => {
      const form = new FormGroup(createForm({ accountNumber: '   ', niNumber: 'AA123456A' }).controls, {
        validators: createExclusiveFieldValidator([accountNumberRule]),
      });
      expect(form.errors).toBeNull();
    });

    it('should return error if account number and NI number are both populated', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', niNumber: 'AA123456A' }).controls, {
        validators: createExclusiveFieldValidator([accountNumberRule]),
      });
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error if account number and last name are both populated', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', lastName: 'Smith' }).controls, {
        validators: createExclusiveFieldValidator([accountNumberRule]),
      });
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return error if account number and multiple other fields are populated', () => {
      const form = new FormGroup(
        createForm({ accountNumber: '12345', niNumber: 'AA123456A', lastName: 'Smith', companyName: 'Acme' }).controls,
        {
          validators: createExclusiveFieldValidator([accountNumberRule]),
        },
      );
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });
  });

  describe('Multiple rules', () => {
    const rules: ExclusiveFieldRuleConfig[] = [
      {
        primaryField: 'account_number',
        conflictingFields: ['ni_number', 'last_name', 'first_name', 'company_name'],
        errorKey: 'accountNumberMustBeExclusive',
      },
      {
        primaryField: 'ni_number',
        conflictingFields: ['account_number', 'company_name'],
        errorKey: 'niNumberMustBeExclusive',
      },
    ];

    it('should enforce first rule when only account number is populated', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toBeNull();
    });

    it('should enforce first rule when account number conflicts', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', lastName: 'Smith' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should enforce second rule when NI number conflicts with account number', () => {
      const form = new FormGroup(createForm({ niNumber: 'AA123456A', accountNumber: '12345' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should enforce second rule when NI number conflicts with company name', () => {
      const form = new FormGroup(createForm({ niNumber: 'AA123456A', companyName: 'Acme' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toEqual({ niNumberMustBeExclusive: true });
    });

    it('should enforce first rule when it matches first in the rules array', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', niNumber: 'AA123456A' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      // First rule is checked first, so it should return that error
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should return null when no fields conflict', () => {
      const form = new FormGroup(createForm({ lastName: 'Smith', firstName: 'John' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toBeNull();
    });

    it('should return null when all fields are empty', () => {
      const form = new FormGroup(createForm({}).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toBeNull();
    });
  });

  describe('Whitespace handling', () => {
    const rule: ExclusiveFieldRuleConfig = {
      primaryField: 'account_number',
      conflictingFields: ['ni_number'],
      errorKey: 'accountNumberMustBeExclusive',
    };

    it('should treat whitespace-only values as empty (primary field)', () => {
      const form = new FormGroup(createForm({ accountNumber: '   ', niNumber: 'AA123456A' }).controls, {
        validators: createExclusiveFieldValidator([rule]),
      });
      expect(form.errors).toBeNull();
    });

    it('should treat whitespace-only values as empty (conflicting field)', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', niNumber: '   ' }).controls, {
        validators: createExclusiveFieldValidator([rule]),
      });
      expect(form.errors).toBeNull();
    });

    it('should trim whitespace and detect non-empty values with surrounding whitespace', () => {
      const form = new FormGroup(createForm({ accountNumber: '  12345  ', niNumber: '  AA123456A  ' }).controls, {
        validators: createExclusiveFieldValidator([rule]),
      });
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });
  });

  describe('Nested FormGroup values', () => {
    it('should handle nested FormGroups in form fields', () => {
      const form = new FormGroup(
        {
          account_number: new FormGroup({ value: new FormControl('12345') }),
          ni_number: new FormGroup({ value: new FormControl('AA123456A') }),
          last_name: new FormControl(null),
          first_name: new FormControl(null),
          company_name: new FormControl(null),
        },
        {
          validators: createExclusiveFieldValidator([
            {
              primaryField: 'account_number',
              conflictingFields: ['ni_number'],
              errorKey: 'accountNumberMustBeExclusive',
            },
          ]),
        },
      );
      // hasNestedValue should recursively detect the nested values
      expect(form.errors).toEqual({ accountNumberMustBeExclusive: true });
    });

    it('should treat nested FormGroup with no values as empty', () => {
      const form = new FormGroup(
        {
          account_number: new FormGroup({ value: new FormControl(null) }),
          ni_number: new FormControl(null),
          last_name: new FormControl(null),
          first_name: new FormControl(null),
          company_name: new FormControl(null),
        },
        {
          validators: createExclusiveFieldValidator([
            {
              primaryField: 'account_number',
              conflictingFields: ['ni_number'],
              errorKey: 'accountNumberMustBeExclusive',
            },
          ]),
        },
      );
      expect(form.errors).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty rules array', () => {
      const form = createForm({ accountNumber: '12345', niNumber: 'AA123456A' });
      const validator = createExclusiveFieldValidator([]);
      expect(validator(form)).toBeNull();
    });

    it('should handle rule with non-existent fields', () => {
      const form = new FormGroup({
        some_field: new FormControl('value'),
      });
      const rule: ExclusiveFieldRuleConfig = {
        primaryField: 'non_existent_primary',
        conflictingFields: ['non_existent_conflict'],
        errorKey: 'someError',
      };
      const validator = createExclusiveFieldValidator([rule]);
      // Should not throw, just handle missing fields gracefully
      expect(validator(form)).toBeNull();
    });

    it('should handle null values explicitly', () => {
      const form = new FormGroup(
        {
          account_number: new FormControl(null),
          ni_number: new FormControl(null),
          last_name: new FormControl(null),
          first_name: new FormControl(null),
          company_name: new FormControl(null),
        },
        {
          validators: createExclusiveFieldValidator([
            {
              primaryField: 'account_number',
              conflictingFields: ['ni_number'],
              errorKey: 'accountNumberMustBeExclusive',
            },
          ]),
        },
      );
      expect(form.errors).toBeNull();
    });

    it('should handle undefined values explicitly', () => {
      const form = new FormGroup(
        {
          account_number: new FormControl(undefined),
          ni_number: new FormControl(undefined),
          last_name: new FormControl(undefined),
          first_name: new FormControl(undefined),
          company_name: new FormControl(undefined),
        },
        {
          validators: createExclusiveFieldValidator([
            {
              primaryField: 'account_number',
              conflictingFields: ['ni_number'],
              errorKey: 'accountNumberMustBeExclusive',
            },
          ]),
        },
      );
      expect(form.errors).toBeNull();
    });
  });

  describe('Custom error keys', () => {
    it('should return the specified error key in validation error', () => {
      const form = new FormGroup(createForm({ accountNumber: '12345', niNumber: 'AA123456A' }).controls, {
        validators: createExclusiveFieldValidator([
          {
            primaryField: 'account_number',
            conflictingFields: ['ni_number'],
            errorKey: 'customErrorKey',
          },
        ]),
      });
      expect(form.errors).toEqual({ customErrorKey: true });
    });

    it('should support multiple custom error keys for different rules', () => {
      const rules: ExclusiveFieldRuleConfig[] = [
        {
          primaryField: 'account_number',
          conflictingFields: ['last_name'],
          errorKey: 'accountAndLastNameConflict',
        },
        {
          primaryField: 'ni_number',
          conflictingFields: ['company_name'],
          errorKey: 'niAndCompanyConflict',
        },
      ];

      // Test first rule error
      let form = new FormGroup(createForm({ accountNumber: '12345', lastName: 'Smith' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toEqual({ accountAndLastNameConflict: true });

      // Test second rule error
      form = new FormGroup(createForm({ niNumber: 'AA123456A', companyName: 'Acme' }).controls, {
        validators: createExclusiveFieldValidator(rules),
      });
      expect(form.errors).toEqual({ niAndCompanyConflict: true });
    });
  });
});
