import { IFinesAccAddCommentsFormState } from '../../../../../../src/app/flows/fines/fines-acc/fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

export const ADD_COMMENTS_FORM_STATE_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: null,
  facc_add_free_text_1: null,
  facc_add_free_text_2: null,
  facc_add_free_text_3: null,
};

export const ADD_COMMENTS_FORM_STATE_WITH_DATA_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'Test account comment',
  facc_add_free_text_1: 'First free text note',
  facc_add_free_text_2: 'Second free text note',
  facc_add_free_text_3: 'Third free text note',
};

export const ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'A'.repeat(30),
  facc_add_free_text_1: 'B'.repeat(76),
  facc_add_free_text_2: 'C'.repeat(76),
  facc_add_free_text_3: 'D'.repeat(76),
};

export const ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'Test123',
  facc_add_free_text_1: 'ABC123',
  facc_add_free_text_2: 'ABC123',
  facc_add_free_text_3: 'ABC123',
};

export const ADD_COMMENTS_FORM_STATE_CHAR_COUNT_TEST_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'Test', // 4 characters - should show 26 remaining
  facc_add_free_text_1: 'New text', // 8 characters - should show 68 remaining
  facc_add_free_text_2: 'B'.repeat(20), // 20 characters - should show 56 remaining
  facc_add_free_text_3: 'A'.repeat(10), // 10 characters - should show 66 remaining
};

export const ADD_COMMENTS_FORM_STATE_DIFFERENT_LENGTHS_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'A'.repeat(10), // 10 characters - should show 20 remaining
  facc_add_free_text_1: 'B'.repeat(5), // 5 characters - should show 71 remaining
  facc_add_free_text_2: 'C'.repeat(15), // 15 characters - should show 61 remaining
  facc_add_free_text_3: 'D'.repeat(25), // 25 characters - should show 51 remaining
};

export const ADD_COMMENTS_FORM_STATE_EXCEEDS_LIMITS_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'A'.repeat(31), // 31 characters - exceeds 30 limit
  facc_add_free_text_1: 'B'.repeat(77), // 77 characters - exceeds 76 limit
  facc_add_free_text_2: 'C'.repeat(77), // 77 characters - exceeds 76 limit
  facc_add_free_text_3: 'D'.repeat(77), // 77 characters - exceeds 76 limit
};

export const ADD_COMMENTS_FORM_STATE_NON_ALPHANUMERIC_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: '<Test>', // Non-alphanumeric characters
  facc_add_free_text_1: '<Test>', // Non-alphanumeric characters
  facc_add_free_text_2: '<Test>', // Non-alphanumeric characters
  facc_add_free_text_3: '<Test>', // Non-alphanumeric characters
};

export const ADD_COMMENTS_FORM_STATE_MIXED_ERROR_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'A'.repeat(31), // Exceeds 30 char limit
  facc_add_free_text_1: 'B'.repeat(77), // Exceeds 76 char limit
  facc_add_free_text_2: '<Invalid>', // Non-alphanumeric
  facc_add_free_text_3: 'C'.repeat(77), // Exceeds 76 char limit
};

export const ADD_COMMENTS_FORM_STATE_VALID_DATA_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'Valid comment',
  facc_add_free_text_1: 'Valid free text 1',
  facc_add_free_text_2: 'Valid free text 2',
  facc_add_free_text_3: 'Valid free text 3',
};

export const ADD_COMMENTS_FORM_STATE_PARTIAL_DATA_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'Only comment filled',
  facc_add_free_text_1: null,
  facc_add_free_text_2: null,
  facc_add_free_text_3: null,
};

export const ADD_COMMENTS_FORM_STATE_AMENDMENTS_MOCK: IFinesAccAddCommentsFormState = {
  facc_add_comment: 'New comment added',
  facc_add_free_text_1: 'New free text 1',
  facc_add_free_text_2: 'New free text 2',
  facc_add_free_text_3: 'Valid free text line 3',
};

export const MOCK_ACCOUNT_STATE = {
  account_number: '123456789',
  account_id: 1001,
  party_id: 2001,
  business_unit_user_id: 3001,
  business_unit_id: 100,
  party_name: 'John Doe',
  party_type: 'Individual',
  base_version: 1,
};

export const ADD_COMMENTS_API_RESPONSE_MOCK = {
  version: 2,
  defendant_account_id: 789,
  message: 'Account comments notes updated successfully',
  amendments: [
    {
      amendment_id: 'AME001',
      business_unit_id: 123,
      associated_record_type: 'defendant account',
      associated_record_id: 789,
      amended_date: '2024-01-15T10:30:00Z',
      amended_by: 'test.user@hmcts.net',
      field_code: 'ACC_COMMENT',
      old_value: null,
      new_value: 'Test comment added',
      case_reference: null,
      function_code: 'AE',
    },
    {
      amendment_id: 'AME002',
      business_unit_id: 123,
      associated_record_type: 'defendant account',
      associated_record_id: 789,
      amended_date: '2024-01-15T10:30:00Z',
      amended_by: 'test.user@hmcts.net',
      field_code: 'FREE_TEXT_1',
      old_value: null,
      new_value: 'Free text 1 content',
      case_reference: null,
      function_code: 'AE',
    },
  ],
};
