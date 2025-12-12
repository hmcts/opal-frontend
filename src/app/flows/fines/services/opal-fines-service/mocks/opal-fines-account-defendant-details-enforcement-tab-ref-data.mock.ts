import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '../interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantDetailsEnforcementTabRefData =
  {
    version: '1',
    account_status_reference: {
      account_status_code: 'L',
      account_status_display_name: 'Live',
    },
    defendant_account_type: 'adult',
    employer_flag: true,
    enforcement_override: {
      enforcement_override_result: {
        enforcement_override_result_id: 'EOR123',
        enforcement_override_result_name: 'Override Result Name',
      },
      enforcer: {
        enforcer_id: 1,
        enforcer_name: 'Test Enforcer',
      },
      lja: {
        lja_id: 1,
        lja_name: 'Test LJA',
      },
    },
    enforcement_overview: {
      collection_order: {
        collection_order_date: '2025-12-10',
        collection_order_flag: true,
      },
      days_in_default: 30,
      enforcement_court: {
        court_id: 123,
        court_name: 'Test Court',
      },
    },
    is_hmrc_check_eligible: true,
    last_enforcement_action: {
      date_added: '2025-12-10T10:07:58.148Z',
      enforcement_action: {
        result_id: 'EA123',
        result_title: 'Enforcement Action Title',
      },
      enforcer: {
        enforcer_id: 1,
        enforcer_name: 'Test Enforcer',
      },
      reason: 'Test reason for enforcement action',
      result_responses: [
        {
          parameter_name: 'param1',
          response: 'response1',
        },
        {
          parameter_name: 'param2',
          response: 'response2',
        },
      ],
      warrant_number: 'WN123456',
    },
    next_enforcement_action_data: 'Next action data',
  };
