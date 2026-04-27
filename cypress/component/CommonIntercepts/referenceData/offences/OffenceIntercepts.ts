import { OPAL_FINES_OFFENCES_REF_DATA_MOCK, OPAL_OFFENCE_BY_ID_MOCK } from './OffenceIntercept.mocks';

export function interceptOffences() {
  return cy
    .intercept(
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
    )
    .as('getOffenceByCjsCode');
}

export function interceptOffencesById(offenceId: number) {
  const matchedOffence = OPAL_OFFENCE_BY_ID_MOCK.find((offence) => offence.offenceId === offenceId);

  return cy
    .intercept(
      {
        method: 'GET',
        pathname: `/opal-fines-service/offences/${offenceId}`,
      },
      {
        statusCode: 200,
        body: matchedOffence,
      },
    )
    .as('getOffenceById');
}
