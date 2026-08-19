import { describe, expect, it } from 'vitest';
import { FINES_FINANCE_BANKING_PATHS } from './fines-finance.constant';

describe('FINES_FINANCE_BANKING_PATHS', () => {
  it('should define finance banking routing paths', () => {
    expect(FINES_FINANCE_BANKING_PATHS).toEqual({
      root: 'finance',
      children: {
        search: 'search',
        finance: 'finance',
        inbound: 'inbound-files',
        outbound: 'outbound-files',
        variantBankingFiles: 'variant-banking-files',
        upload: 'upload',
      },
    });
  });
});
