import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from './MajorCreditorsIntercept.mocks';

/**
 * Intercepts the major-creditors reference-data request for a business unit and returns matching rows.
 *
 * @param businessUnitId - Business unit ID used to filter the creditor reference data.
 * @returns Cypress chainable aliased as `getMajorCreditorsByBU`.
 */
export function interceptMajorCreditorsByBU(businessUnitId: number) {
  const filteredCreditors = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData.filter(
    (majorCreditor) => majorCreditor.business_unit_id === businessUnitId,
  );

  return cy
    .intercept('GET', `/opal-fines-service/major-creditors?businessUnit=${businessUnitId}`, {
      statusCode: 200,
      body: { count: filteredCreditors.length, refData: filteredCreditors },
    })
    .as('getMajorCreditorsByBU');
}
