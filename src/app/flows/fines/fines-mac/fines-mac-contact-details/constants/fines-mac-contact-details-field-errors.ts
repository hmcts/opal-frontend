import { IFinesMacContactDetailsFieldErrors } from '../interfaces/fines-mac-contact-details-field-errors.interface';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_ONE as FM_C_D_EMAIL_ADDRESS_ONE } from '../constants/controls/fines-mac-contact-details-controls-email-address-one';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_TWO as FM_C_D_EMAIL_ADDRESS_TWO } from '../constants/controls/fines-mac-contact-details-controls-email-address-2';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_MOBILE as FM_C_D_TELEPHONE_NUMBER_MOBILE } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-mobile';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_HOME as FM_C_D_TELEPHONE_NUMBER_HOME } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-home';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_BUSINESS as FM_C_D_TELEPHONE_NUMBER_BUSINESS } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-business';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [FM_C_D_EMAIL_ADDRESS_ONE.controlName]: {
    maxlength: {
      message: 'The primary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter primary email address in the correct format like, name@example.com',
      priority: 2,
    },
  },
  [FM_C_D_EMAIL_ADDRESS_TWO.controlName]: {
    maxlength: {
      message: 'The secondary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter secondary email address in the correct format like, name@example.com',
      priority: 2,
    },
  },
  [FM_C_D_TELEPHONE_NUMBER_MOBILE.controlName]: {
    maxlength: {
      message: 'Enter a mobile telephone number, like 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a mobile telephone number, like 07700 900 982',
      priority: 2,
    },
  },
  [FM_C_D_TELEPHONE_NUMBER_HOME.controlName]: {
    maxlength: {
      message: 'Enter a home telephone number, like 01632 960 001',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a home telephone number, like 01632 960 001',
      priority: 2,
    },
  },
  [FM_C_D_TELEPHONE_NUMBER_BUSINESS.controlName]: {
    maxlength: {
      message: 'Enter a work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 2,
    },
  },
};
