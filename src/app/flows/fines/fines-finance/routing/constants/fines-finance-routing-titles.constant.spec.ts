import { describe, expect, it } from 'vitest';
import { FINES_FINANCE_ROUTING_TITLES } from './fines-finance-routing-titles.constant';

describe('FINES_FINANCE_ROUTING_TITLES', () => {
  it('should define titles for finance routes', () => {
    expect(FINES_FINANCE_ROUTING_TITLES).toEqual({
      root: 'finance',
      children: {
        inbound: 'Inbound File Viewer',
        outbound: 'Outbound File Viewer',
        upload: 'Variant Banking File Upload',
      },
    });
  });
});
