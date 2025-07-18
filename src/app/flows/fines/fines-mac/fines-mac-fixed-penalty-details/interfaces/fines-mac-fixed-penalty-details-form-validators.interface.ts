import { ValidatorFn } from '@angular/forms';

export interface IFinesMacFixedPenaltyDetailsFormValidators {
  fm_fp_personal_details_title: Array<ValidatorFn> | null;
  fm_fp_personal_details_forenames: Array<ValidatorFn> | null;
  fm_fp_personal_details_surname: Array<ValidatorFn> | null;
  fm_fp_personal_details_dob: Array<ValidatorFn> | null;
  fm_fp_personal_details_address_line_1: Array<ValidatorFn> | null;
  fm_fp_personal_details_address_line_2: Array<ValidatorFn> | null;
  fm_fp_personal_details_address_line_3: Array<ValidatorFn> | null;
  fm_fp_personal_details_post_code: Array<ValidatorFn> | null;
  fm_fp_court_details_imposing_court_id: Array<ValidatorFn> | null;
  fm_fp_court_details_issuing_authority_id: Array<ValidatorFn> | null;
  fm_fp_account_comments_notes_comments: Array<ValidatorFn> | null;
  fm_fp_account_comments_notes_notes: Array<ValidatorFn> | null;
  fm_fp_account_comments_notes_system_notes: Array<ValidatorFn> | null;
  fm_fp_language_preferences_document_language: Array<ValidatorFn> | null;
  fm_fp_language_preferences_hearing_language: Array<ValidatorFn> | null;
  fm_fp_offence_details_notice_number: Array<ValidatorFn> | null;
  fm_fp_offence_details_offence_type: Array<ValidatorFn> | null;
  fm_fp_offence_details_date_of_offence: Array<ValidatorFn> | null;
  fm_fp_offence_details_offence_id: Array<ValidatorFn> | null;
  fm_fp_offence_details_offence_cjs_code: Array<ValidatorFn> | null;
  fm_fp_offence_details_time_of_offence: Array<ValidatorFn> | null;
  fm_fp_offence_details_place_of_offence: Array<ValidatorFn> | null;
  fm_fp_offence_details_amount_imposed: Array<ValidatorFn> | null;
  fm_fp_offence_details_vehicle_registration_number: Array<ValidatorFn> | null;
  fm_fp_offence_details_driving_licence_number: Array<ValidatorFn> | null;
  fm_fp_offence_details_nto_nth: Array<ValidatorFn> | null;
  fm_fp_offence_details_date_nto_issued: Array<ValidatorFn> | null;
  fm_fp_company_details_company_name: Array<ValidatorFn> | null;
  fm_fp_company_details_address_line_1: Array<ValidatorFn> | null;
  fm_fp_company_details_address_line_2: Array<ValidatorFn> | null;
  fm_fp_company_details_address_line_3: Array<ValidatorFn> | null;
  fm_fp_company_details_postcode: Array<ValidatorFn> | null;
}
