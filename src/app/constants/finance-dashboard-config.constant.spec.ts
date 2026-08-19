import { describe, expect, it } from 'vitest';
import { FINES_FINANCE_LINKS } from '@app/flows/fines/fines-finance/constants/fines-finance-links.constant';
import { FINANCE_DASHBOARD_CONFIG } from './finance-dashboard-config.constant';
import { FINANCE_LINKS } from './finance-links.constant';

describe('FINANCE_DASHBOARD_CONFIG', () => {
  it('should include Finance and external banking groups', () => {
    expect(FINANCE_DASHBOARD_CONFIG).toEqual({
      title: 'Finance',
      highlights: [],
      groups: [
        {
          id: 'cash',
          title: 'Cash',
          links: FINANCE_LINKS,
        },
        {
          id: 'bankingInterfaces',
          title: 'External banking interfaces',
          links: FINES_FINANCE_LINKS,
        },
      ],
    });
  });
});
