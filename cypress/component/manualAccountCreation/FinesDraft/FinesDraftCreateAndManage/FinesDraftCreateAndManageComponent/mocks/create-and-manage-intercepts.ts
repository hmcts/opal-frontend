export function interceptGetRejectedAccounts(statusCode: number, responseBody: any) {
  cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected*', {
    statusCode: statusCode,
    body: responseBody,
  }).as('getRejectedAccounts');
}

export function interceptGetInReviewAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L077JG',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getInReviewAccounts');
}

export function interceptGetApprovedAccounts(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Published&submitted_by=L077JG&account_status_date_from=*&account_status_date_to=*',
    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('getApprovedAccounts');
}

export function interceptGetDeletedAccounts(statusCode: number, responseBody: any) {
  cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Deleted*', {
    statusCode: statusCode,
    body: responseBody,
  }).as('getDeletedAccounts');
}
export function interceptGetAllRejectedAccounts(statusCode: number, responseBody: any) {
  cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected*', {
    statusCode: statusCode,
    body: responseBody,
  }).as('getAllRejectedAccounts');
}
export function interceptGetAllRejectedAccountsList(statusCode: number, responseBody: any) {
  cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected*', {
    statusCode: statusCode,
    body: responseBody,
  }).as('getAllRejectedAccounts');
}
