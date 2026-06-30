import { signal } from '@angular/core';
import { vi } from 'vitest';

export const FINES_ACC_ENF_ACTION_ADD_STORE_MOCK = {
  account_id: signal<number | null>(12345),
  base_version: signal<string | null>('1'),
  business_unit_id: signal<string | null>('78'),
  welsh_speaking: signal<string | null>('Y'),
  setAccountState: vi.fn(),
  setSuccessMessage: vi.fn(),
};
