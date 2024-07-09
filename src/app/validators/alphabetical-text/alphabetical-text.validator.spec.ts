import { FormControl } from '@angular/forms';
import { alphabeticalTextValidator } from './alphabetical-text.validator';

describe('alphabeticalTextValidator', () => {
  it('should allow valid characters', () => {
    const control = new FormControl('ValidName123 -_.,*()');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should not allow invalid characters', () => {
    const control = new FormControl('Invalid@Name!');
    const result = alphabeticalTextValidator()(control);
    expect(result).toEqual({ alphabeticalTextPattern: { value: 'Invalid@Name!' } });
  });

  it('should allow empty string', () => {
    const control = new FormControl('');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should allow only spaces', () => {
    const control = new FormControl('    ');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should allow single valid character', () => {
    const control = new FormControl('a');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should not allow only invalid characters', () => {
    const control = new FormControl('@!');
    const result = alphabeticalTextValidator()(control);
    expect(result).toEqual({ alphabeticalTextPattern: { value: '@!' } });
  });
});
