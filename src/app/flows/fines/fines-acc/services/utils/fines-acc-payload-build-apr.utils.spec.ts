import { describe, expect, it } from 'vitest';
import { buildAprPayload } from './fines-acc-payload-build-apr.utils';

describe('buildAprPayload', () => {
  it.each([' MiXeD-123 ', '123456789012345678', 'Reference/One'])(
    'preserves the entered reference %j exactly',
    (text) => {
      expect(buildAprPayload({ apr_text: text })).toEqual({ apr_text: text });
    },
  );

  it('includes only the APR field without copying unrelated frontend state into the request', () => {
    const formState = { apr_text: 'Reference', savedValue: 'Original', accountId: 141 };

    const result = buildAprPayload(formState);

    expect(result).toEqual({ apr_text: 'Reference' });
    expect(formState).toEqual({ apr_text: 'Reference', savedValue: 'Original', accountId: 141 });
  });
});
