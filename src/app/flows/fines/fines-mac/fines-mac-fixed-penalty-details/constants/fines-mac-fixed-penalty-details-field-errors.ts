import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS } from '../../fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-field-errors.constant';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../../fines-mac-company-details/constants/fines-mac-company-details-field-errors';
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
  fm_fp_personal_details_post_code: {
    ...FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS.fm_personal_details_post_code,
    alphanumericTextPattern: {
      priority: 2,
      message: `Postcode must only contain letters or numbers`,
    },
  },
  fm_fp_court_details_imposing_court_id: FINES_MAC_COURT_DETAILS_FIELD_ERRORS.fm_court_details_imposing_court_id,
  fm_fp_court_details_originator_id: {
    required: {
      message: `Enter the issuing authority`,
      priority: 1,
    },
  },
  fm_fp_court_details_originator_name: {},
  fm_fp_account_comments_notes_comments:
    FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS.fm_account_comments_notes_comments,
  fm_fp_account_comments_notes_notes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS.fm_account_comments_notes_notes,
  fm_fp_account_comments_notes_system_notes: {},
  fm_fp_language_preferences_document_language: {},
  fm_fp_language_preferences_hearing_language: {},
  fm_fp_offence_details_notice_number: {
    required: {
      message: `Enter Notice number`,
      priority: 1,
    },
    maxlength: {
      message: `Notice number must be 16 characters or fewer`,
      priority: 2,
    },
    alphanumericTextPattern: {
      message: `Notice number must only contain letters or numbers`,
      priority: 3,
    },
  },
  fm_fp_offence_details_offence_type: {},
  fm_fp_offence_details_date_of_offence: {
    required: {
      message: `Enter date of offence`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Offence date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid offence date`,
      priority: 3,
    },
    invalidFutureDate: {
      message: `Date of offence must be in the past`,
      priority: 4,
    },
  },
  fm_fp_offence_details_offence_id: {},
  fm_fp_offence_details_offence_cjs_code:
    FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS['fm_offence_details_offence_cjs_code'],
  fm_fp_offence_details_time_of_offence: {
    invalidTimeFormat: {
      message: `Enter time of offence in the correct format, such as 02:00 or 14:00`,
      priority: 1,
    },
  },
  fm_fp_offence_details_place_of_offence: {
    required: {
      message: `Enter where the offence took place`,
      priority: 1,
    },
    maxlength: {
      message: `Place of offence must be 30 characters or fewer`,
      priority: 2,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Place of offence must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 3,
    },
  },
  fm_fp_offence_details_amount_imposed: {
    required: {
      message: `Enter amount imposed`,
      priority: 1,
    },
    invalidAmountValue: {
      message: `Enter valid amount`,
      priority: 2,
    },
    invalidAmount: {
      message: `Enter an amount with no more than 18 digits before the decimal and 2 or fewer after`,
      priority: 3,
    },
  },
  fm_fp_offence_details_vehicle_registration_number: {
    required: {
      message: `Enter Registration number`,
      priority: 1,
    },
    maxlength: {
      message: `Registration number must be 7 characters or fewer`,
      priority: 2,
    },
    alphanumericTextPattern: {
      message: `Registration number must only contain letters or numbers`,
      priority: 3,
    },
  },
  fm_fp_offence_details_driving_licence_number: {
    required: {
      message: `Enter Driving licence number`,
      priority: 1,
    },
    maxlength: {
      message: `Driving licence number must be 16 characters or fewer`,
      priority: 2,
    },
    alphanumericTextPattern: {
      message: `Driving licence number must only contain letters or numbers`,
      priority: 3,
    },
    drivingLicenceNumberPattern: {
      message: `Enter Driving licence number in the correct format, like ABCDE123456AA1B1`,
      priority: 4,
    },
  },
  fm_fp_offence_details_nto_nth: {
    maxlength: {
      message: `Notice to owner or hirer number (NTO/NTH) must be 10 characters or fewer`,
      priority: 1,
    },
    alphanumericTextPattern: {
      message: `Notice to owner or hirer number (NTO/NTH) must only contain letters or numbers`,
      priority: 2,
    },
  },
  fm_fp_offence_details_date_nto_issued: {
    invalidDateFormat: {
      message: `Enter notice to owner date in the format DD/MM/YYYY`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid notice to owner date`,
      priority: 2,
    },
    invalidFutureDate: {
      message: `Date notice to owner issued must be in the past`,
      priority: 3,
    },
  },
  fm_fp_company_details_company_name: FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS.fm_company_details_company_name,
  fm_fp_company_details_address_line_1: FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS.fm_company_details_address_line_1,
  fm_fp_company_details_address_line_2: FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS.fm_company_details_address_line_2,
  fm_fp_company_details_address_line_3: FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS.fm_company_details_address_line_3,
  fm_fp_company_details_postcode: FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS.fm_company_details_postcode,
};
