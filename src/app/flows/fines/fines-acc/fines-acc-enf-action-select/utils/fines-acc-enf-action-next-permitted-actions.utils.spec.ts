import { describe, expect, it } from 'vitest';
import { getNextPermittedActionIds } from './fines-acc-enf-action-next-permitted-actions.utils';

describe('finesAccEnfActionNextPermittedActionsUtils', () => {
  it('should normalise comma separated action ids', () => {
    expect(getNextPermittedActionIds(' NOENF, PRIS,, WOC ')).toEqual(['NOENF', 'PRIS', 'WOC']);
  });

  it('should return an empty array when next enforcement action data is missing', () => {
    expect(getNextPermittedActionIds(null)).toEqual([]);
    expect(getNextPermittedActionIds(undefined)).toEqual([]);
  });
});
