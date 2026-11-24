import { FinesAecTab } from '../types/fines-aec-tab.type';

export const FINES_AEC_TABS = {
  'account-types': 'Account types',
  'enforcement-paths': 'Enforcement paths',
  'run-parameters': 'Run parameters',
  'enforcer-allocation': 'Enforcer allocation',
} as const satisfies Readonly<Record<FinesAecTab, string>>;
