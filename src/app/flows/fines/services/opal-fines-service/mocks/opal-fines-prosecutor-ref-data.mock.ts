import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';

export const OPAL_FINES_PROSECUTOR_REF_DATA_MOCK: IOpalFinesProsecutorRefData = {
  count: 4,
  ref_data: [
    {
      name: 'Central ticket office',
      prosecutor_code: '998',
      address_line_1: null,
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: null,
      end_date: null,
    },
    {
      name: 'Police force',
      prosecutor_code: '123',
      address_line_1: null,
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: null,
      end_date: null,
    },
    {
      name: 'Other',
      prosecutor_code: '433',
      address_line_1: null,
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: null,
      end_date: null,
    },
  ],
};
