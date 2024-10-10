import { IOpalFinesResultsRefData } from '../interfaces/opal-fines-results-ref-data.interface';

export const OPAL_FINES_RESULTS_REF_DATA_MOCK: IOpalFinesResultsRefData = {
  count: 8,
  refData: [
    {
      result_id: 'FCC',
      result_title: 'Criminal Courts Charge',
      result_title_cy: "Ffi'r Llysoedd Troseddol",
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CF',
      imposition_allocation_order: 6,
    },
    {
      result_id: 'FCOMP',
      result_title: 'Compensation',
      result_title_cy: 'Iawndal',
      active: true,
      result_type: 'Result',
      imposition_creditor: 'Any',
      imposition_allocation_order: 1,
    },
    {
      result_id: 'FCOST',
      result_title: 'Costs',
      result_title_cy: 'Costau',
      active: true,
      result_type: 'Result',
      imposition_creditor: '!CPS',
      imposition_allocation_order: 3,
    },
    {
      result_id: 'FCPC',
      result_title: 'Costs to Crown Prosecution Service',
      result_title_cy: 'Costau i Wasanaeth Erlyn y Goron',
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CPS',
      imposition_allocation_order: 3,
    },
    {
      result_id: 'FFR',
      result_title: 'FORFEITED RECOGNISANCE',
      result_title_cy: null,
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CF',
      imposition_allocation_order: 10,
    },
    {
      result_id: 'FO',
      result_title: 'Fine',
      result_title_cy: 'Dirwy',
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CF',
      imposition_allocation_order: null,
    },
    {
      result_id: 'FVEBD',
      result_title: 'Vehicle Excise Back Duty',
      result_title_cy: 'Ôl-dreth ar y Dreth Cerbyd',
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CF',
      imposition_allocation_order: 8,
    },
    {
      result_id: 'FVS',
      result_title: 'Victim Surcharge',
      result_title_cy: 'Gordal Dioddefwr',
      active: true,
      result_type: 'Result',
      imposition_creditor: 'CF',
      imposition_allocation_order: 2,
    },
  ],
};