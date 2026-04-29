import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';

export const FINES_ACC_ENF_ACTION_SELECT_ENFORCEMENT_STATUS_MOCK: IOpalFinesAccountDefendantDetailsEnforcementTabRefData =
  {
    ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
    employer_flag: false,
    next_enforcement_action_data: 'WOC, WOA',
    enforcement_overview: {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.enforcement_overview),
      collection_order: {
        collection_order_date: '2025-12-10',
        collection_order_flag: false,
      },
    },
    last_enforcement_action: {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.last_enforcement_action)!,
      enforcement_action: {
        result_id: 'NOENF',
        result_title: 'No enforcement',
      },
    },
  };
