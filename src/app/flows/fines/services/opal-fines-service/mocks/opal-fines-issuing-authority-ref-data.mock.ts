import { IOpalFinesIssuingAuthorityRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-issuing-authority-ref-data.interface';

export const OPAL_FINES_ISSUING_AUTHORITY_REF_DATA_MOCK: IOpalFinesIssuingAuthorityRefData = {
  count: 4,
  refData: [
    {
      authority_id: 1865,
      business_unit_id: 61,
      authority_code: 101,
      name: 'Police force',
      name_cy: null,
      national_authority_code: null,
    },
    {
      authority_id: 1867,
      business_unit_id: 61,
      authority_code: 998,
      name: 'Central ticket office',
      name_cy: null,
      national_authority_code: null,
    },
    {
      authority_id: 1866,
      business_unit_id: 61,
      authority_code: 102,
      name: 'Other',
      name_cy: null,
      national_authority_code: null,
    },
  ],
};
