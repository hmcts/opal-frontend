/**
 * Intercepts a business-unit lookup by ID and returns the supplied response body.
 *
 * @param businessUnitId - Business unit ID used in the request path.
 * @param response - Mock business-unit payload returned for the intercepted request.
 * @returns Cypress chainable aliased as `getBusinessUnitById`.
 */
export function interceptBusinessUnitById(businessUnitId: number, response: any) {
  return cy
    .intercept('GET', `/opal-fines-service/business-units/${businessUnitId}`, {
      statusCode: 200,
      body: response,
    })
    .as('getBusinessUnitById');
}
