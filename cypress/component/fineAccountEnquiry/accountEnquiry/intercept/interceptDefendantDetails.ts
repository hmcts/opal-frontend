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
  accountId: String,
  mockData: IOpalFinesAccountDefendantAccountParty,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `**/defendant-accounts/${accountId}/defendant-account-parties/${accountId}`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getDefendantDetails');
}

/**
 * Intercepts the network request for fetching defendant account party details
 * and mocks the response with provided data and headers.
 *
 * @param accountId - The ID of the defendant account.
 * @param pgPartyId - The party ID (can be string or number) for the defendant account party.
 * @param mockData - The mock data to return as the response body.
 * @param respHeaderEtag - The ETag header value to include in the response.
 * @returns Cypress chainable object for further chaining.
 *
 * @example
 * interceptPGDetails(
 *   '12345',
 *   '67890',
 *   { name: 'John Doe', partyType: 'Individual' } as IOpalFinesAccountDefendantAccountParty,
 *   'W/"etag-value"'
 * );
 * cy.wait('@getPGDetails');
 */
export function interceptPGDetails(
  accountId: String,
  pgPartyId: String | number,
  mockData: IOpalFinesAccountDefendantAccountParty,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `**/defendant-accounts/${accountId}/defendant-account-parties/${pgPartyId}`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getPGDetails');
}
