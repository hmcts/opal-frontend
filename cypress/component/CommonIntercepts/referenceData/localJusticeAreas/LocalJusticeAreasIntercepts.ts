import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from './LocalJusticeAreasIntercept.mocks';

/**
 * Intercepts the local-justice-areas reference-data request and returns the mock dataset.
 *
 * @returns Cypress chainable aliased as `getLocalJusticeAreas`.
 */
export function interceptLocalJusticeAreas() {
  return cy
    .intercept('GET', '/opal-fines-service/local-justice-areas', {
      statusCode: 200,
      body: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    })
    .as('getLocalJusticeAreas');
}
