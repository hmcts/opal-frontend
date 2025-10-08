import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import {
  atLeastOneBusinessUnitSelectedRecordValidator,
  businessUnitSelectionRootMirrorValidator,
} from './fines-sa-search-filter-business-unit-select-bu.validator';

describe('fines-sa-search-filter-business-unit validators', () => {
  describe('atLeastOneBusinessUnitSelectedRecordValidator', () => {
    const run = (value: unknown) => atLeastOneBusinessUnitSelectedRecordValidator(new FormControl(value));

    it('returns {required:true} when value is null/undefined', () => {
      expect(run(null)).toEqual({ required: true });
      expect(run(undefined)).toEqual({ required: true });
    });

    it('returns {required:true} when value is not an object', () => {
      expect(run('not-an-object')).toEqual({ required: true });
      expect(run(123 as unknown as Record<string, boolean>)).toEqual({ required: true });
      expect(run(true as unknown as Record<string, boolean>)).toEqual({ required: true });
    });

    it('returns {required:true} when record is empty', () => {
      expect(run({})).toEqual({ required: true });
    });

    it('returns {required:true} when all values are false', () => {
      expect(run({ '5': false, '8': false })).toEqual({ required: true });
    });

    it('returns null when at least one value is true', () => {
      expect(run({ '5': false, '8': true, '9': false })).toBeNull();
      expect(run({ '5': true })).toBeNull();
    });

    it('ignores non-boolean truthy/falsy by requiring strict boolean true', () => {
      // Cast to satisfy type, validator still operates on runtime values
      const result = run({ '5': 1 as unknown as boolean, '8': false });
      // No strict true boolean -> still required
      expect(result).toEqual({ required: true });
    });
  });

  describe('businessUnitSelectionRootMirrorValidator', () => {
    const recordName = 'fsa_search_account_business_unit_ids';
    const mirror = businessUnitSelectionRootMirrorValidator(recordName);

    const makeGroup = (recordCtrl?: AbstractControl) => {
      return new FormGroup<Record<string, AbstractControl>>({
        [recordName]: (recordCtrl ?? new FormControl({})) as AbstractControl,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    };

    it('returns null when group is not a FormGroup (defensive)', () => {
      // Call with a naked control instead of a group
      expect(mirror(new FormControl({}) as unknown as FormGroup)).toBeNull();
    });

    it('returns null when record control is missing', () => {
      const group = new FormGroup({});
      expect(mirror(group)).toBeNull();
    });

    it('returns mapped required error when child record has required error', () => {
      const record = new FormControl({});
      record.setErrors({ required: true });
      const group = makeGroup(record);

      expect(mirror(group)).toEqual({ [recordName]: { required: true } });
    });

    it('returns null when child record has no required error', () => {
      const record = new FormControl({});
      record.setErrors({ other: true });
      const group = makeGroup(record);

      expect(mirror(group)).toBeNull();
    });

    it('returns null when child record has no errors at all', () => {
      const record = new FormControl({});
      const group = makeGroup(record);
      expect(mirror(group)).toBeNull();
    });
  });
});
