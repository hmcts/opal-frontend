import { vi } from 'vitest';

export const FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK = {
  transformDefendantAccountHeaderForStore: vi.fn(),
  buildEnforcementActionAddPayload: vi.fn(),
};
