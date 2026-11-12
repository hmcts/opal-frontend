import {
  IOpalUserState,
  IOpalUserStateResponse,
  OpalUserStateResponseStatus,
} from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

export const DEFAULT_USER_STATE_DOMAIN = 'fines';

const USER_STATE_STATUS_TO_RESPONSE_STATUS: Record<
  NonNullable<IOpalUserState['status']>,
  OpalUserStateResponseStatus
> = {
  active: 'ACTIVE',
  created: 'PENDING',
  suspended: 'SUSPENDED',
  deactivated: 'DEACTIVATED',
};

export const buildUserStateResponse = (
  userState: IOpalUserState,
  domain: string = DEFAULT_USER_STATE_DOMAIN,
): IOpalUserStateResponse => ({
  user_id: userState.user_id,
  username: userState.username,
  name: userState.name,
  status: userState.status ? USER_STATE_STATUS_TO_RESPONSE_STATUS[userState.status] : null,
  version: userState.version,
  cache_name: null,
  domains: {
    [domain]: {
      business_unit_users: userState.business_unit_users,
    },
  },
});

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
  cy.intercept('GET', '**/users/**/state', {
    statusCode: 200,
    body: userState,
  }).as('getLegacyUserState');

  return cy
    .intercept('GET', '**/api/user-state', {
      statusCode: 200,
      body: buildUserStateResponse(userState),
    })
    .as('getUserState');
}
