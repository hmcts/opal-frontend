import { describe, expect, it } from 'vitest';
import { getFinesReportsBusinessUnitId } from './fines-reports-business-unit.utils';

describe('getFinesReportsBusinessUnitId', () => {
  it('should convert the autocomplete selection to a numeric request ID', () => {
    expect(getFinesReportsBusinessUnitId('67')).toBe(67);
  });

  it.each([undefined, null, '', 'all', 'unknown', 'NaN', 'Infinity', '0', '-1', '67.5'])(
    'should omit missing, all-business-unit and invalid selections (%s)',
    (value) => {
      expect(getFinesReportsBusinessUnitId(value)).toBeNull();
    },
  );
});
