import { IOpalFinesResultRefData } from '../interfaces/opal-fines-result-ref-data.interface';

export const OPAL_FINES_RESULT_REF_DATA_MOCK: IOpalFinesResultRefData = {
  resultId: 'REM',
  resultTitle: 'Reminder of Unpaid Fine',
  resultTitleCy: 'Nodyn atgoffa terfynol am ddirwy heb ei thalu',
  resultType: 'Result',
  active: true,
  impositionAllocationPriority: null,
  impositionCreditor: null,
  imposition: false,
  impositionCategory: null,
  impositionAccruing: false,
  enforcement: true,
  enforcementOverride: false,
  furtherEnforcementWarn: false,
  furtherEnforcementDisallow: false,
  enforcementHold: false,
  requiresEnforcer: false,
  generatesHearing: false,
  collectionOrder: false,
  extendTtpDisallow: false,
  extendTtpPreserveLastEnf: false,
  preventPaymentCard: false,
  listsMonies: false,
  resultParameters:
    '[{ "name":"reason", "prompt":"Reason", "type":"text", "min":1, "max":24, "language_dependent":"false" }]',
};
