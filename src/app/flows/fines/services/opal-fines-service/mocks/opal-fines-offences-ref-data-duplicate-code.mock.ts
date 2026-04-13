import { IOpalFinesOffencesRefData } from '../interfaces/opal-fines-offences-ref-data.interface';

export const OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK: IOpalFinesOffencesRefData = {
  count: 2,
  refData: [
    {
      offence_id: 41799,
      get_cjs_code: 'GMMET001',
      business_unit_id: 52,
      offence_title: 'Duplicate offence title A',
      offence_title_cy: null,
      date_used_from: '1997-11-16T00:00:00Z',
      date_used_to: null,
      offence_oas: 'Offence A',
      offence_oas_cy: null,
    },
    {
      offence_id: 41800,
      get_cjs_code: 'GMMET001',
      business_unit_id: 73,
      offence_title: 'Duplicate offence title B',
      offence_title_cy: null,
      date_used_from: '1998-11-16T00:00:00Z',
      date_used_to: null,
      offence_oas: 'Offence B',
      offence_oas_cy: null,
    },
  ],
};
