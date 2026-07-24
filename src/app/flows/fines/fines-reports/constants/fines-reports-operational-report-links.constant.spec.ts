import { describe, expect, it } from 'vitest';
import { FINES_REPORTS_OPERATIONAL_REPORT_LINKS } from './fines-reports-operational-report-links.constant';

describe('FINES_REPORTS_OPERATIONAL_REPORT_LINKS', () => {
  it('should defer operational report access decisions to report metadata', () => {
    expect(FINES_REPORTS_OPERATIONAL_REPORT_LINKS.map((link) => link.permissionIds)).toEqual([[], []]);
  });
});
