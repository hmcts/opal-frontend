interface IOpalFinesAccountDefendantDetailsEnforcementTabRefDataEnforcementOverviewCollectionOrder {
  collection_order_date: string;
  collection_order_flag: boolean;
}
export interface IOpalFinesAccountDefendantDetailsEnforcementTabRefData {
  version: string | null;
  account_status_reference: {
    account_status_code: string;
    account_status_display_name: string;
  };
  defendant_account_type: string;
  employer_flag: boolean;
  enforcement_override: {
    enforcement_override_result: {
      enforcement_override_result_id: string | null;
      enforcement_override_result_name: string | null;
    };
    enforcer: {
      enforcer_id: number;
      enforcer_name: string;
    };
    lja: {
      lja_id: number;
      lja_name: string;
    };
  };
  enforcement_overview: {
    collection_order: IOpalFinesAccountDefendantDetailsEnforcementTabRefDataEnforcementOverviewCollectionOrder | null;
    days_in_default: number;
    enforcement_court: {
      court_id: number;
      court_code: number;
      court_name: string;
    };
  };
  is_hmrc_check_eligible: boolean;
  last_enforcement_action: {
    date_added: string;
    enforcement_action: {
      result_id: string;
      result_title: string;
    };
    enforcer: {
      enforcer_id: number;
      enforcer_name: string;
    };
    reason: string;
    result_responses: Array<{
      parameter_name: string;
      response: string;
    }>;
    warrant_number: string;
  };
  next_enforcement_action_data: string;
}
