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
  ).as('getToRejectedAccounts');
}

export function interceptGetDeletedAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L073JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getDeletedAccounts');
}

