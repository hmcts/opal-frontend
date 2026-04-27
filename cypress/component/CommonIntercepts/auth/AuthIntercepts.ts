import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

/**
 * Intercepts the authenticated-user check and returns a successful SSO response.
 *
 * @returns Cypress chainable aliased as `getAuthenticatedUser`.
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
 * Intercepts the user-state request and returns the provided OPAL user state.
 *
 * @param userState - Mock user state to return from the intercepted request.
 * @returns Cypress chainable aliased as `getUserState`.
 */
export function interceptUserState(userState: IOpalUserState) {
  return cy
    .intercept('GET', '**/users/**/state', {
      statusCode: 200,
      body: userState,
    })
    .as('getUserState');
}
