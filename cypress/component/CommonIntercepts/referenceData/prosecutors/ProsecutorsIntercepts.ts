import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from './ProsecutorsIntercept.mocks';

export function interceptProsecutors() {
  return cy
    .intercept('GET', '/opal-fines-service/prosecutors?business_unit=**', {
      statusCode: 200,
      body: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
    })
    .as('getProsecutorsByBU');
}
