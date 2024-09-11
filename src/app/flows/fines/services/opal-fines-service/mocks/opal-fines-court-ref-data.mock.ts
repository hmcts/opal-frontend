import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

export const OPAL_FINES_COURT_REF_DATA_MOCK: IOpalFinesCourtRefData = {
  count: 4,
  refData: [
    {
      courtId: 1865,
      businessUnitId: 61,
      courtCode: 101,
      name: 'Historic Debt Database',
      nameCy: null,
      nationalCourtCode: null,
    },
    {
      courtId: 1867,
      businessUnitId: 61,
      courtCode: 998,
      name: 'Historic Debt Database',
      nameCy: null,
      nationalCourtCode: null,
    },
    {
      courtId: 1866,
      businessUnitId: 61,
      courtCode: 102,
      name: 'HISTORIC DEBT LODGE COURT',
      nameCy: null,
      nationalCourtCode: null,
    },
    {
      courtId: 1868,
      businessUnitId: 61,
      courtCode: 999,
      name: 'Port Talbot Justice Centre',
      nameCy: null,
      nationalCourtCode: null,
    },
  ],
};
