import { IFinesMacContactDetailsState } from '../interfaces/fines-mac-contact-details-state.interface';

import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_ONE as FM_CONTACT_DETAILS_EMAIL_ADDRESS_ONE } from '../constants/controls/fines-mac-contact-details-controls-email-address-one';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_TWO as FM_CONTACT_DETAILS_EMAIL_ADDRESS_TWO } from '../constants/controls/fines-mac-contact-details-controls-email-address-2';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_MOBILE as FM_CONTACT_DETAILS_TELEPHONE_NUMBER_MOBILE } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-mobile';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_HOME as FM_CONTACT_DETAILS_TELEPHONE_NUMBER_HOME } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-home';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_BUSINESS as FM_CONTACT_DETAILS_TELEPHONE_NUMBER_BUSINESS } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-business';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export const FINES_MAC_CONTACT_DETAILS_STATE_MOCK: IFinesMacFormState = {
  [FM_CONTACT_DETAILS_EMAIL_ADDRESS_ONE.controlName]: 'abc@def.co.uk',
  [FM_CONTACT_DETAILS_EMAIL_ADDRESS_TWO.controlName]: 'abc@def.co.uk',
  [FM_CONTACT_DETAILS_TELEPHONE_NUMBER_MOBILE.controlName]: '12345678910',
  [FM_CONTACT_DETAILS_TELEPHONE_NUMBER_HOME.controlName]: '12345678910',
  [FM_CONTACT_DETAILS_TELEPHONE_NUMBER_BUSINESS.controlName]: '12345678910',
};
