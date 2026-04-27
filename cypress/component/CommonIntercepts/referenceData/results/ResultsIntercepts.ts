import {
  OPAL_FINES_ENF_OVERRIDE_RESULT_REF_DATA_MOCK,
  OPAL_FINES_RESULT_REF_DATA_MOCK,
  OPAL_FINES_RESULTS_REF_DATA_MOCK,
} from './ResultsIntercept.mocks';
import { OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK } from './NextPermittedEnforcementActionsIntercept.mocks';

/**
 * Intercepts the results reference-data request for a set of result IDs and returns matching results.
 *
 * @param resultIds - Result IDs used to build the query string and filter the mock dataset.
 * @returns Cypress chainable aliased as `getResultsByIds`.
 */
export function interceptResultsByIds(resultIds: string[]) {
  const queryParam = resultIds.map((id) => `result_ids=${id}`).join('&');
  const filteredResults = OPAL_FINES_RESULTS_REF_DATA_MOCK.refData.filter((result) =>
    resultIds.includes(result.result_id),
  );

  return cy
    .intercept('GET', `/opal-fines-service/results?${queryParam}`, {
      statusCode: 200,
      body: { count: filteredResults.length, refData: filteredResults },
    })
    .as('getResultsByIds');
}

/**
 * Intercepts a result lookup by code and returns the matching result definition.
 *
 * @param resultCode - Result code used in the request path.
 * @returns Cypress chainable aliased as `getResultByCode`.
 */
export function interceptResultByCode(resultCode: string) {
  const matchedResult = OPAL_FINES_RESULT_REF_DATA_MOCK.find((result) => result.result_id === resultCode);

  return cy
    .intercept(
      {
        method: 'GET',
        pathname: `/opal-fines-service/results/${resultCode}`,
      },
      {
        statusCode: 200,
        body: matchedResult,
      },
    )
    .as('getResultByCode');
}

/**
 * Intercepts the enforcement-override results request and returns the override-specific result list.
 *
 * @returns Cypress chainable aliased as `getEnforcementOverrideResults`.
 */
export function interceptEnforcementOverrideResults() {
  return cy
    .intercept('GET', '/opal-fines-service/results?enforcement_override=true', {
      statusCode: 200,
      body: {
        count: OPAL_FINES_ENF_OVERRIDE_RESULT_REF_DATA_MOCK.refData.length,
        refData: OPAL_FINES_ENF_OVERRIDE_RESULT_REF_DATA_MOCK.refData,
      },
    })
    .as('getEnforcementOverrideResults');
}

/**
 * Intercepts the next-permitted-enforcement-actions request and returns an empty result set.
 *
 * @returns Cypress chainable aliased as `getNextPermittedEnfActions`.
 */
export function interceptNextPermittedEnforcementActionsEmpty() {
  return cy
    .intercept('GET', '/opal-fines-service/results', {
      statusCode: 200,
      body: {
        count: 0,
        refData: [],
      },
    })
    .as('getNextPermittedEnfActions');
}

/**
 * Intercepts the next-permitted-enforcement-actions request for a set of result IDs.
 *
 * @param resultIds - Result IDs used to build the query string and filter the mock dataset.
 * @returns Cypress chainable aliased as `getNextPermittedEnfActions`.
 */
export function interceptNextPermittedEnforcementActions(resultIds: string[]) {
  const queryParam = resultIds.map((id) => `result_ids=${id}`).join('&');
  const filteredResults = OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK.refData.filter((result) =>
    resultIds.includes(result.result_id),
  );

  return cy
    .intercept('GET', `/opal-fines-service/results?${queryParam}`, {
      statusCode: 200,
      body: {
        count: filteredResults.length,
        refData: filteredResults,
      },
    })
    .as('getNextPermittedEnfActions');
}
