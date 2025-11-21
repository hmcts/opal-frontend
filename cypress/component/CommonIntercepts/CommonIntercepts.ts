import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import {
  OPAL_FINES_COURT_REF_DATA_MOCK,
  OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
  OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
  OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
  OPAL_FINES_RESULTS_REF_DATA_MOCK,
  OPAL_OFFENCE_BY_ID_MOCK,
  OPAL_FINES_OFFENCES_REF_DATA_MOCK,
} from './CommonIntercept.mocks';

/**
 * Intercepts HTTP GET requests to the offences endpoint and mocks the response
 * with offence data filtered by the requested CJS code.
 *
 * @returns Cypress chainable object for further command chaining.
 *
 * @example
 * ```typescript
 * interceptOffences();
 * cy.wait('@getOffenceByCjsCode');
 * ```
 */
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

/** * Intercepts HTTP GET requests to fetch an offence by its ID and mocks the response
 * with the corresponding offence data from the mock dataset.
 *
 * @param offenceId - The unique identifier of the offence to intercept.
 * @returns Cypress chainable object for further command chaining.
 *
 * @example
 * ```typescript
 * interceptOffencesById(314441);
 * cy.wait('@getOffenceById');
 * ```
 */
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

/**
 * Intercepts the GET request to the `/sso/authenticated` endpoint and mocks the response
 * to indicate that the user is authenticated.
 *
 * @returns Cypress.Chainable<Cypress.Interception> - The Cypress chainable object for further chaining.
 *
 * @example
 * // Usage in a Cypress test
 * interceptAuthenticatedUser();
 * cy.visit('/dashboard');
 * cy.wait('@getAuthenticatedUser');
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
 * Intercepts HTTP GET requests to the user state endpoint and mocks the response with the provided user state object.
 *
 * @param userState - The user state object to be returned in the mocked response.
 * @returns Cypress chainable object for further command chaining.
 *
 * @example
 * ```typescript
 * const mockUserState: IOpalUserState = structuredClone(USER_STATE_MOCK_PERMISSION_BU77);
 * interceptUserState(mockUserState);
 * cy.wait('@getUserState');
 * ```
 */
export function interceptUserState(userState: IOpalUserState) {
  return cy
    .intercept('GET', '**/users/**/state', {
      statusCode: 200,
      body: userState,
    })
    .as('getUserState');
}

/**
 * Intercepts a GET request to fetch a business unit by its ID and mocks the response.
 *
 * @param businessUnitId - The unique identifier of the business unit to intercept.
 * @param response - The mock response body to return for the intercepted request.
 *
 * @example
 * interceptBusinessUnitById(123, { id: 123, name: 'Test Unit' });
 *
 * @remarks
 * This function uses Cypress's `cy.intercept` to stub the API call and assigns an alias 'getBusinessUnitById' for later reference.
 */
export function interceptBusinessUnitById(businessUnitId: number, response: any) {
  return cy
    .intercept('GET', `/opal-fines-service/business-units/${businessUnitId}`, {
      statusCode: 200,
      body: response,
    })
    .as('getBusinessUnitById');
}

export function interceptCourtsByBU(businessUnitId: number) {
  const courts = OPAL_FINES_COURT_REF_DATA_MOCK;
  const filteredCourts = courts.refData.filter((court) => court.business_unit_id === businessUnitId);
  const response = { count: filteredCourts.length, refData: filteredCourts };

  return cy
    .intercept('GET', `/opal-fines-service/courts?business_unit=${businessUnitId}`, {
      statusCode: 200,
      body: response,
    })
    .as('getCourtsByBU');
}

export function interceptMajorCreditorsByBU(businessUnitId: number) {
  const majorCreditors = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
  const filteredCreditors = majorCreditors.refData.filter((mc) => mc.business_unit_id === businessUnitId);
  const response = { count: filteredCreditors.length, refData: filteredCreditors };

  return cy
    .intercept('GET', `/opal-fines-service/major-creditors?businessUnit=${businessUnitId}`, {
      statusCode: 200,
      body: response,
    })
    .as('getMajorCreditorsByBU');
}

export function interceptLocalJusticeAreas() {
  return cy
    .intercept('GET', `/opal-fines-service/local-justice-areas`, {
      statusCode: 200,
      body: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    })
    .as('getLocalJusticeAreas');
}

export function interceptResultsByIds(resultIds: string[]) {
  const results = OPAL_FINES_RESULTS_REF_DATA_MOCK;
  const queryParam = resultIds.map((id) => `result_ids=${id}`).join('&');
  const filteredResults = results.refData.filter((result) => resultIds.includes(result.result_id));
  return cy
    .intercept('GET', `/opal-fines-service/results?${queryParam}`, {
      statusCode: 200,
      body: { count: filteredResults.length, refData: filteredResults },
    })
    .as('getResultsByIds');
}

export function interceptProsecutors() {
  const prosecutors = OPAL_FINES_PROSECUTOR_REF_DATA_MOCK;
  return cy
    .intercept('GET', `/opal-fines-service/prosecutors?business_unit=**`, {
      statusCode: 200,
      body: prosecutors,
    })
    .as('getProsecutorsByBU');
}

export function interceptRefDataForReviewAccount(businessUnitId: number) {
  interceptCourtsByBU(businessUnitId);
  interceptMajorCreditorsByBU(businessUnitId);
  interceptLocalJusticeAreas();
  interceptResultsByIds(['FCOMP', 'FVS', 'FCOST', 'FCPC', 'FO', 'FCC', 'FVEBD', 'FFR']);
  interceptProsecutors();
}
