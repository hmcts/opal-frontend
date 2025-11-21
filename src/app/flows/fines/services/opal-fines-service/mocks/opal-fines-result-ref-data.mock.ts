import { IOpalFinesResultRefData } from '../interfaces/opal-fines-result-ref-data.interface';

export const OPAL_FINES_RESULT_REF_DATA_MOCK: IOpalFinesResultRefData = {
  result_id: 'REM',
  result_title: 'Reminder of Unpaid Fine',
  result_title_cy: 'Nodyn atgoffa terfynol am ddirwy heb ei thalu',
  result_type: 'Result',
  active: true,
  imposition: false,
  imposition_accruing: false,
  enforcement: true,
  enforcement_override: false,
  further_enforcement_warn: false,
  further_enforcement_disallow: false,
  enforcement_hold: false,
  requires_enforcer: false,
  generates_hearing: false,
  collection_order: false,
  extend_ttp_disallow: false,
  extend_ttp_preserve_last_enf: false,
  prevent_payment_card: false,
  lists_monies: false,
  result_parameters:
    '[{ "name":"reason", "prompt":"Reason", "type":"text", "min":1, "max":24, "language_dependent":"false" }]',
};
