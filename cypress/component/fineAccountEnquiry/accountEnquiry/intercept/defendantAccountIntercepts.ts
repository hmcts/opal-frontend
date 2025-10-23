/**
 * Intercepts the POST request to the `/opal-fines-service/notes/add` endpoint during Cypress tests.
 *
 * This function mocks the network request by returning a 201 status code with an empty response body.
 * No response data is needed, as there is no behavior based on the response content.
 * The intercepted request is aliased as `postAddNotes` for use in assertions or waiting within tests.
 */
export function interceptAddNotes() {
  return cy
    .intercept('POST', '/opal-fines-service/notes/add', {
      statusCode: 201,
      body: {},
    })
    .as('postAddNotes');
}
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
  accountId: String | number,
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
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';

/**
 * Intercepts the GET request for the defendant header summary in Cypress tests,
 * returning a mocked response with the provided defendant header details and ETag header.
 *
 * @param accountId - The unique identifier for the defendant's account.
 * @param defendantHeaderMock - The mock data for the defendant header summary, conforming to `IOpalFinesAccountDefendantDetailsHeader`.
 * @param respHeaderEtag - The ETag value to be returned in the response headers.
 * @returns Cypress chainable object with the alias 'getDefendantHeaderSummary'.
 *
 * @example
 * interceptDefendantHeader(
 *   12345,
 *   {
 *     name: 'John Doe',
 *     dob: '1990-01-01',
 *     accountStatus: 'Active'
 *   },
 *   'W/"123456789"'
 * );
 * // Now, any GET request to `/opal-fines-service/defendant-accounts/12345/header-summary`
 * // will be intercepted and responded to with the mock data and ETag.
 */

export const interceptDefendantHeader = (
  accountId: String | number,
  defendantHeaderMock: IOpalFinesAccountDefendantDetailsHeader,
  respHeaderEtag: string,
) => {
  return cy
    .intercept('GET', `/opal-fines-service/defendant-accounts/${accountId}/header-summary`, {
      statusCode: 200,
      body: defendantHeaderMock,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getDefendantHeaderSummary');
};
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
