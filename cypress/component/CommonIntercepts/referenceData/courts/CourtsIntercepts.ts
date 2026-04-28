import { OPAL_FINES_COURT_REF_DATA_MOCK } from './CourtsIntercept.mocks';

/**
 * Intercepts the courts reference-data request for a business unit and returns matching courts.
 *
 * @param businessUnitId - Business unit ID used to filter the court reference data.
 * @returns Cypress chainable aliased as `getCourtsByBU`.
 */
export function interceptCourtsByBU(businessUnitId: number) {
  const filteredCourts = OPAL_FINES_COURT_REF_DATA_MOCK.refData.filter(
    (court) => court.business_unit_id === businessUnitId,
  );

  return cy
    .intercept('GET', `/opal-fines-service/courts?business_unit=${businessUnitId}`, {
      statusCode: 200,
      body: { count: filteredCourts.length, refData: filteredCourts },
    })
    .as('getCourtsByBU');
}
