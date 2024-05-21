import { FormControl, FormGroup, Validators } from '@angular/forms';
import { optionalMaxLengthValidator, optionalEmailAddressValidator, optionalPhoneNumberValidator, specialCharactersValidator } from 'src/app/validators';

export const MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK = new FormGroup({
    employerName: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
    employeeReference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    employerEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
    employerTelephone: new FormControl(null, [optionalMaxLengthValidator(13), optionalPhoneNumberValidator()]),
    employerAddress1: new FormControl(null, [
      Validators.required,
      Validators.maxLength(30),
      specialCharactersValidator(),
    ]),
    employerAddress2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
    employerAddress3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
    employerAddress4: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
    employerAddress5: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
    employerPostcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
  });