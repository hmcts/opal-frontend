import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IFinesMacEmployerDetailsFieldErrors } from '../interfaces/fines-mac-employer-details-field-errors.interface';

import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_TELEPHONE_NUMBER as F_M_EMPLOYER_DETAILS_EMPLOYER_TELEPHONE_NUMBER } from '../constants/controls/fines-mac-employer-details-controls-employer-telephone-number';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_EMAIL_ADDRESS as F_M_EMPLOYER_DETAILS_EMPLOYER_EMAIL_ADDRESS } from '../constants/controls/fines-mac-employer-details-controls-employer-email-address';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_FIVE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FIVE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-five';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_FOUR as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FOUR } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-four';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_THREE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_THREE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-three';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_TWO as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_TWO } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-two';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_POSTCODE as F_M_EMPLOYER_DETAILS_EMPLOYER_POSTCODE } from '../constants/controls/fines-mac-employer-details-controls-employer-postcode';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_ONE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_ONE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-one';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_REFERENCE as F_M_EMPLOYER_DETAILS_EMPLOYER_REFERENCE } from '../constants/controls/fines-mac-employer-details-controls-employer-reference';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_COMPANY_NAME as F_M_EMPLOYER_DETAILS_EMPLOYER_COMPANY_NAME } from '../constants/controls/fines-mac-employer-details-controls-employer-company-name';

export const FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_EMPLOYER_DETAILS_EMPLOYER_COMPANY_NAME.controlName]: {
    required: {
      message: 'Enter employer name',
      priority: 1,
    },
    maxlength: {
      message: 'The employer name must be 35 characters or fewer',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_REFERENCE.controlName]: {
    required: {
      message: 'Enter employee reference or National Insurance number',
      priority: 1,
    },
    maxlength: {
      message: 'The employee reference must be 20 characters or fewer',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_EMAIL_ADDRESS.controlName]: {
    maxlength: {
      message: 'The employer email address must be 76 characters or fewer',
      priority: 2,
    },
    emailPattern: {
      message: 'Enter employer email address in the correct format like, name@example.com',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_TELEPHONE_NUMBER.controlName]: {
    maxlength: {
      message: 'Enter employer telephone number in the correct format',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter employer telephone number in the correct format',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_ONE.controlName]: {
    required: {
      message: 'Enter employer address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'The employer address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The employer address line 1 must not contain special characters',
      priority: 3,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_TWO.controlName]: {
    maxlength: {
      message: 'The employer address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The employer address line 2 must not contain special characters',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_THREE.controlName]: {
    maxlength: {
      message: 'The employer address line 3 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The employer address line 3 must not contain special characters',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FOUR.controlName]: {
    maxlength: {
      message: 'The employer address line 4 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The employer address line 4 must not contain special characters',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FIVE.controlName]: {
    maxlength: {
      message: 'The employer address line 5 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The employer address line 5 must not contain special characters',
      priority: 2,
    },
  },
  [F_M_EMPLOYER_DETAILS_EMPLOYER_POSTCODE.controlName]: {
    maxlength: {
      message: 'The employer postcode must be 8 characters or fewer',
      priority: 1,
    },
  },
};
