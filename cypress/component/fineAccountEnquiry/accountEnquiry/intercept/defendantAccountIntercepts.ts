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
import { IOpalFinesAccountMinorCreditorAtAGlance } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';

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

/**
 * Intercepts the GET request to the minor creditor accounts "at-a-glance" endpoint and mocks the response.
 *
 * @param accountId - The unique identifier for the minor creditor account.
 * @param mockData - The mock data to be returned in the response body.
 * @param respHeaderEtag - The value to set for the ETag response header.
 * @returns Cypress chainable object with the intercepted request aliased as 'getMinorCreditorAtAGlance'.
 */
export function interceptMinorCreditorAtAGlance(
  accountId: number,
  mockData: IOpalFinesAccountMinorCreditorAtAGlance,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `**/minor-creditor-accounts/${accountId}/at-a-glance`, {
      statusCode: 200,
      headers: { ETag: respHeaderEtag },
      body: mockData,
    })
    .as('getMinorCreditorAtAGlance');
}

/**
 * Intercepts repeated GET requests to the minor creditor "at-a-glance" endpoint and
 * returns the next mocked response in sequence on each call.
 *
 * When the number of requests exceeds the number of supplied responses, the final
 * response is reused for subsequent calls.
 *
 * @param accountId - The unique identifier for the minor creditor account.
 * @param responses - Ordered mocked responses to return across calls.
 * @param respHeaderEtag - The value to set for the ETag response header.
 * @returns Cypress chainable object with the alias 'getMinorCreditorAtAGlance'.
 */
export function interceptMinorCreditorAtAGlanceSequence(
  accountId: number,
  responses: IOpalFinesAccountMinorCreditorAtAGlance[],
  respHeaderEtag: string,
) {
  let callCount = 0;

  return cy
    .intercept(
      {
        method: 'GET',
        url: `**/minor-creditor-accounts/${accountId}/at-a-glance`,
        middleware: true,
      },
      (req) => {
        const response = responses[Math.min(callCount, responses.length - 1)];
        callCount += 1;
        req.reply({
          statusCode: 200,
          headers: { ETag: respHeaderEtag },
          body: response,
        });
      },
    )
    .as('getMinorCreditorAtAGlance');
}

/**
 * Intercepts the PATCH request that updates a minor creditor account.
 *
 * @param accountId - The unique identifier for the minor creditor account.
 * @returns Cypress chainable object with the alias 'patchMinorCreditorAccount'.
 */
export function interceptPatchMinorCreditorAccount(accountId: number) {
  return cy
    .intercept('PATCH', `/opal-fines-service/minor-creditor-accounts/${accountId}`, {
      statusCode: 200,
      body: {},
    })
    .as('patchMinorCreditorAccount');
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
  accountId: string | number,
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

export function interceptPutDefendantAccountParty(
  accountId: string | number,
  mockData: IOpalFinesAccountDefendantAccountParty,
) {
  return cy
    .intercept('PUT', `**/defendant-accounts/${accountId}/defendant-account-parties/**`, {
      statusCode: 200,
      body: mockData,
    })
    .as('putDefendantAccountParty');
}

export function interceptPostDefendantAccountParty(
  accountId: string | number,
  mockData: IOpalFinesAccountDefendantAccountParty,
) {
  return cy
    .intercept('POST', `**/defendant-accounts/${accountId}/defendant-account-parties`, {
      statusCode: 200,
      body: mockData,
    })
    .as('postDefendantAccountParty');
}
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';
import { IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-fixed-penalty-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';

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
  accountId: string | number,
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
 * Intercepts the GET request for the minor creditor header summary in Cypress tests,
 * returning a mocked response with the provided header details and ETag header.
 *
 * @param accountId - The unique identifier for the minor creditor account.
 * @param minorCreditorHeaderMock - The mock data for the minor creditor header summary.
 * @param respHeaderEtag - The ETag value to be returned in the response headers.
 * @returns Cypress chainable object with the alias 'getMinorCreditorHeaderSummary'.
 */
export const interceptMinorCreditorHeader = (
  accountId: string | number,
  minorCreditorHeaderMock: IOpalFinesAccountMinorCreditorDetailsHeader,
  respHeaderEtag: string,
) => {
  return cy
    .intercept('GET', `/opal-fines-service/minor-creditor-accounts/${accountId}/header-summary`, {
      statusCode: 200,
      body: minorCreditorHeaderMock,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getMinorCreditorHeaderSummary');
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
  accountId: string,
  pgPartyId: string | number,
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

/**
 * Intercepts the GET request for fixed penalty details of a defendant account and mocks the response.
 *
 * @param accountId - The unique identifier of the defendant account (string or number).
 * @param mockData - The mock data to be returned as the response body, conforming to `IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData`.
 * @param respHeaderEtag - The ETag value to be set in the response headers.
 * @returns A Cypress chainable object with the alias 'getFixedPenaltyDetails' for further command chaining.
 */
export function interceptFixedPenaltyDetails(
  accountId: string | number,
  mockData: IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `/opal-fines-service/defendant-accounts/${accountId}/fixed-penalty`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getFixedPenaltyDetails');
}

export function interceptPaymentTerms(
  accountId: string | number,
  mockData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `/opal-fines-service/defendant-accounts/${accountId}/payment-terms/latest`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getPaymentTerms');
}

export function interceptEnforcementStatus(
  accountId: string | number,
  mockData: IOpalFinesAccountDefendantDetailsEnforcementTabRefData,
  respHeaderEtag: string,
) {
  return cy
    .intercept('GET', `/opal-fines-service/defendant-accounts/${accountId}/enforcement-status`, {
      statusCode: 200,
      body: mockData,
      headers: {
        ETag: respHeaderEtag,
      },
    })
    .as('getEnforcementStatus');
}

export function interceptPatchDefendantAccount() {
  return cy
    .intercept('PATCH', `/opal-fines-service/defendant-accounts/*`, {
      statusCode: 200,
      body: {},
    })
    .as('patchDefendantAccount');
}
