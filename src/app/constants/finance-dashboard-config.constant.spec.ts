import { describe, expect, it } from 'vitest';
import { FINES_EXTERNAL_BANKING_LINKS } from '@app/flows/fines/fines-finance/constants/fines-finance-links.constant';
import { FINANCE_DASHBOARD_CONFIG } from './finance-dashboard-config.constant';
import { FINANCE_LINKS } from './finance-links.constant';

describe('FINANCE_DASHBOARD_CONFIG', () => {
  it('should include Finance and external banking groups', () => {
    expect(FINANCE_DASHBOARD_CONFIG).toEqual({
      title: 'Finance',
      highlights: [],
      groups: [
        {
          id: 'finance-placeholder',
          title: 'Pending development',
          links: FINANCE_LINKS,
        },
        {
          id: 'banking-placeholder',
          title: 'External banking interface',
          links: FINES_EXTERNAL_BANKING_LINKS,
        },
      ],
    });
  });
});
