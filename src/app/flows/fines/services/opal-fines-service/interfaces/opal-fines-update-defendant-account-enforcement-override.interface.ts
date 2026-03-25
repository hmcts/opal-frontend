export interface IOpalFinesUpdateDefendantAccountEnforcementOverride {
  enforcement_override_result: {
    enforcement_override_result_id: string | null;
  } | null;
  enforcer: {
    enforcer_id: string | null;
    enforcer_name?: string | null;
  } | null;
  lja: {
    lja_id: string | null;
    lja_name?: string | null;
    lja_code?: string | null;
  } | null;
}
