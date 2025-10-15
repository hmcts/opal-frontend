import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '../mocks/defendant_details_at_glance_mock';

export function interceptAtAGlance(mockOverrides?: Partial<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>) {
  const mockData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);

  // Apply overrides if provided
  if (mockOverrides) {
    Object.assign(mockData, mockOverrides);
  }

  cy.intercept('GET', '**/defendant-accounts/*/at-a-glance', {
    statusCode: 200,
    body: mockData,
  }).as('getAtAGlance');
}
