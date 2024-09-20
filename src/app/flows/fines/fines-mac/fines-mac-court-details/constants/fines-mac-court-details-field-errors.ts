import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IFinesMacCourtDetailsFieldErrors } from '../interfaces/fines-mac-court-details-field-errors.interface';
import { FINES_MAC_COURT_DETAILS_CONTROLS_SENDING_COURT as F_M_COURT_DETAILS_SENDING_COURT } from '../constants/controls/fines-mac-court-details-controls-sending-court';
import { FINES_MAC_COURT_DETAILS_CONTROLS_PROSECUTOR_COURT_REFERENCE as F_M_COURT_DETAILS_PROSECUTOR_COURT_REFERENCE } from '../constants/controls/fines-mac-court-details-controls-prosecutor-case-reference';
import { FINES_MAC_COURT_DETAILS_CONTROLS_ENFORCING_COURT as F_M_COURT_DETAILS_ENFORCING_COURT } from '../constants/controls/fines-mac-court-details-controls-enforcing-court';

export const FINES_MAC_COURT_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_COURT_DETAILS_SENDING_COURT.controlName]: {
    required: {
      message: 'Enter a sending area or Local Justice Area',
      priority: 1,
    },
  },
  [F_M_COURT_DETAILS_PROSECUTOR_COURT_REFERENCE.controlName]: {
    required: {
      message: 'Enter a Prosecutor Case Reference',
      priority: 1,
    },
    maxlength: {
      message: 'You have entered too many characters. Enter 30 characters or fewer',
      priority: 2,
    },
    pattern: {
      message: 'Enter letters and numbers only',
      priority: 3,
    },
  },
  [F_M_COURT_DETAILS_ENFORCING_COURT.controlName]: {
    required: {
      message: 'Enter an Enforcement court',
      priority: 1,
    },
  },
};
