export interface IFinesMacPaymentTermsEnforcementResultResponse {
  parameter_name: string | null;
  response: string | null;
}

export interface IFinesMacPaymentTermsEnforcement {
  result_id: string | null;
  enforcement_result_responses: IFinesMacPaymentTermsEnforcementResultResponse[] | null;
}

export interface IFinesMacPaymentTerms {
  payment_terms_type_code: string | null;
  effective_date: string | null;
  instalment_period: string | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
  default_days_in_jail: number | null;
  enforcements: IFinesMacPaymentTermsEnforcement[] | null;
}
