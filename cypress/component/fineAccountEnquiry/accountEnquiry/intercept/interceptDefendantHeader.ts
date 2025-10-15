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
  accountId: number,
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
