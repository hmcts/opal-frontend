import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { createExactlyOneCriteriaValidator } from './exactly-one-criteria.validator';

describe('createExactlyOneCriteriaValidator', () => {
  const directCriteria = ['quick_field_1', 'quick_field_2'];
  const nestedCriteria = ['nested_group_1', 'nested_group_2', 'nested_group_3'];

  function createForm(config: {
    quick1?: string | null;
    quick2?: string | null;
    nested1?: { value?: string | null } | null;
    nested2?: { value?: string | null } | null;
    nested3?: { value?: string | null } | null;
    nestedValid?: boolean;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const makeGroup = (value: any, isValid: boolean) => {
      const validators = isValid ? [] : [Validators.required];
      return new FormGroup({ field: new FormControl(value, validators) });
    };

    return new FormGroup(
      {
        quick_field_1: new FormControl(config.quick1),
        quick_field_2: new FormControl(config.quick2),
        nested_group_1: config.nested1
          ? makeGroup(config.nested1.value, config.nestedValid !== false)
          : makeGroup(null, config.nestedValid !== false),
        nested_group_2: config.nested2
          ? makeGroup(config.nested2.value, config.nestedValid !== false)
          : makeGroup(null, config.nestedValid !== false),
        nested_group_3: config.nested3
          ? makeGroup(config.nested3.value, config.nestedValid !== false)
          : makeGroup(null, config.nestedValid !== false),
      },
      { validators: createExactlyOneCriteriaValidator(directCriteria, nestedCriteria) },
    );
  }

  it('should return null if the control is not a FormGroup', () => {
    const control = new FormControl('some value');
    const validator = createExactlyOneCriteriaValidator(directCriteria, nestedCriteria);
    expect(validator(control)).toBeNull();
  });

  describe('Single criterion populated', () => {
    it('should return null if only first quick search field is populated', () => {
      const form = createForm({ quick1: '12345' });
      expect(form.errors).toBeNull();
    });

    it('should return null if only second quick search field is populated', () => {
      const form = createForm({ quick2: 'REF123' });
      expect(form.errors).toBeNull();
    });

    it('should return null if only first nested group has a value', () => {
      const form = createForm({ nested1: { value: 'John Doe' } });
      expect(form.errors).toBeNull();
    });

    it('should return null if only second nested group has a value', () => {
      const form = createForm({ nested2: { value: 'Company Inc' } });
      expect(form.errors).toBeNull();
    });

    it('should return null if only third nested group has a value', () => {
      const form = createForm({ nested3: { value: 'Some Entity' } });
      expect(form.errors).toBeNull();
    });
  });

  describe('Multiple criteria populated', () => {
    it('should return error if two quick search fields are populated', () => {
      const form = createForm({ quick1: '12345', quick2: 'REF123' });
      expect(form.errors).toEqual({ atLeastOneCriteriaRequired: true });
    });

    it('should return error if quick search field and nested group are populated', () => {
      const form = createForm({ quick1: '12345', nested1: { value: 'criteria' } });
      expect(form.errors).toEqual({ atLeastOneCriteriaRequired: true });
    });

    it('should return error if two nested groups are populated', () => {
      const form = createForm({ nested1: { value: 'criteria1' }, nested2: { value: 'criteria2' } });
      expect(form.errors).toEqual({ atLeastOneCriteriaRequired: true });
    });

    it('should return error if all quick search and all nested groups are populated', () => {
      const form = createForm({
        quick1: '12345',
        quick2: 'REF123',
        nested1: { value: 'c1' },
        nested2: { value: 'c2' },
        nested3: { value: 'c3' },
      });
      expect(form.errors).toEqual({ atLeastOneCriteriaRequired: true });
    });
  });

  describe('No criteria populated', () => {
    it('should return formEmpty error if all fields are empty', () => {
      const form = createForm({});
      expect(form.errors).toEqual({ formEmpty: true });
    });

    it('should return formEmpty error if all fields are null', () => {
      const form = createForm({ quick1: null, quick2: null, nested1: { value: null } });
      expect(form.errors).toEqual({ formEmpty: true });
    });

    it('should return formEmpty error if all fields contain only whitespace', () => {
      const form = createForm({ quick1: '   ', quick2: '  \t  ', nested1: { value: '  \n  ' } });
      expect(form.errors).toEqual({ formEmpty: true });
    });
  });

  describe('Whitespace handling', () => {
    it('should treat whitespace-only quick search values as empty', () => {
      const form = createForm({ quick1: '   ', nested1: { value: 'criteria' } });
      expect(form.errors).toBeNull();
    });

    it('should trim whitespace from values when counting populated fields', () => {
      const form = createForm({ quick1: '  12345  ' });
      expect(form.errors).toBeNull();
    });
  });

  describe('Nested group validity', () => {
    it('should defer validation if any nested group is invalid', () => {
      const form = createForm({ quick1: '12345', nested1: { value: 'criteria' }, nestedValid: false });
      // When nested groups are invalid, validator returns null (defers)
      expect(form.errors).toBeNull();
    });

    it('should not validate if all nested groups are invalid', () => {
      const form = createForm({ nestedValid: false });
      expect(form.errors).toBeNull();
    });

    it('should validate when all nested groups become valid', () => {
      const form = createForm({ quick1: '123', quick2: 'ref', nestedValid: true });
      // Two quick search fields populated should error
      expect(form.errors).toEqual({ atLeastOneCriteriaRequired: true });
    });
  });

  describe('Edge cases', () => {
    it('should handle FormGroup with missing controls gracefully', () => {
      const form = new FormGroup({
        quick_field_1: new FormControl('123'),
      });
      const validator = createExactlyOneCriteriaValidator(directCriteria, nestedCriteria);
      // Should not throw, just ignore missing controls
      expect(validator(form)).toBeNull();
    });

    it('should handle empty field arrays', () => {
      const form = new FormGroup({
        nested_group_1: new FormGroup({ field: new FormControl('value') }),
      });
      const validator = createExactlyOneCriteriaValidator([], []);
      expect(validator(form)).toBeNull();
    });

    it('should handle nested group that is not a FormGroup', () => {
      const form = new FormGroup({
        quick_field_1: new FormControl('123'),
        nested_group_1: new FormControl('not a group'), // Not a FormGroup
      });
      const validator = createExactlyOneCriteriaValidator(directCriteria, ['nested_group_1']);
      // Should treat as empty since it's not a FormGroup
      expect(validator(form)).toBeNull();
    });

    it('should handle null or undefined nested values in FormGroup', () => {
      const form = createForm({ nested1: { value: null }, nested2: { value: undefined } });
      expect(form.errors).toEqual({ formEmpty: true });
    });
  });

  describe('Complex scenarios', () => {
    it('should correctly identify single populated field among many', () => {
      const form = new FormGroup(
        {
          quick_field_1: new FormControl(null),
          quick_field_2: new FormControl(''),
          nested_group_1: new FormGroup({ field: new FormControl(null) }),
          nested_group_2: new FormGroup({ field: new FormControl('  value  ') }),
          nested_group_3: new FormGroup({ field: new FormControl(undefined) }),
        },
        { validators: createExactlyOneCriteriaValidator(directCriteria, nestedCriteria) },
      );

      expect(form.errors).toBeNull();
    });

    it('should handle deeply nested values', () => {
      const form = new FormGroup(
        {
          quick_field_1: new FormControl(null),
          quick_field_2: new FormControl(null),
          nested_group_1: new FormGroup({
            field: new FormControl(null),
            subField: new FormControl('nested value'),
          }),
          nested_group_2: new FormGroup({ field: new FormControl(null) }),
          nested_group_3: new FormGroup({ field: new FormControl(null) }),
        },
        { validators: createExactlyOneCriteriaValidator(directCriteria, nestedCriteria) },
      );

      // The validator checks all values in nested groups, so it should find the nested value
      // Note: hasNestedValue checks all values recursively
      expect(form.errors).toBeNull();
    });
  });
});
