import { FINES_MAC_CONTROLS_ALIASES as FINES_MAC_PERSONAL_DETAILS_CONTROLS_ALIASES } from '../../constants/controls/fines-mac-controls-aliases';
import { FINES_MAC_CONTROLS_FORENAMES as FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES } from '../../constants/controls/fines-mac-controls-forenames';
import { FINES_MAC_CONTROLS_SURNAME as FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME } from '../../constants/controls/fines-mac-controls-surname';
import { FINES_MAC_CONTROLS_ADD_ALIAS as FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS } from '../../constants/controls/fines-mac-controls-add-alias';
import { FINES_MAC_CONTROLS_DOB as FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB } from '../../constants/controls/fines-mac-controls-dob';
import { FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER as FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER } from '../../constants/controls/fines-mac-controls-national-insurance-number';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';
import { FINES_MAC_CONTROLS_POSTCODE as FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE } from '../../constants/controls/fines-mac-controls-postcode';
import { FINES_MAC_CONTROLS_VEHICLE_MAKE as FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE } from '../../constants/controls/fines-mac-controls-vehicle-make';
import { FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK as FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK } from '../../constants/controls/fines-mac-controls-vehicle-registration-mark';
import { FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE } from './controls/fines-mac-personal-details-controls-address-line-three';
import { FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE } from './controls/fines-mac-personal-details-controls-title';

export const FINES_MAC_PERSONAL_DETAILS_FORM_CONTROLS = {
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ALIASES.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ALIASES,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK,
  },
  [FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE.fieldName]: {
    ...FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE,
  },
};
