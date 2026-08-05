import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { postcodeMaxLengthValidator, postcodePatternValidator } from './postcode-validator.util';

describe('postcodeValidator util', () => {
  it('should validate postcode patterns after stripping whitespace', () => {
    const validator = postcodePatternValidator('alphanumericTextPattern');

    expect(validator(new FormControl(' AB12 3CD '))).toBeNull();
    expect(validator(new FormControl('AB12-3CD'))).toEqual({ alphanumericTextPattern: true });
  });

  it('should validate postcode length after stripping whitespace', () => {
    const validator = postcodeMaxLengthValidator(8);

    expect(validator(new FormControl(' AB12 3CD '))).toBeNull();
    expect(validator(new FormControl('AB12 3CDEF'))).toEqual({
      maxlength: {
        actualLength: 9,
        requiredLength: 8,
      },
    });
  });
});
