import { OPAL_FINES_ENFORCER_REF_DATA_MOCK } from './EnforcersIntercept.mocks';

/**
 * Intercepts the enforcers reference-data request and returns the full mock dataset.
 *
 * @returns Cypress chainable aliased as `getEnforcersByBU`.
 */
export function interceptEnforcers() {
  return cy
    .intercept('GET', '/opal-fines-service/enforcers', {
      statusCode: 200,
      body: OPAL_FINES_ENFORCER_REF_DATA_MOCK,
    })
    .as('getEnforcersByBU');
}
