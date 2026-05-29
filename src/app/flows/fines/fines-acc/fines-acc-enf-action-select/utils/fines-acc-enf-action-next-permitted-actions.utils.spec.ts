import { describe, expect, it } from 'vitest';
import { getNextPermittedActionIds } from './fines-acc-enf-action-next-permitted-actions.utils';

describe('finesAccEnfActionNextPermittedActionsUtils', () => {
  it('should normalise comma separated action ids', () => {
    expect(getNextPermittedActionIds(' NOENF, PRIS,, WOC ')).toEqual(['NOENF', 'PRIS', 'WOC']);
  });

  it('should return null when the all permitted action id is the only action', () => {
    expect(getNextPermittedActionIds(' ALL ', 'all')).toBeNull();
  });

  it('should keep the all permitted action id when no all permitted action id is supplied', () => {
    expect(getNextPermittedActionIds(' all ')).toEqual(['all']);
  });

  it('should not return null when the all permitted action id is included with other actions', () => {
    expect(getNextPermittedActionIds(' all, NOENF ', 'all')).toEqual(['all', 'NOENF']);
  });

  it('should return an empty array when next enforcement action data is missing', () => {
    expect(getNextPermittedActionIds(null)).toEqual([]);
    expect(getNextPermittedActionIds(undefined)).toEqual([]);
  });
});
