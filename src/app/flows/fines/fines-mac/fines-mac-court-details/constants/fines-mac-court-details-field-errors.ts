import { IFinesMacCourtDetailsFieldErrors } from '../interfaces/fines-mac-court-details-field-errors.interface';

export const FINES_MAC_COURT_DETAILS_FIELD_ERRORS: IFinesMacCourtDetailsFieldErrors = {
  fm_court_details_originator_id: {
    required: {
      message: 'Enter a sending area or Local Justice Area',
      priority: 1,
    },
  },
  fm_court_details_prosecutor_case_reference: {
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
  fm_court_details_imposing_court_id: {
    required: {
      message: 'Enter an Enforcement court',
      priority: 1,
    },
  },
};
