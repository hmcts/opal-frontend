import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';

export function interceptOffences() {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/opal-fines-service/offences',
    },
    (req) => {
      const requestedCjsCode = req.query['q'];
      const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
        (offence) => offence.get_cjs_code === requestedCjsCode,
      );
      req.reply({
        count: matchedOffences.length,
        refData: matchedOffences,
      });
    },
  ).as('getOffenceByCjsCode');
}
