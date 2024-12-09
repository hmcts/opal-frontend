import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';

export const OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK: IOpalFinesLocalJusticeAreaRefData = {
  count: 5,
  refData: [
    {
      name: 'Asylum & Immigration Tribunal',
      postcode: 'LE1 6ZX',
      address_line_1: 'Arnhem Support Centre',
      local_justice_area_id: 9985,
      lja_code: '9985',
    },
    {
      name: "Avon & Somerset Magistrates' Court",
      postcode: 'BS1 3NU',
      address_line_1: "The Magistrates' Court",
      local_justice_area_id: 5735,
      lja_code: '1450',
    },
    {
      name: "Bedfordshire Magistrates' Court",
      postcode: 'LU1 5BL',
      address_line_1: 'Stuart Street',
      local_justice_area_id: 4165,
      lja_code: '1080',
    },
    {
      name: "Berkshire Magistrates' Court",
      postcode: 'RG1 7TQ',
      address_line_1: 'Civic Centre',
      local_justice_area_id: 4125,
      lja_code: '1920',
    },
    {
      name: "Birmingham and Solihull Magistrates' Court",
      postcode: 'B4 6QA',
      address_line_1: 'Victoria Law Courts',
      local_justice_area_id: 5004,
      lja_code: '2922',
    },
  ],
};
