import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';

export const OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK: IOpalFinesResultsRefData = {
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
