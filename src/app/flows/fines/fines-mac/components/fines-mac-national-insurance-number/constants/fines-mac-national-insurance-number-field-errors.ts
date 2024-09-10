import { IFinesMacNationalInsuranceNumberFieldErrors } from '../interfaces';

export const FINES_MAC_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS: IFinesMacNationalInsuranceNumberFieldErrors = {
  national_insurance_number: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number in the format AANNNNNNA`,
      priority: 1,
    },
  },
};
