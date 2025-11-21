export interface IOpalFinesResultRefData {
  result_id: string;
  result_title: string;
  result_title_cy: string;
  result_type: string;
  active: boolean;
  imposition: boolean;
  imposition_accruing: boolean;
  enforcement: boolean;
  enforcement_override: boolean;
  further_enforcement_warn: boolean;
  further_enforcement_disallow: boolean;
  enforcement_hold: boolean;
  requires_enforcer: boolean;
  generates_hearing: boolean;
  collection_order: boolean;
  extend_ttp_disallow: boolean;
  extend_ttp_preserve_last_enf: boolean;
  prevent_payment_card: boolean;
  lists_monies: boolean;
  result_parameters: string;
}
