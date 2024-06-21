import { ValidatorFn, AbstractControl } from '@angular/forms';

export function nationalInsuranceNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      // Remove all spaces and convert to uppercase for uniformity
      const cleanedValue = value.replace(/\s+/g, '').toUpperCase();

      // Check if the cleaned value has exactly 9 characters and matches the National Insurance number format
      const ninoRegex = /^[A-Z]{2}\d{6}[A-D]$/;
      if (cleanedValue.length !== 9 || !ninoRegex.test(cleanedValue)) {
        return { nationalInsuranceNumberPattern: { value: value } };
      }
    }
    return null;
  };
}
