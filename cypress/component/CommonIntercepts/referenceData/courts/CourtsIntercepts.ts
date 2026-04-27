import { OPAL_FINES_COURT_REF_DATA_MOCK } from './CourtsIntercept.mocks';

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
