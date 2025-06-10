export function interceptUpdateDraftAccount(statusCode: number, responseBody: any) {
  cy.intercept(
    'PATCH',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected&not_submitted_by=L077JG',

    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('@updateRejectedAccounts');
}
export function interceptGetDraftAccount(statusCode: number, responseBody: any) {
  cy.intercept(
    'GET',
    '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected&not_submitted_by=L077JG',

    {
      statusCode: statusCode,
      body: responseBody,
    },
  ).as('@getRejectedAccounts');
}