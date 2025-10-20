import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

/**
 * Intercepts the network request for defendant account party details and mocks the response.
 *
 * This function sets up a Cypress intercept for GET requests matching the defendant account party endpoint,
 * returning the provided mock data and ETag header.
 *
 * @param accountId - The unique identifier for the defendant's account.
 * @param mockData - The mock data to return as the response body, conforming to `IOpalFinesAccountDefendantAccountParty`.
 * @param respHeaderEtag - The ETag value to include in the response headers.
 * @returns A Cypress chainable object with the alias 'getDefendantDetails'.
 *
 * @example
 * ```typescript
 * const mockDefendant = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
 * interceptDefendantDetails(mockDefendant, 'W/"123456"');
 * cy.wait('@getDefendantDetails');
 * ```
 */
export function interceptDefendantDetails(
  accountId: number,
  mockData: IOpalFinesAccountDefendantAccountParty,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `**/defendant-accounts/${accountId}/defendant-account-parties/**`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getDefendantDetails');
}
