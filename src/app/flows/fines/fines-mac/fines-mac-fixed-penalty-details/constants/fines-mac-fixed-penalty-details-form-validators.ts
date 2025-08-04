import { Validators } from '@angular/forms';
import { IFinesMacFixedPenaltyDetailsFormValidators } from '../interfaces/fines-mac-fixed-penalty-details-form-validators.interface';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { futureDateValidator } from '@hmcts/opal-frontend-common/validators/future-date';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  LETTERS_WITH_SPACES_PATTERN,
  SPECIAL_CHARACTERS_PATTERN,
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  DRIVING_LICENCE_NUMBER_PATTERN,
  LETTERS_WITH_SPACES_DOT_PATTERN,
  TIME_FORMAT_PATTERN,
} from '@hmcts/opal-frontend-common/constants/regex-patterns';

// regex pattern validators for the form controls
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const SPECIAL_CHARACTER_PATTERN_VALIDATOR = patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern');
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'alphabeticalTextPattern');
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericTextPattern',
);
const TIME_FORMAT_PATTERN_VALIDATOR = patternValidator(TIME_FORMAT_PATTERN, 'invalidTimeFormat');
const DRIVING_LICENCE_NUMBER_PATTERN_VALIDATOR = patternValidator(
  DRIVING_LICENCE_NUMBER_PATTERN,
  'drivingLicenceNumberPattern',
);
const LETTERS_WITH_SPACES_DOT_PATTERN_VALIDATOR = patternValidator(
  LETTERS_WITH_SPACES_DOT_PATTERN,
  'alphabeticalTextPattern',
);

export const FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS: IFinesMacFixedPenaltyDetailsFormValidators = {
  fm_fp_personal_details_title: [Validators.required],
  fm_fp_personal_details_forenames: [
    Validators.required,
    Validators.maxLength(20),
    LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_personal_details_surname: [
    Validators.required,
    Validators.maxLength(30),
    LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_personal_details_dob: [optionalValidDateValidator(), dateOfBirthValidator()],
  fm_fp_personal_details_address_line_1: [
    Validators.required,
    Validators.maxLength(30),
    SPECIAL_CHARACTER_PATTERN_VALIDATOR,
  ],
  fm_fp_personal_details_address_line_2: [optionalMaxLengthValidator(30), SPECIAL_CHARACTER_PATTERN_VALIDATOR],
  fm_fp_personal_details_address_line_3: [optionalMaxLengthValidator(16), SPECIAL_CHARACTER_PATTERN_VALIDATOR],
  fm_fp_personal_details_post_code: [optionalMaxLengthValidator(8), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
  fm_fp_court_details_imposing_court_id: [Validators.required],
  fm_fp_court_details_issuing_authority_id: [
    Validators.required,
    Validators.maxLength(41),
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_account_comments_notes_comments: [
    Validators.maxLength(30),
    ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
  ],
  fm_fp_account_comments_notes_notes: [
    Validators.maxLength(1000),
    ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
  ],
  fm_fp_account_comments_notes_system_notes: null,
  fm_fp_language_preferences_document_language: null,
  fm_fp_language_preferences_hearing_language: null,
  fm_fp_offence_details_notice_number: [
    Validators.required,
    Validators.maxLength(16),
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_offence_details_offence_type: null,
  fm_fp_offence_details_date_of_offence: [Validators.required, optionalValidDateValidator(), futureDateValidator()],
  fm_fp_offence_details_offence_id: null,
  fm_fp_offence_details_offence_cjs_code: [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(8),
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_offence_details_time_of_offence: [TIME_FORMAT_PATTERN_VALIDATOR],
  fm_fp_offence_details_place_of_offence: [
    Validators.required,
    Validators.maxLength(30),
    ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
  ],
  fm_fp_offence_details_amount_imposed: [Validators.required, amountValidator(18, 2)],
  fm_fp_offence_details_vehicle_registration_number: [
    Validators.required,
    Validators.maxLength(7),
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
  ],
  fm_fp_offence_details_driving_licence_number: [Validators.required, DRIVING_LICENCE_NUMBER_PATTERN_VALIDATOR],
  fm_fp_offence_details_nto_nth: [Validators.maxLength(10), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
  fm_fp_offence_details_date_nto_issued: [optionalValidDateValidator(), futureDateValidator()],
  fm_fp_company_details_company_name: [
    Validators.required,
    Validators.maxLength(30),
    LETTERS_WITH_SPACES_DOT_PATTERN_VALIDATOR,
  ],
  fm_fp_company_details_address_line_1: [
    Validators.required,
    Validators.maxLength(30),
    SPECIAL_CHARACTER_PATTERN_VALIDATOR,
  ],
  fm_fp_company_details_address_line_2: [optionalMaxLengthValidator(30), SPECIAL_CHARACTER_PATTERN_VALIDATOR],
  fm_fp_company_details_address_line_3: [optionalMaxLengthValidator(16), SPECIAL_CHARACTER_PATTERN_VALIDATOR],
  fm_fp_company_details_postcode: [optionalMaxLengthValidator(8), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
};
