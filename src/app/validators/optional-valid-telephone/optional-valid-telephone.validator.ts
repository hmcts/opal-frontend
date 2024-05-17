import { ValidatorFn, AbstractControl } from "@angular/forms";

export function optionalPhoneNumberValidator(): ValidatorFn {
    const numericPattern = /^\d*$/;
    return (control: AbstractControl): { [key: string]: unknown } | null => {
        if (control.value) {
            const valid = numericPattern.test(control.value);
            return valid ? null : { 'phoneNumberPattern': { value: control.value } };
        }
        return null;
    };
}
