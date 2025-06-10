export function interceptCAVGetToReviewAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&not_submitted_by=L077JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getToReviewAccounts');
}

export function interceptCAVGetRejectedAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected&not_submitted_by=L077JG',

    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getRejectedAccounts');
}

export function interceptCAVGetDeletedAccounts(statusCode: number, responseBody: any) {
  cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Deleted&not_submitted_by=L077JG', {
    statusCode: statusCode,
    body: responseBody,
  }).as('getDeletedAccounts');
}

