/**
 * @file user-state.actions.ts
 * @description Shared Cypress helpers for reading the signed-in user's state via the frontend user-state API.
 */

export type UserStateRecord = Record<string, unknown>;

const USER_STATE_ENDPOINT = '/api/user-state';

const isRecord = (value: unknown): value is UserStateRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readFinesDomain = (body: UserStateRecord): UserStateRecord | undefined => {
  const domains = body['domains'];
  if (!isRecord(domains)) return undefined;

  const fines = domains['fines'];
  return isRecord(fines) ? fines : undefined;
};

/**
 * Normalizes both the legacy flat user-state shape and the current domain-shaped response.
 *
 * @param body Raw response body from the signed-in user-state endpoint.
 * @returns User-state body with a flat `business_unit_users` collection for existing test helpers.
 */
export function normalizeUserStateBody(body: unknown): UserStateRecord {
  if (!isRecord(body)) return {};

  const finesDomain = readFinesDomain(body);
  const flatBusinessUnitUsers = body['business_unit_users'];
  const domainBusinessUnitUsers = finesDomain?.['business_unit_users'];

  return {
    ...body,
    business_unit_users: Array.isArray(flatBusinessUnitUsers)
      ? flatBusinessUnitUsers
      : Array.isArray(domainBusinessUnitUsers)
        ? domainBusinessUnitUsers
        : [],
  };
}

/**
 * Requests the signed-in user's state from the same frontend API used by the application.
 *
 * @returns Normalized signed-in user state.
 */
export function requestLoggedInUserState(): Cypress.Chainable<UserStateRecord> {
  return cy
    .request({
      method: 'GET',
      url: USER_STATE_ENDPOINT,
      retryOnStatusCodeFailure: true,
    })
    .then((response) => {
      expect(response.status, `GET ${USER_STATE_ENDPOINT}`).to.eq(200);
      return normalizeUserStateBody(response.body);
    });
}

/**
 * Finds the signed-in user's membership for a business unit.
 *
 * @param userStateBody Normalized user-state body.
 * @param businessUnitId Business unit id to match.
 * @returns Matching business-unit user record, if present.
 */
export function findBusinessUnitUser(
  userStateBody: UserStateRecord,
  businessUnitId: number,
): UserStateRecord | undefined {
  const businessUnitUsers = normalizeUserStateBody(userStateBody)['business_unit_users'];
  if (!Array.isArray(businessUnitUsers)) return undefined;

  return businessUnitUsers.find((value): value is UserStateRecord => {
    if (!isRecord(value)) return false;
    return Number(value['business_unit_id']) === businessUnitId;
  });
}

/**
 * Reads the best available display name from user state.
 *
 * @param userStateBody Normalized user-state body.
 * @returns Display name or username, if present.
 */
export function readUserDisplayName(userStateBody: UserStateRecord): string | null {
  const name = userStateBody['name'];
  if (typeof name === 'string' && name.trim()) return name;

  const username = userStateBody['username'];
  return typeof username === 'string' && username.trim() ? username : null;
}
