export function interceptGetToReviewAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L073JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getToReviewAccounts');
}

export function interceptGetRejectedAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L073JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getToReviewAccounts');
}

export function interceptGetDeletedAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L073JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getToReviewAccounts');
}
export function interceptGetAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    {
      method: 'GET',
      url: 'http://localhost:4550/testing-support/token/user',
      headers: {
        'X-User-Email': 'opal-test-10@hmcts.net',
      },
    },
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getUser10');
}
