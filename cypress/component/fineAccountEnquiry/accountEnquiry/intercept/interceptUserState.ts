import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

/**
 * Intercepts the GET request to the `/sso/authenticated` endpoint and mocks the response
 * to indicate that the user is authenticated.
 *
 * @returns Cypress.Chainable<Cypress.Interception> - The Cypress chainable object for further chaining.
 *
 * @example
 * // Usage in a Cypress test
 * interceptAuthenticatedUser();
 * cy.visit('/dashboard');
 * cy.wait('@getAuthenticatedUser');
 */
export function interceptAuthenticatedUser() {
  return cy
    .intercept('GET', '/sso/authenticated', {
      statusCode: 200,
      body: { authenticated: true },
    })
    .as('getAuthenticatedUser');
}

/**
 * Intercepts HTTP GET requests to the user state endpoint and mocks the response with the provided user state object.
 *
 * @param userState - The user state object to be returned in the mocked response.
 * @returns Cypress chainable object for further command chaining.
 *
 * @example
 * ```typescript
 * const mockUserState: IOpalUserState = structuredClone(USER_STATE_MOCK_PERMISSION_BU77);
 * interceptUserState(mockUserState);
 * cy.wait('@getUserState');
 * ```
 */
export function interceptUserState(userState: IOpalUserState) {
  return cy
    .intercept('GET', '**/users/**/state', {
      statusCode: 200,
      body: userState,
    })
    .as('getUserState');
}
