import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';

/**
 * Intercepts the GET request to the defendant accounts "at-a-glance" endpoint and mocks the response.
 *
 * @param accountId - The unique identifier for the account.
 * @param mockData - The mock data to be returned in the response body.
 * @param respHeaderEtag - The value to set for the ETag response header.
 * @returns Cypress chainable object with the intercepted request aliased as 'getAtAGlance'.
 * @example
 * ```typescript
 * const mockAtAGlance: IOpalFinesAccountDefendantAtAGlance = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
 * interceptAtAGlance(mockAtAGlance, 'W/"123456"');
 * cy.wait('@getAtAGlance');
 * ```
 */
export function interceptAtAGlance(
  accountId: number,
  mockData: IOpalFinesAccountDefendantAtAGlance,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `**/defendant-accounts/${accountId}/at-a-glance`, {
      statusCode: 200,
      headers: { ETag: respHeaderEtag },
      body: mockData,
    })
    .as('getAtAGlance');
}
