import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

export function interceptAuthenticatedUser() {
  return cy
    .intercept('GET', '/sso/authenticated', {
      statusCode: 200,
      body: { authenticated: true },
    })
    .as('getAuthenticatedUser');
}

export function interceptUserState(userState: IOpalUserState) {
  return cy
    .intercept('GET', '**/users/**/state', {
      statusCode: 200,
      body: userState,
    })
    .as('getUserState');
}
