import { IOpalFinesResultRefData } from '../../../../services/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';

/**
 * Mock result data for enforcement actions
 */
export const MOCK_RESULT_DATA: IOpalFinesResultRefData = {
  result_id: 'ENF123',
  result_title: 'Test Enforcement Action',
  result_title_cy: 'Gweithred Orfodi Prawf',
  result_type: 'ENFORCEMENT',
  active: true,
  imposition: false,
  imposition_category: undefined,
  imposition_allocation_priority: undefined,
  imposition_accruing: false,
  imposition_creditor: undefined,
  enforcement: true,
  enforcement_override: false,
  further_enforcement_warn: false,
  further_enforcement_disallow: false,
  enforcement_hold: false,
  requires_enforcer: true,
  generates_hearing: false,
  generates_warrant: undefined,
  collection_order: false,
  extend_ttp_disallow: false,
  extend_ttp_preserve_last_enf: false,
  prevent_payment_card: false,
  lists_monies: false,
  result_parameters: '{}',
  allow_payment_terms: undefined,
  requires_employment_data: undefined,
  allow_additional_action: undefined,
  enf_next_permitted_actions: undefined,
  requires_lja: undefined,
  manual_enforcement: undefined,
};
