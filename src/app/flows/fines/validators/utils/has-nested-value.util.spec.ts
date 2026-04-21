import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { hasNestedValue } from './has-nested-value.util';

describe('hasNestedValue', () => {
  it('should return true for arrays with at least one value', () => {
    const control = new FormControl(['value']);

    expect(hasNestedValue(control)).toBe(true);
  });

  it('should return false for empty arrays', () => {
    const control = new FormControl([]);

    expect(hasNestedValue(control)).toBe(false);
  });

  it('should recursively check nested form groups', () => {
    const control = new FormGroup({
      parent: new FormGroup({
        child: new FormControl('nested value'),
      }),
    });

    expect(hasNestedValue(control)).toBe(true);
  });
});
