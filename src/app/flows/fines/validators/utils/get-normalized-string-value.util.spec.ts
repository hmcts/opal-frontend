import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { getNormalizedStringValue } from './get-normalized-string-value.util';

describe('getNormalizedStringValue', () => {
  it('should trim whitespace by default', () => {
    expect(getNormalizedStringValue(new FormControl(' AB12 3CD '))).toBe('AB12 3CD');
  });

  it('should strip all whitespace when requested', () => {
    expect(getNormalizedStringValue(new FormControl(' AB12 3CD '), { stripWhitespace: true })).toBe('AB123CD');
  });

  it('should return null for empty strings and null controls', () => {
    expect(getNormalizedStringValue(new FormControl('   '))).toBeNull();
    expect(getNormalizedStringValue(null)).toBeNull();
  });

  it('should return non-string values unchanged', () => {
    const control = new FormControl<string | number | null>(123);

    expect(getNormalizedStringValue(control)).toBe(123);
  });

  it('should work with nested form groups passed as control children', () => {
    const group = new FormGroup({
      postcode: new FormControl(' AB12 3CD '),
    });

    expect(getNormalizedStringValue(group.get('postcode'))).toBe('AB12 3CD');
  });
});
