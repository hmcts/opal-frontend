import { OPAL_FINES_ENFORCER_REF_DATA_MOCK } from './EnforcersIntercept.mocks';

export function interceptEnforcers() {
  return cy
    .intercept('GET', '/opal-fines-service/enforcers', {
      statusCode: 200,
      body: OPAL_FINES_ENFORCER_REF_DATA_MOCK,
    })
    .as('getEnforcersByBU');
}
