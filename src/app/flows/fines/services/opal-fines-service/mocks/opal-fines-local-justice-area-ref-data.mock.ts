import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data';

export const OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK: IOpalFinesLocalJusticeAreaRefData = {
  count: 5,
  refData: [
    {
      name: 'Asylum & Immigration Tribunal',
      postcode: 'LE1 6ZX',
      addressLine1: 'Arnhem Support Centre',
      localJusticeAreaId: 3865,
      ljaCode: '9985',
    },
    {
      name: "Avon & Somerset Magistrates' Court",
      postcode: 'BS1 3NU',
      addressLine1: "The Magistrates' Court",
      localJusticeAreaId: 5735,
      ljaCode: '1450',
    },
    {
      name: "Bedfordshire Magistrates' Court",
      postcode: 'LU1 5BL',
      addressLine1: 'Stuart Street',
      localJusticeAreaId: 4165,
      ljaCode: '1080',
    },
    {
      name: "Berkshire Magistrates' Court",
      postcode: 'RG1 7TQ',
      addressLine1: 'Civic Centre',
      localJusticeAreaId: 4125,
      ljaCode: '1920',
    },
    {
      name: "Birmingham and Solihull Magistrates' Court",
      postcode: 'B4 6QA',
      addressLine1: 'Victoria Law Courts',
      localJusticeAreaId: 5004,
      ljaCode: '2922',
    },
  ],
};
