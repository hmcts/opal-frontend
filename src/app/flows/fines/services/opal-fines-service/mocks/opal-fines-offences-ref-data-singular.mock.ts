import { IOpalFinesOffencesRefData } from '../interfaces/opal-fines-offences-ref-data.interface';

export const OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK: IOpalFinesOffencesRefData = {
  count: 1,
  refData: [
    {
      offence_id: 314441,
      get_cjs_code: 'AK123456',
      business_unit_id: 52,
      offence_title: 'ak test',
      offence_title_cy: null,
      date_used_from: '2022-11-12T00:00:00',
      date_used_to: null,
      offence_oas: 'act 1 section 12',
      offence_oas_cy: null,
    },
  ],
};
