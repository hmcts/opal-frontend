import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

export const OPAL_FINES_COURT_REF_DATA_MOCK: IOpalFinesCourtRefData = {
  count: 4,
  refData: [
    {
      court_id: 1865,
      business_unit_id: 61,
      court_code: 101,
      name: 'Historic Debt Database',
      name_cy: null,
      national_court_code: null,
    },
    {
      court_id: 1867,
      business_unit_id: 61,
      court_code: 998,
      name: 'Historic Debt Database',
      name_cy: null,
      national_court_code: null,
    },
    {
      court_id: 1866,
      business_unit_id: 61,
      court_code: 102,
      name: 'HISTORIC DEBT LODGE COURT',
      name_cy: null,
      national_court_code: null,
    },
    {
      court_id: 1868,
      business_unit_id: 61,
      court_code: 999,
      name: 'Port Talbot Justice Centre',
      name_cy: null,
      national_court_code: null,
    },
  ],
};
