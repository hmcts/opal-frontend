import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';

export function interceptDefendantDetails(
  mockOverrides?: Partial<typeof OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK>,
) {
  const mockData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);

  // Apply overrides if provided
  if (mockOverrides) {
    Object.assign(mockData, mockOverrides);
  }

  cy.intercept('GET', '**/defendant-accounts/*/defendant-account-parties', {
    statusCode: 200,
    body: mockData,
  }).as('getDefendantDetails');
}
