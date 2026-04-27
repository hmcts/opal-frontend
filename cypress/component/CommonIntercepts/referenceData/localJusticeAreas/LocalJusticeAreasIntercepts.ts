import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from './LocalJusticeAreasIntercept.mocks';

export function interceptLocalJusticeAreas() {
  return cy
    .intercept('GET', '/opal-fines-service/local-justice-areas', {
      statusCode: 200,
      body: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    })
    .as('getLocalJusticeAreas');
}
