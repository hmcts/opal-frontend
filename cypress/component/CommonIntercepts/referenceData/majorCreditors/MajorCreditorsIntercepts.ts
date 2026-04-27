import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from './MajorCreditorsIntercept.mocks';

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
