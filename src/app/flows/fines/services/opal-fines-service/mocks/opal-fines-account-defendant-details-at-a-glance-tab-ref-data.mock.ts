import { IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData } from '../interfaces/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData =
  {
    version: 0,
    defendant_account_id: 'DEF-001',
    account_number: 'ACC-123456',
    debtor_type: 'PERSON',
    is_youth: false,
    party_details: {
      party_id: 'PARTY-001',
      organisation_flag: true,
      organisation_details: {
        organisation_name: 'Test Organisation',
        organisation_aliases: null,
      },
      individual_details: null,
    },
    address: {
      address_line_1: '123 Main Street',
      address_line_2: 'Apt 4',
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      post_code: 'AB12 3CD',
    },
    language_preferences: {
      document_language: {
        language_code: 'EN',
        language_display_name: 'English only',
      },
      hearing_language: {
        language_code: 'CY',
        language_display_name: 'Welsh and English',
      },
    },
    payment_terms: {
      payment_terms_type: {
        payment_terms_type_code: 'B',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '01/01/2024',
      instalment_period: {
        installment_period_code: 'M',
        installment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 1000,
      instalment_amount: 100,
    },
    enforcement_status: {
      last_enforcement_action: {
        enforcement_action_id: 'EA-001',
        enforcement_action_title: 'Warrant Issued',
      },
      collection_order_made: true,
      default_days_in_jail: 0,
      enforcement_override: {
        enforcement_override_result: {
          enforcement_override_result_id: 'EOR-001',
          enforcement_override_result_title: 'Override Approved',
        },
        enforcer: {
          enforcer_id: 10,
          enforcer_name: 'Court Officer',
        },
        lja: {
          lja_id: 20,
          lja_name: 'Central LJA',
        },
      },
      last_movement_date: '01/05/2024',
    },
    comment_and_notes: {
      account_comment: 'Account reviewed.',
      free_text_note_1: 'First note.',
      free_text_note_2: 'Second note.',
      free_text_note_3: null,
    },
  };
