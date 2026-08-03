import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { createDraftFragmentStream } from './fines-draft-fragment-stream.utils';

describe('createDraftFragmentStream', () => {
  it('should preserve the initial fragment without clearing the cache', () => {
    const clearCache = vi.fn();
    const fragments: string[] = [];

    createDraftFragmentStream(of('review'), clearCache).subscribe((fragment) => fragments.push(fragment));

    expect(fragments).toEqual(['review']);
    expect(clearCache).not.toHaveBeenCalled();
  });

  it('should clear the cache for every fragment after the initial emission', () => {
    const clearCache = vi.fn();
    const fragments: string[] = [];

    createDraftFragmentStream(of('review', 'approved', 'deleted'), clearCache).subscribe((fragment) =>
      fragments.push(fragment),
    );

    expect(fragments).toEqual(['review', 'approved', 'deleted']);
    expect(clearCache).toHaveBeenCalledTimes(2);
  });
});
