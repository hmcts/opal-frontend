import { vi } from 'vitest';

export const FINES_ACC_ENF_ACTION_ADD_SERVICE_MOCK = {
  mapResultParamsToFormStructure: vi.fn(),
  buildFieldErrors: vi.fn().mockReturnValue({}),
  pairedLanguageValidator: vi.fn().mockReturnValue(() => null),
};
