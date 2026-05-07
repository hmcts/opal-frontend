import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';

export const FINES_ACC_ENF_ACTION_SELECT_NEXT_PERMITTED_ENF_ACTIONS_MOCK: IOpalFinesResultsRefData = {
  count: 2,
  refData: [
    {
      result_id: 'WOC',
      result_title: 'Warrant of Control',
      result_title_cy: null,
      active: true,
      result_type: 'Result',
      imposition_creditor: '',
      imposition_allocation_order: null,
    },
    {
      result_id: 'WOA',
      result_title: 'Warrant of Arrest',
      result_title_cy: null,
      active: true,
      result_type: 'Result',
      imposition_creditor: '',
      imposition_allocation_order: null,
    },
  ],
};
