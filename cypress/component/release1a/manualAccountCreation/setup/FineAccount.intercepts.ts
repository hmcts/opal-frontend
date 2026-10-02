/**
 * Intercepts HTTP GET requests to fetch a draft account by its ID and mocks the response.
 *
 * @param draftAccountId - The unique identifier of the draft account to intercept.
 * @param response - The mock response body to return for the intercepted request.
 *
 * @example
 * interceptGetDraftAccountById('12345', { id: '12345', status: 'draft' });
 *
 * @remarks
 * This function uses Cypress's `cy.intercept` to stub the backend API call for fetching a draft account.
 * The intercepted request is aliased as 'getDraftAccountById' for use in Cypress tests.
 */
export function interceptGetDraftAccountById(draftAccountId: string, response: any) {
  cy.intercept('GET', `/opal-fines-service/draft-accounts/${draftAccountId}`, {
    statusCode: 200,
    body: response,
  }).as('getDraftAccountById');
}
