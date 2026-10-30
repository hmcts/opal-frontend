import { OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK } from 'cypress/component/CommonIntercepts/referenceData/results/NextPermittedEnforcementActionsIntercept.mocks';

export const INACTIVE_ENFORCEMENT_ACTIONS_MOCK = ['PGPAY', 'NAWT'].map((resultId) => ({
  ...OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK.refData[0],
  result_id: resultId,
  result_title: resultId,
  active: false,
}));
