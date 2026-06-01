import { vi } from 'vitest';

export const FINES_ACC_ENF_ACTION_ADD_OPAL_FINES_SERVICE_MOCK = {
  addEnforcementAction: vi.fn(),
  clearCache: vi.fn(),
  getEnforcerPrettyName: vi.fn(),
};
