export function interceptBusinessUnitById(businessUnitId: number, response: any) {
  return cy
    .intercept('GET', `/opal-fines-service/business-units/${businessUnitId}`, {
      statusCode: 200,
      body: response,
    })
    .as('getBusinessUnitById');
}
