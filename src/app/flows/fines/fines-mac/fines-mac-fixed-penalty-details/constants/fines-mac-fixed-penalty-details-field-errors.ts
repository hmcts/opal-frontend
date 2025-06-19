import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../../fines-mac-court-details/constants/fines-mac-court-details-field-errors';
import { FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS } from '../../fines-mac-offence-details/constants/fines-mac-offence-details-offences-field-errors.constant';
import { FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../../fines-mac-personal-details/constants/fines-mac-personal-details-field-errors';
import { IFinesMacFixedPenaltyDetailsFieldErrors } from '../interfaces/fines-mac-fixed-penalty-details-field-errors.interface';

export const FINES_MAC_FIXED_PENALTY_DETAILS_FIELD_ERRORS: IFinesMacFixedPenaltyDetailsFieldErrors = {
  fm_fp_personal_details_title: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_title,
  fm_fp_personal_details_forenames: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_forenames,
  fm_fp_personal_details_surname: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_surname,
  fm_fp_personal_details_dob: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_dob,
  fm_fp_personal_details_address_line_1: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_address_line_1,
  fm_fp_personal_details_address_line_2: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_address_line_2,
  fm_fp_personal_details_address_line_3: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_address_line_3,
  fm_fp_personal_details_post_code: FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_post_code,
  fm_fp_court_details_imposing_court_id: FINES_MAC_COURT_DETAILS_FIELD_ERRORS.fm_court_details_imposing_court_id,
  fm_fp_court_details_issuing_authority_id: {
    required: {
      message: `Enter the Issuing authority`,
      priority: 1,
    }
  },
  fm_fp_account_comments_notes_comments: {},
  fm_fp_account_comments_notes_notes: {},
  fm_fp_account_comments_notes_system_notes: {},
  fm_fp_language_preferences_document_language: {},
  fm_fp_language_preferences_hearing_language: {},
  fm_fp_offence_details_notice_number: {
    required: {
      message: `Enter Notice number`,
      priority: 1,
    },
    maxlength: {
      message: `The Notice number must be 16 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The Notice number must only contain alphabetical text`,
      priority: 3,
    },
  },
  fm_fp_offence_details_offence_type: {},
  fm_fp_offence_details_date_of_offence: {
    required: {
      message: `Enter the Date of offence`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid Date of offence`,
      priority: 2,
    },
    invalidFutureDate: {
      message: `The Date of offence must not be in the future`,
      priority: 3,
    },
  },
  fm_fp_offence_details_offence_id: {},
  fm_fp_offence_details_offence_cjs_code: FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS['fm_offence_details_offence_cjs_code'],
  fm_fp_offence_details_time_of_offence: {
    pattern: {
      message: `Enter a valid time for the offence (HH:MM)`,
      priority: 1,
    }
  },
  fm_fp_offence_details_place_of_offence: {
    required: {
      message: `Enter Place of offence`,
      priority: 1,
    },
    maxlength: {
      message: `The Place of offence must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The Place of offence must only contain alphabetical text`,
      priority: 3,
    },
  },
  fm_fp_offence_details_amount_imposed: {
    required: {
      message: `Enter Amount imposed`,
      priority: 1,
    },
    invalidAmountValue: {
      message: `The Amount imposed must be a valid monetary value`,
      priority: 2,
    },
    invalidAmount: {
      message: `The Amount imposed is too large`,
      priority: 3,
    }
  },
  fm_fp_offence_details_vehicle_registration_number: {
    required: {
      message: `Enter the Vehicle registration number`,
      priority: 1,
    },
    maxlength: {
      message: `The Vehicle registration number must be 7 characters or fewer`,
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: `The Vehicle registration number must only contain alphabetical text`,
      priority: 2,
    },
  },
  fm_fp_offence_details_driving_licence_number: {
    required: {
      message: `Enter the Driving licence number`,
      priority: 1,
    },
    pattern: {
      message: `The Driving licence number must be in a valid format (I.e. first 5 characters are the surname, second 6 are the DOB, 2 characters for the initials and 3 random characters)`,
      priority: 1,  
    }
  },
  fm_fp_offence_details_nto_nth: {
    maxlength: {
      message: `The Notice to owner or hirer number must be 10 characters or fewer`,
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: `The Notice to owner or hirer number must only contain alphabetical text`,
      priority: 2,
    },
  },
  fm_fp_offence_details_date_nto_issued: {
    required: {
      message: `Enter the date the Notice to owner or hirer was issued`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid date for when the Notice to owner or hirer was issued`,
      priority: 2,
    },
    invalidFutureDate: {
      message: `The date the Notice to owner or hirer was issued must not be in the future`,
      priority: 3,
    },
  },
};
